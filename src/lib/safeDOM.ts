"use client";

/**
 * Safe DOM Mutation Polyfill for React & Browser Extensions
 * 
 * Prevents:
 * "NotFoundError: Failed to execute 'removeChild' on 'Node': The node to be removed is not a child of this node."
 * "NotFoundError: Failed to execute 'insertBefore' on 'Node': The node before which the new node is to be inserted is not a child of this node."
 * 
 * Root Cause:
 * Browser extensions like Google Translate, DeepL, Grammarly, and password managers wrap or move
 * DOM nodes (e.g. wrapping text nodes in <font> tags or injecting input helper icons).
 * When React's reconciler attempts to unmount or update components, it calls native DOM removal methods
 * assuming its original parent hierarchy. This patch intercepts and safely handles reparented or detached nodes.
 */

export function installSafeDOMPatches() {
  if (typeof window === "undefined" || typeof Node === "undefined") {
    return;
  }

  // Ensure patch is only applied once
  if ((window as any).__KFS_SAFE_DOM_PATCHED__) {
    return;
  }
  (window as any).__KFS_SAFE_DOM_PATCHED__ = true;

  // 1. Patch removeChild
  const originalRemoveChild = Node.prototype.removeChild;
  Node.prototype.removeChild = function <T extends Node>(child: T): T {
    if (!child) {
      return child;
    }

    // If child is no longer a child of `this` (e.g. wrapped in <font> by Google Translate)
    if (child.parentNode !== this) {
      if (child.parentNode) {
        try {
          return child.parentNode.removeChild(child) as T;
        } catch (_err) {
          // Child might have already been detached
          return child;
        }
      }
      // Child is completely detached from the DOM, return cleanly without throwing NotFoundError
      return child;
    }

    try {
      return originalRemoveChild.call(this, child) as T;
    } catch (err: any) {
      if (err?.name === "NotFoundError" || err?.message?.includes("not a child")) {
        if (child.parentNode) {
          try {
            return child.parentNode.removeChild(child) as T;
          } catch (_) {
            return child;
          }
        }
        return child;
      }
      throw err;
    }
  };

  // 2. Patch insertBefore
  const originalInsertBefore = Node.prototype.insertBefore;
  Node.prototype.insertBefore = function <T extends Node>(newNode: T, referenceNode: Node | null): T {
    if (!newNode) {
      return newNode;
    }

    // If referenceNode is supplied but not a child of `this`
    if (referenceNode && referenceNode.parentNode !== this) {
      if (referenceNode.parentNode) {
        try {
          return referenceNode.parentNode.insertBefore(newNode, referenceNode) as T;
        } catch (_err) {
          // Fallback to inserting at the end of this container
          try {
            return originalInsertBefore.call(this, newNode, null) as T;
          } catch (_) {
            return newNode;
          }
        }
      }
      try {
        return originalInsertBefore.call(this, newNode, null) as T;
      } catch (_) {
        return newNode;
      }
    }

    try {
      return originalInsertBefore.call(this, newNode, referenceNode) as T;
    } catch (err: any) {
      if (err?.name === "NotFoundError" || err?.message?.includes("not a child")) {
        try {
          return originalInsertBefore.call(this, newNode, null) as T;
        } catch (_) {
          return newNode;
        }
      }
      throw err;
    }
  };

  // 3. Patch replaceChild
  const originalReplaceChild = Node.prototype.replaceChild;
  Node.prototype.replaceChild = function <T extends Node>(newChild: Node, oldChild: T): T {
    if (!newChild || !oldChild) {
      return oldChild;
    }

    if (oldChild.parentNode !== this) {
      if (oldChild.parentNode) {
        try {
          return oldChild.parentNode.replaceChild(newChild, oldChild) as T;
        } catch (_) {
          return oldChild;
        }
      }
      try {
        return this.appendChild(newChild) as any;
      } catch (_) {
        return oldChild;
      }
    }

    try {
      return originalReplaceChild.call(this, newChild, oldChild) as T;
    } catch (err: any) {
      if (err?.name === "NotFoundError" || err?.message?.includes("not a child")) {
        try {
          return this.appendChild(newChild) as any;
        } catch (_) {
          return oldChild;
        }
      }
      throw err;
    }
  };
}

// Auto-run on module evaluation in browser
if (typeof window !== "undefined") {
  installSafeDOMPatches();
}

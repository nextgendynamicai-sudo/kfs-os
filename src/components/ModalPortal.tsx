"use client";

import { useEffect, useState, ReactNode } from "react";
import { createPortal } from "react-dom";

interface ModalPortalProps {
  children: ReactNode;
}

export function ModalPortal({ children }: ModalPortalProps) {
  const [container, setContainer] = useState<HTMLElement | null>(null);

  useEffect(() => {
    let portalRoot = document.getElementById("kfs-modal-portal-root");
    if (!portalRoot) {
      portalRoot = document.createElement("div");
      portalRoot.id = "kfs-modal-portal-root";
      portalRoot.className = "notranslate";
      portalRoot.setAttribute("translate", "no");
      document.body.appendChild(portalRoot);
    }
    setContainer(portalRoot);
  }, []);

  if (!container) return null;

  return createPortal(children, container);
}

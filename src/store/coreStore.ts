import { useState, useEffect } from 'react';

type Listener<T> = (state: T) => void;

export function createStore<T>(initialState: T) {
  let state = initialState;
  const listeners = new Set<Listener<T>>();

  const subscribe = (listener: Listener<T>) => {
    listeners.add(listener);
    return () => { listeners.delete(listener); };
  };

  const setState = (partial: Partial<T> | ((state: T) => Partial<T>)) => {
    const nextState = typeof partial === 'function' ? (partial as any)(state) : partial;
    state = { ...state, ...nextState };
    listeners.forEach(listener => listener(state));
  };

  const getState = () => state;

  const useStore = (): T => {
    const [localState, setLocalState] = useState(state);
    
    useEffect(() => {
      const unsubscribe = subscribe(setLocalState);
      return unsubscribe;
    }, []);
    
    return localState;
  };

  return { getState, setState, subscribe, useStore };
}

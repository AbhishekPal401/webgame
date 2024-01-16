import { useState, useEffect } from "react";

export const useCachedState = (key, defaultValue) => {
  const getInitialState = () => {
    const storedState = JSON.parse(localStorage.getItem(key));
    return storedState !== null ? storedState : defaultValue;
  };

  const initialState = JSON.parse(localStorage.getItem(key)) || defaultValue;

  const [state, setState] = useState(initialState);

  useEffect(() => {
    const state = getInitialState();
    setState(state);
  }, []);

  const updateState = (newState) => {
    localStorage.setItem(key, JSON.stringify(newState));
    setState(newState);
  };

  return [state, updateState];
};

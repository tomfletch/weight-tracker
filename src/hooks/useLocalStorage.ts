import { useState, useEffect } from 'react';

function getStorageValue(key: string, defaultValue: any): any {
  const saved = localStorage.getItem(key);
  if (!saved) { return defaultValue; }
  return JSON.parse(saved);
}

function setStorageValue(key: string, value: any): void {
  localStorage.setItem(key, JSON.stringify(value));
}

function useLocalStorage(key: string, defaultValue: any) {
  const [value, setValue] = useState(() => {
    return getStorageValue(key, defaultValue);
  });

  useEffect(() => {
    setStorageValue(key, value);
  }, [key, value])

  return [value, setValue];
}

export default useLocalStorage;
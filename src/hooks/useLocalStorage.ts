import { useState, useEffect } from 'react';

function getStorageValue(key: string, defaultValue: any): any {
  const saved = localStorage.getItem(key);
  if (!saved) { return defaultValue; }
  return JSON.parse(saved);
}

function setStorageValue(key: string, value: any): void {
  localStorage.setItem(key, JSON.stringify(value));
}

function useLocalStorage<T>(key: string, defaultValue: T) {
  const [value, setValue] = useState<T>(() => getStorageValue(key, defaultValue));

  useEffect(() => {
    setStorageValue(key, value);
  }, [key, value]);

  return [value, setValue] as const;
}

export default useLocalStorage;

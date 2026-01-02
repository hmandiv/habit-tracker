export const setItem = (key: string, value: unknown): void => {
  localStorage.setItem(key, JSON.stringify(value));
};

export const getItem = (key: string): unknown => {
  const raw = localStorage.getItem(key);
  if (raw === null) return null;

  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
};

export const removeItem = (key: string): void => {
  localStorage.removeItem(`${key}`);
};

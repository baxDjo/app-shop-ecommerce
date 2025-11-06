export function withLocalStorage<T>(
  key: string,
  initial: T
): { get: () => T; set: (v: T) => void } {
  return {
    get: () => {
      try {
        const raw = localStorage.getItem(key);
        return raw ? (JSON.parse(raw) as T) : initial;
      } catch {
        return initial;
      }
    },
    set: (v: T) => localStorage.setItem(key, JSON.stringify(v))
  };
}

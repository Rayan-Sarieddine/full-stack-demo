export const local = (key: string, value?: string): void | string | null => {
  try {
    if (value !== undefined) {
      localStorage.setItem(key, value);
    } else {
      return localStorage.getItem(key);
    }
  } catch (error) {
    console.error("Error accessing localStorage:", error);
  }
};

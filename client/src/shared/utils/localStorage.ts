/**
 * A collection of utilities for interacting with the browser's localStorage
 * with automatic JSON serialization and error handling.
 */

/**
 * Retrieves an item from localStorage and parses it from JSON.
 * * @template T - The expected type of the returned value.
 * @param {string} key - The unique identifier for the stored data.
 * @returns {T | null} The parsed data if found and valid, otherwise null.
 */
export const getFromStorage = <T>(key: string): T | null => {
  try {
    const raw = localStorage.getItem(key);
    if (raw === null) return null;

    return JSON.parse(raw) as T;
  } catch (error) {
    console.error(`Error reading key "${key}" from localStorage:`, error);
    return null;
  }
};

/**
 * Serializes data to JSON and saves it to localStorage.
 * * @param {string} key - The unique identifier for the data.
 * @param {unknown} value - The data to store (will be stringified).
 */
export const saveToStorage = (key: string, value: unknown): void => {
  try {
    const serializedValue = JSON.stringify(value);
    localStorage.setItem(key, serializedValue);
  } catch (error) {
    // quota exceeded or circular reference
    console.error(`Error saving key "${key}" to localStorage:`, error);
  }
};

/**
 * Removes a specific item from localStorage.
 * * @param {string} key - The identifier of the item to be removed.
 */
export const removeFromStorage = (key: string): void => {
  try {
    localStorage.removeItem(key);
  } catch (error) {
    console.error(`Error removing key "${key}" from localStorage:`, error);
  }
};

/**
 * Clears all data from localStorage.
 */
export const clearStorage = (): void => {
  try {
    localStorage.clear();
  } catch (error) {
    console.error('Error clearing localStorage:', error);
  }
};

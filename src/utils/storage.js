/**
 * Safe localStorage wrapper with in-memory fallback for private browsing,
 * disabled cookies, or quota exhaustion.
 */

const memoryStore = new Map();

function isLocalStorageAvailable() {
  try {
    if (typeof window === 'undefined' || !window.localStorage) return false;
    const testKey = '__jss_storage_test__';
    window.localStorage.setItem(testKey, testKey);
    window.localStorage.removeItem(testKey);
    return true;
  } catch {
    return false;
  }
}

const canUseLocalStorage = isLocalStorageAvailable();

export const storage = {
  get(key, defaultValue = null) {
    try {
      if (canUseLocalStorage) {
        const raw = window.localStorage.getItem(key);
        if (raw === null || raw === undefined) return defaultValue;
        return JSON.parse(raw);
      }
      return memoryStore.has(key) ? memoryStore.get(key) : defaultValue;
    } catch (e) {
      console.warn(`[storage] Error reading key "${key}":`, e);
      return defaultValue;
    }
  },

  set(key, value) {
    try {
      if (canUseLocalStorage) {
        window.localStorage.setItem(key, JSON.stringify(value));
      } else {
        memoryStore.set(key, value);
      }
      return true;
    } catch (e) {
      console.warn(`[storage] Error writing key "${key}":`, e);
      memoryStore.set(key, value);
      return false;
    }
  },

  remove(key) {
    try {
      if (canUseLocalStorage) {
        window.localStorage.removeItem(key);
      }
      memoryStore.delete(key);
      return true;
    } catch (e) {
      console.warn(`[storage] Error removing key "${key}":`, e);
      return false;
    }
  },

  clear() {
    try {
      if (canUseLocalStorage) {
        window.localStorage.clear();
      }
      memoryStore.clear();
      return true;
    } catch (e) {
      console.warn('[storage] Error clearing storage:', e);
      return false;
    }
  }
};

export default storage;

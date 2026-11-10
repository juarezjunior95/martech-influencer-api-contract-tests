/**
 * Reads authorization token from .auth file in test/k6 root
 * Returns null if file doesn't exist or is empty
 * @returns {string|null} Authorization token or null
 */
export function readAuthFromFile() {
  try {
    // Use import.meta.resolve() to get path relative to this module
    const authPath = import.meta.resolve('../.auth');
    const authContent = open(authPath);
    if (!authContent) {
      return null;
    }
    // Remove whitespace and newlines
    const token = authContent.trim();
    return token || null;
  } catch (e) {
    // File doesn't exist or can't be read
    return null;
  }
}

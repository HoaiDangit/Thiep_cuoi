export const WEDDING_BASE_PATH = '/weddings';

// Stored photo references remain relative to the app, including older uploads.
export function appPath(path: string): string {
  if (!path.startsWith('/') || path.startsWith('//')) return path;
  if (path === WEDDING_BASE_PATH || path.startsWith(WEDDING_BASE_PATH + '/') || path.startsWith(WEDDING_BASE_PATH + '?') || path.startsWith(WEDDING_BASE_PATH + '#')) return path;
  return WEDDING_BASE_PATH + (path === '/' ? '' : path);
}

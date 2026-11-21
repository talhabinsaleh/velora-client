// After signing in or out every cached page must be thrown away (private pages would otherwise
// still render from the router cache), so these transitions use a full page load on purpose.
export function hardNavigate(path: string) {
  window.location.assign(path);
}

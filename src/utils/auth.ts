export function getUserIdFromToken(): string | null {
  const token = localStorage.getItem('authToken');
  if (!token) return null;

  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload.sub || payload.userId || payload.id || null;
  } catch {
    return null;
  }
}

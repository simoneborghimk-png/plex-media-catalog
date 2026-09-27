/**
 * Utility per la risoluzione degli asset delle locandine.
 * Gestisce il base URL configurato in Vite sia in locale (/) che in produzione (/plex-media-catalog/).
 */
export function getPosterUrl(id: number): string {
  const base = import.meta.env.BASE_URL.endsWith('/')
    ? import.meta.env.BASE_URL
    : `${import.meta.env.BASE_URL}/`;
  return `${base}posters/${id}.webp`;
}

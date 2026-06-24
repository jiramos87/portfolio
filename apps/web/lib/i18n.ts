/**
 * Page-local i18n, used ONLY by /about and /cv. The rest of the site is
 * English-only; these two pages get an EN/ES toggle driven by a `?lang=` query
 * so both languages are server-rendered, shareable, and indexable.
 */

export type Lang = "en" | "es";

/** Resolve the active language from a page's (awaited) searchParams. EN is the default. */
export function resolveLang(params: { lang?: string | string[] }): Lang {
  const raw = Array.isArray(params.lang) ? params.lang[0] : params.lang;
  return raw === "es" ? "es" : "en";
}

/** Same-path href that switches language via the `?lang=` query (EN omits it). */
export function langHref(pathname: string, lang: Lang): string {
  return lang === "en" ? pathname : `${pathname}?lang=${lang}`;
}

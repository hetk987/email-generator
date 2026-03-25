/**
 * Single source of truth for template-injected asset globals.
 * Add rows here only; `logoUrl` / `heroBgUrl` are derived for the sandbox and imports.
 */
export const templateAssetGlobals = [
  {
    key: "footerBear",
    url: "/assets/images/bear.png",
    description: "Footer bear image URL; use with Img or pass to Footer footerBear.",
  },
  {
    key: "logoUrl",
    url: "/assets/images/logo.png",
    description:
      "Company logo URL; use with Img or pass to Header logoUrl.",
  },
  {
    key: "heroBgUrl",
    url: "/assets/images/hero-bg.jpg",
    description: "Hero background image URL for custom sections or Img.",
  },
] as const;

function assetUrl(key: (typeof templateAssetGlobals)[number]["key"]): string {
  const row = templateAssetGlobals.find((a) => a.key === key);
  if (!row) throw new Error(`Unknown template asset: ${key}`);
  return row.url;
}

export const logoUrl = assetUrl("logoUrl");
export const heroBgUrl = assetUrl("heroBgUrl");
export const footerBear = assetUrl("footerBear");
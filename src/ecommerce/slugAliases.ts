export const PRODUCT_SLUG_ALIASES: Record<string, string> = {
  'consultoria-engenharia-ia': 'consultoria-produto-ia',
};

export function canonicalProductSlug(slug: string): string {
  return PRODUCT_SLUG_ALIASES[slug] ?? slug;
}

export function productSlugCandidates(slug: string): string[] {
  const candidates = new Set<string>();
  candidates.add(slug);
  candidates.add(canonicalProductSlug(slug));

  for (const [alias, canonical] of Object.entries(PRODUCT_SLUG_ALIASES)) {
    if (canonical === slug) candidates.add(alias);
  }

  return Array.from(candidates);
}


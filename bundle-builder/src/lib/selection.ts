export type VariantCounts = Record<string, number>

export interface ProductRecord {
  category: string
  title: string
  activeVariant: string
  isSelected: boolean
  variantCounts: VariantCounts
}

/** Single store keyed by `${category}:${title}` — scales to any number of categories/products */
export type SelectionStore = Record<string, ProductRecord>

export function selectionKey(category: string, title: string): string {
  return `${category}:${title}`
}

export function createInitialRecord(
  category: string,
  title: string,
  variants: string[],
): ProductRecord {
  return {
    category,
    title,
    isSelected: false,
    activeVariant: variants[0] ?? '',
    variantCounts: Object.fromEntries(variants.map((variant) => [variant, 0])),
  }
}

export function getProductRecord(
  store: SelectionStore,
  category: string,
  title: string,
  variants: string[],
): ProductRecord {
  return store[selectionKey(category, title)] ?? createInitialRecord(category, title, variants)
}

export function countSelectedInCategory(store: SelectionStore, category: string): number {
  return Object.values(store).filter(
    (record) => record.category === category && record.isSelected,
  ).length
}

export function areAllVariantsZero(variantCounts: VariantCounts): boolean {
  return Object.values(variantCounts).every((count) => count === 0)
}

export function hasAnyVariantCount(variantCounts: VariantCounts): boolean {
  return Object.values(variantCounts).some((count) => count > 0)
}

/** Card click: select sets active variant to 1; deselect blocked while any count > 0 */
export function toggleProductSelection(
  record: ProductRecord,
): Partial<Omit<ProductRecord, 'category' | 'title'>> | null {
  if (record.isSelected) {
    if (hasAnyVariantCount(record.variantCounts)) return null

    return { isSelected: false }
  }

  const nextVariantCounts = { ...record.variantCounts }
  const activeCount = nextVariantCounts[record.activeVariant] ?? 0

  if (activeCount === 0) {
    nextVariantCounts[record.activeVariant] = 1
  }

  return {
    isSelected: true,
    variantCounts: nextVariantCounts,
  }
}

export function updateProductRecord(
  store: SelectionStore,
  category: string,
  title: string,
  variants: string[],
  patch: Partial<Omit<ProductRecord, 'category' | 'title'>>,
): SelectionStore {
  const key = selectionKey(category, title)
  const current = getProductRecord(store, category, title, variants)

  return {
    ...store,
    [key]: {
      ...current,
      ...patch,
      category,
      title,
    },
  }
}

/** Flat list of every variant line with a count > 0 — useful for review/cart */
export function getActiveVariantLines(store: SelectionStore) {
  return Object.values(store).flatMap((record) =>
    Object.entries(record.variantCounts)
      .filter(([, count]) => count > 0)
      .map(([variant, count]) => ({
        category: record.category,
        title: record.title,
        variant,
        count,
      })),
  )
}

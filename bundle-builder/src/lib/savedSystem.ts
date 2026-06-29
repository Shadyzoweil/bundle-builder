import type { CameraProduct } from '../types/camera'

export type SavedSelectedProduct = {
  category: string
  title: string
  variant: string
  count: number
}

export type SavedSystem = {
  version: 1
  selectedProducts: SavedSelectedProduct[]
  openSteps: number[]
}

const STORAGE_KEY = 'bundle-builder-saved-system'

export function saveSystem(system: SavedSystem): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(system))
}

export function loadSystem(): SavedSystem | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return null

    const parsed = JSON.parse(raw) as Partial<SavedSystem>
    if (parsed.version !== 1 || !Array.isArray(parsed.selectedProducts)) return null

    return {
      version: 1,
      selectedProducts: parsed.selectedProducts,
      openSteps: Array.isArray(parsed.openSteps) ? parsed.openSteps : [],
    }
  } catch {
    return null
  }
}

export function validateSavedSelection(
  saved: SavedSelectedProduct[],
  products: CameraProduct[],
): SavedSelectedProduct[] {
  const byKey = new Map(
    products.map((product) => [`${product.category}:${product.title}`, product]),
  )

  return saved.filter((item) => {
    const product = byKey.get(`${item.category}:${item.title}`)
    if (!product || typeof item.count !== 'number' || item.count <= 0) return false
    if (product.variants?.length && item.variant && !product.variants.includes(item.variant)) {
      return false
    }
    return true
  })
}

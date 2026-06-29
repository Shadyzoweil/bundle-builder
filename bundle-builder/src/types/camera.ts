export interface CameraProduct {
  category: string
  title: string
  description?: string
  image?: string
  img?: string
  oldprice: number
  newprice: number | null
  discount?: number
  variants?: string[]
  variant_images?: string[]
}

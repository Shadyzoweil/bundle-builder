import { useState } from 'react'
import './ProductCard.css'

interface ProductCardProps {
  category: string
  discount?: number
  title: string
  description: string
  variants: string[]
  variant_images: string[]
  image: string
  price: number | null
  oldPrice: number
  isSelected: boolean
  getVariantCount: (variant: string) => number
  onVariantCountChange: (variant: string, delta: number) => void
}

export default function ProductCard({
  category,
  discount,
  title,
  description,
  variants,
  variant_images,
  image,
  price,
  oldPrice,
  isSelected,
  getVariantCount,
  onVariantCountChange,
}: ProductCardProps) {
  const [activeVariant, setActiveVariant] = useState(variants[0] ?? '')

  const activeCount = getVariantCount(activeVariant)

  const handlePlanClick = () => {
    if (isSelected) {
      onVariantCountChange(activeVariant, -activeCount)
    } else {
      onVariantCountChange(activeVariant, 1)
    }
  }

  return (
    <div
      data-category={category}
      className={`product-card ${isSelected ? 'product-card-selected' : ''}`}
      onClick={category === 'plan' ? handlePlanClick : undefined}
    >
      <div className='product-card-image-container'>
        {discount && <h2 className='discount'>Save {discount}%</h2>}
        <img className='product-card-image' src={image} alt={title} />
      </div>
      <div className='product-card-details'>
        <h1 className='product-card-title'>{title}</h1>
        <p className='product-card-description'>
          {description}
          <span className='learn-more'>Learn More</span>
        </p>
        <div className='product-card-variants'>
          {variants.map((variant, index) => (
            <div
              key={variant}
              className={`product-card-variant ${
                variant === activeVariant ? 'product-card-variant--active' : ''
              }`}
              onClick={() => setActiveVariant(variant)}
            >
              <img
                src={variant_images[index]}
                alt={`${title} ${variant}`}
                className='variant-image'
              />
              <p className='product-card-variant-text'>{variant}</p>
            </div>
          ))}
        </div>
        <div className='product-card-price-container '>
        {category!=="plan"?
          <div
            className="product-card-counter"
            onClick={(event) => event.stopPropagation()}
          >
            <button
              type="button"
              className='counter-button'
              onClick={() => onVariantCountChange(activeVariant, -1)}
            >
              -
            </button>
            <span className='product-counter-number'>{activeCount}</span>
            <button
              type="button"
              className='counter-button'
              onClick={() => onVariantCountChange(activeVariant, 1)}
            >
              +
            </button>
          </div>:<div className='add-plan-container'><h1 className='add-plan-title'>Add plan</h1></div>}
         
          <div className='product-card-price'>
            <h3
              className={`product-card-price-font${price != null ? ' product-card-oldprice-font' : ''}`}
            >
              ${oldPrice}
            </h3>
            {price != null && <h3 className='product-card-price-font'>${price}</h3>}
          </div>
        </div>
      </div>
    </div>
  )
}

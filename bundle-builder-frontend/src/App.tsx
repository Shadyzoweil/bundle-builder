
import { useEffect, useState } from 'react'
import './App.css'
import ProductCard from './components/ProductCard/ProductCard'
import BigCard from './components/BigCard/BigCard'
import ReviewCard from './components/ReviewCard/ReviewCard'
import CamIcon from './assets/livestream.png'
import SensorIcon from './assets/sensorsIcon.png'
import ProtectionIcon from './assets/protectionIcon.png'
import PlanIcon from './assets/Vector.png'
import type { CameraProduct } from './types/camera'
import { loadSystem, saveSystem, validateSavedSelection } from './lib/savedSystem'

type SelectedProduct = {
  category: string
  title: string
  variant: string
  count: number
}

function buildInitialSelection(
  cameras: CameraProduct[],
  sensors: CameraProduct[],
  accessories: CameraProduct[],
  plans: CameraProduct[],
): SelectedProduct[] {
  const toSelection = (product: CameraProduct, count: number): SelectedProduct => ({
    category: product.category,
    title: product.title,
    variant: product.variants?.[0] ?? '',
    count,
  })

  const selections: SelectedProduct[] = []

  if (cameras[0]) selections.push(toSelection(cameras[0], 1))
  if (cameras[1]) selections.push(toSelection(cameras[1], 2))
  if (sensors[0]) selections.push(toSelection(sensors[0], 2))
  if (sensors[1]) selections.push(toSelection(sensors[1], 1))
  if (accessories[0]) selections.push(toSelection(accessories[0], 2))
  if (plans[0]) selections.push(toSelection(plans[0], 1))

  return selections
}

function App() {
  const [cameras, setCameras] = useState<CameraProduct[]>([])
  const [sensors, setSensors] = useState<CameraProduct[]>([])
  const [accessories, setAccessories] = useState<CameraProduct[]>([])
  const [plans, setPlans] = useState<CameraProduct[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedProducts, setSelectedProducts] = useState<SelectedProduct[]>([])
  const [openSteps, setOpenSteps] = useState<Set<number>>(() => new Set([1]))

  const isStepOpen = (step: number) => openSteps.has(step)

  const toggleStep = (step: number) => {
    setOpenSteps((prev) => {
      const next = new Set(prev)
      if (next.has(step)) next.delete(step)
      else next.add(step)
      return next
    })
  }

  const openStep = (step: number) => {
    setOpenSteps((prev) => new Set(prev).add(step))
  }

  useEffect(() => {
    Promise.all([
      fetch('/api/cameras'),
      fetch('/api/sensors'),
      fetch('/api/accessories'),
      fetch('/api/plans'),
    ])
      .then(async ([camerasResponse, sensorsResponse, accessoriesResponse, plansResponse]) => {
        if (
          !camerasResponse.ok ||
          !sensorsResponse.ok ||
          !accessoriesResponse.ok ||
          !plansResponse.ok
        ) {
          throw new Error('Failed to load products')
        }
        const [cameras, sensors, accessories, plans] = await Promise.all([
          camerasResponse.json(),
          sensorsResponse.json(),
          accessoriesResponse.json(),
          plansResponse.json(),
        ])
        setCameras(cameras)
        setSensors(sensors)
        setAccessories(accessories)
        setPlans(plans)

        const allProducts = [...cameras, ...sensors, ...accessories, ...plans]
        const saved = loadSystem()

        if (saved) {
          setSelectedProducts(validateSavedSelection(saved.selectedProducts, allProducts))
          const restoredSteps = saved.openSteps.filter((step) => step >= 1 && step <= 4)
          if (restoredSteps.length > 0) {
            setOpenSteps(new Set(restoredSteps))
          }
        } else {
          setSelectedProducts(buildInitialSelection(cameras, sensors, accessories, plans))
        }
      })
      .catch((err: Error) => setError(err.message))
      .finally(() => setLoading(false))
  }, [])

  const getVariantCount = (title: string, variant: string) =>
    selectedProducts.find((item) => item.title === title && item.variant === variant)?.count ?? 0

  const isProductSelected = (title: string) =>
    selectedProducts.some((item) => item.title === title)

  const countSelectedInCategory = (category: string) =>
    new Set(
      selectedProducts.filter((item) => item.category === category).map((item) => item.title),
    ).size

  const findProduct = (category: string, title: string) => {
    const list =
      category === 'cameras'
        ? cameras
        : category === 'sensors'
          ? sensors
          : category === 'accessories'
            ? accessories
            : plans
    return list.find((product) => product.title === title)
  }

  const reviewItems = selectedProducts.map((item) => {
    const product = findProduct(item.category, item.title)
    const variantIndex = product?.variants?.indexOf(item.variant) ?? -1
    const image =
      (variantIndex >= 0 ? product?.variant_images?.[variantIndex] : product?.image ?? product?.img) ??
      ''
    return {
      category: item.category,
      title: item.title,
      variant: item.variant,
      count: item.count,
      image,
      unitPrice: product?.newprice ?? product?.oldprice ?? 0,
      unitOldPrice: product?.oldprice ?? product?.newprice ?? 0,
    }
  })

  const handleSaveSystem = () => {
    saveSystem({
      version: 1,
      selectedProducts,
      openSteps: [...openSteps],
    })
  }

  const changeVariantCount = (category: string, title: string, variant: string, delta: number) => {
    setSelectedProducts((prev) => {
      const existing = prev.find((item) => item.title === title && item.variant === variant)

      if (!existing) {
        return delta > 0 ? [...prev, { category, title, variant, count: delta }] : prev
      }

      const nextCount = existing.count + delta
      if (nextCount <= 0) {
        return prev.filter((item) => !(item.title === title && item.variant === variant))
      }

      return prev.map((item) =>
        item.title === title && item.variant === variant ? { ...item, count: nextCount } : item,
      )
    })
  }

  const renderProductCards = (products: CameraProduct[]) =>
    products.map((product) => (
      <ProductCard
        key={product.title}
        category={product.category}
        discount={product.discount}
        title={product.title}
        description={product.description ?? ''}
        variants={product.variants ?? []}
        variant_images={product.variant_images ?? []}
        image={product.image ?? product.img ?? ''}
        price={product.newprice}
        oldPrice={product.oldprice}
        isSelected={isProductSelected(product.title)}
        getVariantCount={(variant) => getVariantCount(product.title, variant)}
        onVariantCountChange={(variant, delta) =>
          changeVariantCount(product.category, product.title, variant, delta)
        }
      />
    ))

  if (loading) return <div>Loading...</div>
  if (error) return <div>Error: {error}</div>

  return (
    <div className='main-page'>
      <div className="big-card-wrapper">
        <BigCard
          title="Choose your cameras"
          icon={CamIcon}
          step="1"
          selected={countSelectedInCategory('cameras')}
          next="Next: Choose your plan"
          isOpen={isStepOpen(1)}
          onToggle={() => toggleStep(1)}
          onNext={() => openStep(2)}
        >
          {renderProductCards(cameras)}
        </BigCard>
        <BigCard
          title="Choose your plan"
          icon={PlanIcon}
          step="2"
          selected={countSelectedInCategory('plan')}
          next="Next: Choose your sensors"
          isOpen={isStepOpen(2)}
          onToggle={() => toggleStep(2)}
          onNext={() => openStep(3)}
        >
          {renderProductCards(plans)}
        </BigCard>
        <BigCard
          title="Choose your sensors"
          icon={SensorIcon}
          step="3"
          selected={countSelectedInCategory('sensors')}
          next="Next: Choose your accessories"
          isOpen={isStepOpen(3)}
          onToggle={() => toggleStep(3)}
          onNext={() => openStep(4)}
        >
          {renderProductCards(sensors)}
        </BigCard>
        <BigCard
          title="Add extra protection"
          icon={ProtectionIcon}
          step="4"
          selected={countSelectedInCategory('accessories')}
          next="Next: Review your bundle"
          isOpen={isStepOpen(4)}
          onToggle={() => toggleStep(4)}
          onNext={() => {
            document.querySelector('.review-card')?.scrollIntoView({ behavior: 'smooth' })
          }}
        >
          {renderProductCards(accessories)}
        </BigCard>
        
      </div>
      <ReviewCard
        items={reviewItems}
        onIncrement={(category, title, variant) => changeVariantCount(category, title, variant, 1)}
        onDecrement={(category, title, variant) => changeVariantCount(category, title, variant, -1)}
        onSaveSystem={handleSaveSystem}
      />
    </div>
  )
}

export default App

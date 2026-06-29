import { useEffect, useState } from "react"
import "./ReviewCard.css"
import ReviewProduct from "../ReviewProductCard/ReviewProductCard";
import badge from "../../assets/Satisfaction Badge-05 1.png";
import shipping from "../../assets/shipping.png";

export interface ReviewItem {
    category: string;
    title: string;
    variant: string;
    count: number;
    image: string;
    unitPrice: number;
    unitOldPrice: number;
}

interface IReviewCard {
    items: ReviewItem[];
    onIncrement: (category: string, title: string, variant: string) => void;
    onDecrement: (category: string, title: string, variant: string) => void;
    onSaveSystem: () => void;
}

const CATEGORY_ORDER = ["cameras", "sensors", "accessories", "plan"];
const CATEGORY_LABELS: Record<string, string> = {
    cameras: "Cameras",
    sensors: "Sensors",
    accessories: "Accessories",
    plan: "Plan",
};

export default function ReviewCard({ items, onIncrement, onDecrement, onSaveSystem }: IReviewCard) {
    const [saved, setSaved] = useState(false)
    const totalBefore = items.reduce((sum, item) => sum + item.unitOldPrice * item.count, 0)
    const totalAfter = items.reduce((sum, item) => sum + item.unitPrice * item.count, 0)
    const savings = totalBefore - totalAfter

    useEffect(() => {
        if (!saved) return
        const timeoutId = window.setTimeout(() => setSaved(false), 3000)
        return () => window.clearTimeout(timeoutId)
    }, [saved])

    const handleSaveSystem = () => {
        onSaveSystem()
        setSaved(true)
    }

    return (
        <div className="review-card">
            <p className="review-text">Review</p>
            <div className="review-card-inside">
                <div className="review-title-container">
                    <h1 className="review-title">Your security system</h1>
                    <h2 className="review-subtitle">Review your personalized protection system designed to keep what matters most safe.</h2>
                </div>

                <div className="review-card-products-container">
                    {CATEGORY_ORDER.map((category) => {
                        const categoryItems = items.filter((item) => item.category === category);
                        if (categoryItems.length === 0) return null;

                        return (
                            <div key={category} className="review-category">
                                <h3 className="review-category-heading">{CATEGORY_LABELS[category] ?? category}</h3>
                                {categoryItems.map((item) => (
                                    <ReviewProduct
                                        key={`${item.title}-${item.variant}`}
                                        category={item.category}
                                        title={item.title}
                                        variant={item.variant}
                                        count={item.count}
                                        total={item.unitPrice * item.count}
                                        totalOld={item.unitOldPrice * item.count}
                                        img={item.image}
                                        onIncrement={() => onIncrement(item.category, item.title, item.variant)}
                                        onDecrement={() => onDecrement(item.category, item.title, item.variant)}
                                    />
                                ))}
                            </div>
                        );
                    })}

                    {items.length === 0 ? (
                        <p className="review-empty">No items selected yet.</p>
                    ) : (
                        <>
                        <div className="shipping-container">
                            <div className="shipping-container-inside">
                                <img className="shipping-icon" src={shipping} alt="shipping icon" />
                                <h1 className="shipping-title">Fast Shipping</h1>
                            </div>
                            <div className="shipping-container-price">
                                <p className="shipping-container-price-old">$5.99</p>
                                <p className="shipping-container-price-new">FREE</p>
                                
                            </div>


                        </div>
                        <div className="review-total-container">
                            <div className="review-badge-container">
                                <img src={badge} alt="badge" className="review-badge" />
                                <div className="review-total">
                                    <span className="guanrantee-container"><p className="guanrantee-text">as low as 19.19$/mo</p></span>
                                    <div className="review-total-inside">
                                        <span className="review-total-before">${totalBefore.toFixed(2)}</span>
                                        <span className="review-total-after">${totalAfter.toFixed(2)}</span>
                                    </div>
                                    
                                </div>
                                

                            </div>
                            <p className="congrats-text">Congrats! You’re saving ${savings.toFixed(2)} on your security bundle!</p>
                            <button className="review-button"><p className="review-button-text">Checkout</p></button>
                            <div className="save-system-row">
                                <button type="button" className="save-system-text" onClick={handleSaveSystem}>
                                    Save my system for later
                                </button>
                                {saved && (
                                    <span className="save-system-confirmation" aria-live="polite">
                                        ✓ System saved
                                    </span>
                                )}
                            </div>
                            
                        </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    )
}

import "./ReviewProductCard.css"

interface IReviewProduct{
    category: string;
    title: string;
    variant: string;
    total: number;
    totalOld: number;
    count:number;
    img:string;
    onIncrement: () => void;
    onDecrement: () => void;
}

 export default function ReviewProduct({category,title,variant,total,totalOld,count,img,onIncrement,onDecrement} :IReviewProduct){
    const isPlan = category === 'plan'
    const hasDiscount = totalOld !== total

    return(
        <div className="review-product">
            <div className="review-product-main">
                <img className="review-img" src={img} alt={title} />
                <div className="review-product-text">
                    <h1 className="review-product-title">{title}</h1>
                    {variant ? <span className="review-product-variant">{variant}</span> : null}
                </div>
            </div>
            {isPlan ? (
                <button
                    type="button"
                    className="review-plan-toggle"
                    onClick={count > 0 ? onDecrement : onIncrement}
                >
                    {count > 0 ? 'x' : '+'}
                </button>
            ) : (
            <div className="review-product-counter">
                <button type="button" className='counter-button' onClick={onDecrement}>-</button>
                <span className='review-counter-number'>{count}</span>
                <button type="button" className='counter-button' onClick={onIncrement}>+</button>
            </div>
            )}
            <div className="review-product-total-container">
            {hasDiscount ? (
                <h2 className="review-product-total-old">${totalOld.toFixed(2)}</h2>
            ) : null}
            <h2 className="review-product-total">{total === 0 ? 'FREE' : `$${total.toFixed(2)}`}</h2>
            
            </div>
        </div>
    )
}

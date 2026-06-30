import "./PlanCard.css"

interface IPlanCard {
    title: string
    img: string
    oldprice: number
    newprice: number
}

export default function PlanCard({ title, img, oldprice, newprice }: IPlanCard) {
    return (
        <div className="plan-card">
            <div className="plan-card-title-container">
            <img className="plan-card-img" src={img} alt={title} />
            <h1 className="plan-card-title">{title}</h1>
            </div>
            <div className="plan-card-price-container">
            <h2 className="plan-card-oldprice">${oldprice}/mo</h2>
            <h2 className="plan-card-newprice">${newprice}/mo</h2>
            </div>
        </div>
    )
}
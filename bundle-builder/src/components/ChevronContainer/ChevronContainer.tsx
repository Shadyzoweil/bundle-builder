import "./ChevronContainer.css"
import chevron from "../../assets/carrot-down.png"

interface IChevronContainer{
    step: string;
    title: string;
    icon:string;
}

export default function ChevronContainer({step,title,icon} :IChevronContainer){
    return(
        <div className="chevron-container">
            <p className="step">{step}</p>
            <div className="chevron-content">
            <img src={icon} alt="icon" />
            <h1 className="chevron-title">{title}</h1>
            <img className="chevron-icon" src={chevron} alt="chevron icon" />
            </div>

           
        </div>
    )
}
import { type ReactNode } from 'react'
import './BigCard.css';
import chevron from '../../assets/carrot-down.png';

interface IBigCard {
    children: ReactNode
    title: string;
    icon: string;
    step: string;
    selected: number;
    next: string;
    isOpen: boolean;
    onToggle: () => void;
    onNext: () => void;
}

export default function BigCard({ children, title, icon, step, selected, next, isOpen, onToggle, onNext }: IBigCard) {
    return(

<div  className={isOpen ? "big-card-container" : "big-card-container-collapsed"} >
    <h1 className='big-card-step'>STEP {step} OF 4</h1>
        <div className='big-card'>
            <div className='big-card-title-container'> 
                <div className='big-card-title-container-inner'>
                <img src={icon} alt="" />    
                <h1 className='big-card-title'>{title}</h1>
                </div> 
                <div className='selected-text-container'><p className={`selected-text${!isOpen ? ' display-none' : ''}`}>{selected} selected</p><img src={chevron} alt="chevron" className={isOpen ? "chevron-rotated" : "chevron-icon"}  onClick={onToggle} /></div>
            </div>
            
            <div className={`big-card-body${isOpen ? ' big-card-body--open' : ''}`}>
                <div className="big-card-body-inner">
                    <div className='products-container'>
                        {children}
                    </div>
                    <button type="button" className='next-plan' onClick={onNext}>{next}</button>
                </div>
            </div>


        </div>
        </div>
    )

    



}
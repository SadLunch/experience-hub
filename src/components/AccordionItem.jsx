import { useState } from "react";
import check from '../assets/check.png';
import propTypes from 'prop-types';


const AccordionItem = ({ title, children, finished }) => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className={`rounded-xl border px-6 py-4 my-2 transition-all cursor-pointer border-[#5690CC] ${isOpen ? 'bg-[#5690CC]' : 'bg-black'} text-white font-fontBtnMenus text-2xl tracking-wider`} onClick={() => {setIsOpen(!isOpen)}}>
            <div className="flex justify-between items-center">
                <span>{ title }</span>
                {/* icon of checkmark if experience concluded */}
                {/* icon of play if item is open and not concluded */}
                {finished && (
                    <img src={check} />
                )}
            </div>
            {isOpen && (
                <div className="mt-4 text-base text-white font-fontSans">
                    { children }
                </div>
            )}
        </div>
    )
}

AccordionItem.propTypes = {
    title: propTypes.func.isRequired,
    children: propTypes.func.isRequired,
    finished: propTypes.func.isRequired,
};

export default AccordionItem;
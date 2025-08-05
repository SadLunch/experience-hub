import { useState } from "react";
import check_correct_color from '../assets/check_correct_color.png';
import play_correct_color from '../assets/play_correct_color.png';
import propTypes from 'prop-types';
import { Link } from "react-router-dom";


const AccordionItem = ({ title, expId, children, finished }) => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className={``} onClick={() => {setIsOpen(!isOpen)}}>
            <div className={`rounded-xl border px-6 py-4 my-2 transition-all cursor-pointer border-[#5690CC] text-white font-fontBtnMenus tracking-wider ${isOpen ? 'bg-[#5690CC] text-sm' : 'bg-black text-lg'} flex justify-between items-center`}>
                <span>{ title }</span>
                {/* icon of checkmark if experience concluded */}
                {/* icon of play if item is open and not concluded */}
                {finished && (
                    <img src={check_correct_color} className="h-[64px] max-w-[64px]" />
                )}
                {isOpen && (
                    <Link to={`/hidden/website/experience/${expId}`}>
                        <img src={play_correct_color} className="h-[64px] max-w-[64px]" />
                    </Link>
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
    expId: propTypes.func.isRequired,
    children: propTypes.func.isRequired,
    finished: propTypes.func.isRequired,
};

export default AccordionItem;
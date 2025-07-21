import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import propTypes from "prop-types";

const languages = {
    "en": {
        label: "EN",
        flag: "/images/256px-English_language.svg.png" // flag image link
    },
    "pt": {
        label: "PT",
        flag: "/images/256px-Flag_of_Portugal_(official).svg.png"
    }
}

function LanguageSwitcher({ onLanguageChange }) {
    const [currentLang, setCurrentLang] = useState(localStorage.getItem("lang") || "pt");
    const [open, setOpen] = useState(false);

    const otherLang = Object.keys(languages).find((l) => l !== currentLang);

    const handleLangChange = (lang) => {
        if (lang !== currentLang) {
            setCurrentLang(lang);
            localStorage.setItem("lang", lang);
            if (onLanguageChange) onLanguageChange(lang);
        }
        setOpen(false);
    };

    return (
        <motion.div className="fixed top-4 right-4 z-[1000]"
            initial={false}
            animate={{
                width: open ? "106px" : "48px",
                borderRadius: open ? "9999px" : "9999px",
            }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}>
            <div
                className={`bg-[#E6E518] rounded-full shadow-md border border-black p-1 flex items-center justify-center gap-2 cursor-pointer ${open ? "px-2" : ""
                    }`}
                onClick={() => setOpen(!open)}
            >
                {/* Current language flag */}
                <div className="w-10 h-10 rounded-full overflow-hidden">
                    <img
                        src={languages[currentLang].flag}
                        alt={languages[currentLang].label}
                        className="w-full h-full object-cover"
                    />
                </div>

                {/* Other language flag (only when open) */}
                <AnimatePresence>
                    {open && (
                        <motion.div
                            key="other-flag"
                            initial={{ opacity: 0, x: 10 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 10 }}
                            transition={{ duration: 0.2 }}
                            onClick={(e) => {
                                e.stopPropagation();
                                handleLangChange(otherLang);
                            }}
                            className="w-10 h-10 rounded-full overflow-hidden"
                        >
                            <img
                                src={languages[otherLang].flag}
                                alt={languages[otherLang].label}
                                className="w-full h-full object-cover"
                            />
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </motion.div>
    );
}

LanguageSwitcher.propTypes = {
    onLanguageChange: propTypes.func.isRequired,
}

export default LanguageSwitcher;

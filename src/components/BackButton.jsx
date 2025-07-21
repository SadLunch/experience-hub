import { useNavigate } from "react-router-dom";
import propTypes from "prop-types";
import text from "../data/localization";

function BackButton({ lang = "pt", to = null, callback = null }) {
  const navigate = useNavigate();

  return (
    <button
      onClick={() => {
        if (callback) callback();
        if (to) navigate(to);
      }}
      className="absolute block bg-[#E6E518] border-2 border-black p-2 mb-10 top-6 left-2 z-[1000] rounded-lg cursor-pointer font-fontBtnMenus text-black text-xs tracking-thighter hover:border-[#E6E518] active:border-[#E6E518]"
    >
      {text[lang].global.back}
    </button>
  );
}

BackButton.propTypes = {
  lang: propTypes.string.isRequired,
  to: propTypes.string,
  callback: propTypes.func,
}

export default BackButton;

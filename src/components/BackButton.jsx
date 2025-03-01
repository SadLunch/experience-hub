import { useNavigate } from "react-router-dom";
import propTypes from "prop-types";

function BackButton({ to = "/" }) {
  const navigate = useNavigate();

  return (
    <button 
      onClick={() => navigate(to)} 
      style={{
        position: "absolute",
        top: "10px",
        left: "10px",
        zIndex: 1000,
        border: "none",
        cursor: "pointer",
      }}
      className="block bg-gray-800 p-3 mb-10 rounded-lg shadow-lg hover:bg-gray-700"
    >
      ← Back
    </button>
  );
}

BackButton.propTypes = {
    to: propTypes.func.isRequired,
}

export default BackButton;

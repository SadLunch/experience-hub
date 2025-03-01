import { useEffect } from "react";
import { useMap } from "react-leaflet";
import propTypes from "prop-types";

const MapCenter = ({ position }) => {
    const map = useMap();
    useEffect(() => {
        if (position) {
            map.setView(position, 14); // Zoom to user location
        }
    }, [position, map]);
    return null;
};

MapCenter.propTypes = {
    position: propTypes.func.isRequired,
}

export default MapCenter;
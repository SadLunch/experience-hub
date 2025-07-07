import { useEffect, useState } from "react";
import { useMap } from "react-leaflet";
import L from 'leaflet';
import propTypes from "prop-types";

const MapCenter = ({ positions }) => {
    const map = useMap();
    const [fitDone, setFitDone] = useState(false);

    useEffect(() => {
        if (positions && positions.length > 0 && !fitDone) {
            const bounds = L.latLngBounds(positions);
            map.fitBounds(bounds, {
                padding: [50, 50],
                maxZoom: 15,
            });
            setFitDone(true);
        }
    }, [positions, map, fitDone]);

    return null;
};


MapCenter.propTypes = {
    positions: propTypes.func.isRequired,
}

export default MapCenter;
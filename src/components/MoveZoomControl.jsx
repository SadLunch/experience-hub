import { useEffect } from "react";
import { useMap } from "react-leaflet";

const MoveZoomControl = () => {
    const map = useMap();
    useEffect(() => {
        map.zoomControl.setPosition("topright");
    }, [map]);
    return null;
}

export default MoveZoomControl;
import { useEffect } from "react";
import { useMap } from "react-leaflet";

const RemoveZoomControl = () => {
    const map = useMap();
    useEffect(() => {
        map.zoomControl.remove();//setPosition("topright");
    }, [map]);
    return null;
}

export default RemoveZoomControl;
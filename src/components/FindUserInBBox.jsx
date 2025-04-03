import { useEffect } from "react";
import L from "leaflet";
import icon from 'leaflet/dist/images/marker-icon.png';
import { Marker, Popup, useMap } from "react-leaflet";
import propTypes from "prop-types";

const FindUserInBBox = ({ bbox, setBbox, setUserLocation }) => {
    const map = useMap();
    useEffect(() => {
        map.locate().on('locationfound', (e) => {
            setUserLocation(e.latlng);
            const radius = 250;
            // Approximate mid point of all experiments' locations
            const circle = L.Circle([38.71016737677969, -9.140265017699889], radius)
            const bbox = circle.getBounds();
            setBbox(bbox);
        });
    }, [map, setBbox, setUserLocation])

    const boundingBox = bbox ? bbox.toBBoxString().split(",") : null;

    if (!bbox) return null;
    return (
        <Marker position={L.LatLng([38.71016737677969, -9.140265017699889])} icon={icon}>
            <Popup>
                You are here. <br />
                Map bbox: <br />
                <b>Southwest lng</b>: {boundingBox[0]} <br />
                <b>Southwest lat</b>: {boundingBox[1]} <br />
                <b>Northeast lng</b>: {boundingBox[2]} <br />
                <b>Northeast lat</b>: {boundingBox[3]}
            </Popup>
        </Marker>
    );
}

FindUserInBBox.propTypes = {
    bbox: propTypes.func.isRequired,
    setBbox: propTypes.func.isRequired,
    setUserLocation: propTypes.func.isRequired,
}

export default FindUserInBBox;
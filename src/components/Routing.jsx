import { Polyline, useMap } from "react-leaflet";
import L from 'leaflet';
import 'leaflet-routing-machine';
import { useEffect } from "react";
import propTypes from 'prop-types';

// For now the paths will be hardcoded.
// Maybe later I'll use a server with an OSMR API
const coordsForRouting = [
    [38.71053944005977, -9.142083400540344],
    [38.71061162025544, -9.14201960650072],
    [38.71069873419224, -9.14160494524216],
    [38.71126409053772, -9.141721957761968],
    [38.711649191887055, -9.140850239844514],
    [38.712004360930486, -9.140893187916427], // Wack a Mole location
    [38.711729638957536, -9.140522461862878],
    [38.71097339191392, -9.139994027591321],
    [38.71096843273451, -9.139665205890337],
    [38.710880666013445, -9.139602147975914], // Giant Justice location
    [38.71096843273451, -9.139665205890337],
    [38.71081531609009, -9.140462510976745],
    [38.71001326249752, -9.140169870055326], // Gremio Lit. location
    [38.709756980848574, -9.140163628593049],
    [38.70968962677283, -9.141498662795618], // Graffiti 1 location
    [38.708760496769706, -9.141368623401348], // Graffiti 2 location
]; // Maybe I'll need to add more locations later, or not

const Routing = () => {
    return (
        <Polyline
            positions={coordsForRouting}
            pathOptions={{
                color: '#5690CC',
                weight: 4,
                opacity: 1,
                dashArray: '6',
                stroke: true,

            }}
        />
    )
}

// Will need to create the OSRM server later
const Routing_v1 = ({ from, to }) => {
    const map = useMap();

    useEffect(() => {
        if (!from || !to || !map) return;

        const control = L.Routing.control({
            waypoints: [L.latLng(...from), L.latLng(...to)],
            router: '',//new L.Routing.mapzen(''),
            lineOptions: {
                styles: [{ color: '#E6E518', weight: 4 }],
            },
            createMarker: () => null, // Don't show default markers
            addWaypoints: false,
            routeWhileDragging: false,
            show: false,
        });
        control.addTo(map);

        return () => map.removeControl(control);
    }, [from, to, map]);

    return null;
};

Routing_v1.propTypes = {
    from: propTypes.arrayOf(propTypes.number).isRequired,
    to: propTypes.arrayOf(propTypes.number).isRequired
};

export default Routing;
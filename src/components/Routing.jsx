import { Polyline, useMap } from "react-leaflet";
import L from 'leaflet';
import 'leaflet-routing-machine';
import { useEffect } from "react";
import propTypes from 'prop-types';

// For now the paths will be hardcoded.
// Maybe later I'll use a server with an OSMR API
const coordsForRouting = [
    [38.712004360930486, -9.140893187916427], // Wack a Mole location
    [38.711622236416545, -9.14085416135676],
    [38.71129992335948, -9.141760747985817],
    [38.70872353140405, -9.141419528428177], // Graffiti 2 location
    [38.7087570197483, -9.141335038844659],
    [38.70968531334263, -9.141464462160384], // Graffiti 1 location
    [38.709740152120055, -9.141468024458138],
    [38.70974264112136, -9.140147487837927],
    [38.71001326249752, -9.140169870055326], // Gremio Lit. location
    [38.71082347777835, -9.14041561269436],
    [38.710935451085874, -9.139672640802635],
    [38.710880666013445, -9.139602147975914], // Giant Justice location
    [38.71032535141203, -9.13942855977563],
    [38.709854430442064, -9.13921666526513],
    [38.709802105698756, -9.139374915593871], // Selfie location
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
import { useEffect, useState } from 'react';
// import { Link } from 'react-router-dom';

import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
// import ReactDOMServer from 'react-dom/server';
import L from 'leaflet';
import MapCenter from '../../components/MapCenter';
import { locations } from '../../data/locations';
import iconUser from '../../assets/peacock.png';
// import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';
import MoveZoomControl from '../../components/MoveZoomControl';
import MapResizer from '../../components/MapResizer';
import { Link } from 'react-router-dom';
import BackButton from '../../components/BackButton';
import { fontMap } from '../../components/MapMarkerFont';
import AccordionItem from '../../components/AccordionItem';

function generateMarkerSVG({
    text = '1',
    fill = '#E11D48',
    textColor = '#ffffff',
    fontSize = 80,
    fontFamily = 'FontBtnMenus',
    fontBase64 // <-- this is the Base64 font string
}) {
    const svg = `
  <svg xmlns="http://www.w3.org/2000/svg" width="250" height="350" viewBox="0 0 250 350">
    <defs>
      <style type="text/css">
        @font-face {
          font-family: '${fontFamily}';
          src: url('${fontBase64}') format('woff2');
        }
        text {
          font-family: '${fontFamily}';
        }
      </style>
    </defs>
    <!-- Marker Body -->
    <path d="M125 0C60 0 0 60 0 125c0 87.5 125 225 125 225s125-137.5 125-225C250 60 190 0 125 0z" fill="${fill}" />
    
    <!-- Text in center -->
    <text x="50%" y="47%" text-anchor="middle" fill="${textColor}"
      font-size="${fontSize}" dy=".3em">${text}</text>
  </svg>
  `;

    return "data:image/svg+xml," + encodeURIComponent(svg);
}


const userIcon = L.icon({
    iconUrl: iconUser,
    shadowUrl: iconShadow,
    iconSize: [41, 41],
    iconAnchor: [12, 41]
})

const ExperiencesScreen = () => {
    const [isMap, setIsMap] = useState(null);
    const [userLocation, setUserLocation] = useState(null);

    useEffect(() => {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                setUserLocation([position.coords.latitude, position.coords.longitude]);
                setIsMap(true);
            },
            (error) => {
                console.error("Error getting location:", error);
                setIsMap(false);
            }
        )
    }, []);

    // if (isMap === null) {
    //     return <div>Placeholder</div>
    // }

    return (
        <div>
            {isMap === true && (
                <div style={{ position: "relative" }}>
                    <MapContainer
                        center={userLocation} // Default to New York City
                        zoom={13}
                        style={{ width: "100vw", height: "100vh" }}
                    >
                        <TileLayer
                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        />

                        {userLocation && <MapCenter position={userLocation} />}

                        {userLocation && (
                            <Marker position={userLocation} icon={userIcon}>
                                <Popup>You are here!</Popup>
                            </Marker>
                        )}

                        {locations.map((loc) => (
                            <Marker
                                key={loc.id}
                                position={loc.coordinates}
                                icon={L.icon({
                                    iconUrl: generateMarkerSVG({ text: loc.participants, fill: loc.color, textColor: '#000000', fontSize: 100, fontBase64: fontMap }), // Custom marker icon (optional)
                                    shadowUrl: iconShadow,
                                    iconSize: [25, 41],
                                    iconAnchor: [12, 41],
                                })}
                            >
                                <Popup>
                                    <h3>{loc.experiment.title}</h3>
                                    <p>Participants: {loc.participants}</p>
                                    <Link to={!loc.experiment.disabled ? `/experiment/${loc.experiment.id}` : '#'} /*onClick={() => {
                if (!loc.experiment.disabled) joinExperiment(loc.experiment.id)
              }}*/>
                                        <button>Go to Experiment</button>
                                    </Link>
                                </Popup>
                            </Marker>
                        ))}
                        <MoveZoomControl />
                        <MapResizer />
                    </MapContainer>
                </div>
            )}
            {isMap == false && (
                <div className='min-h-screen w-screen bg-black flex flex-col items-center py-10 top-0'>
                    <h1 className="text-3xl text-[#E6E518] font-bold mt-[5rem] mb-10 font-fontTitle">J-U-S-T-I-Ç-A À CHIADO</h1>
                    <div className='grid grid-cols-1 gap-4 p-4'>
                        {locations.map((loc) => (
                            <AccordionItem key={loc.id} title={loc.experiment.title} finished={true} >
                                {loc.experiment.description}
                            </AccordionItem>
                        ))}
                    </div>
                </div>
            )}
            <BackButton to='/hidden/website/home' />
        </div>
    );

}

export default ExperiencesScreen;
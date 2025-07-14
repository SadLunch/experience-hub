import { useEffect, useState } from 'react';
// import { Link } from 'react-router-dom';

import { MapContainer, TileLayer, Marker } from 'react-leaflet';
// import ReactDOMServer from 'react-dom/server';
import L from 'leaflet';
import MapCenter from '../../components/MapCenter';
import { locations } from '../../data/locations_final';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';
import MoveZoomControl from '../../components/MoveZoomControl';
import MapResizer from '../../components/MapResizer';
import { Link } from 'react-router-dom';
import BackButton from '../../components/BackButton';
import { fontMap } from '../../components/MapMarkerFont';
import AccordionItem from '../../components/AccordionItem';
import Routing from '../../components/Routing';
import text from '../../data/localization';

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

const createUserIcon = (heading) =>
    L.divIcon({
    className: "",
    iconSize: [30, 30],
    html: `
      <div style="
        width: 40x;
        height: 40px;
        display: flex;
        align-items: center;
        justify-content: center;
        position: relative;
      ">
        <img src="/images/userIcon_1.png"
             style="
               width: 100%;
               height: auto;
               transform: rotate(${heading}deg);
               transition: transform 0.2s ease;
             "
             alt="direction" />
      </div>
    `,
  });


const ExperiencesScreen = () => {
    const [isMap, setIsMap] = useState(null);
    const [userLocation, setUserLocation] = useState(null);
    const [heading, setHeading] = useState(0);
    const [selectedExperience, setSelectedExperience] = useState(null);
    const [uniqueKey] = useState(() => Date.now());


    useEffect(() => {
        // console.log('Mounting component:', Date.now())
        const watch = navigator.geolocation.watchPosition(
            (position) => {
                setUserLocation([position.coords.latitude, position.coords.longitude]);
                setIsMap(true);
            },
            (error) => {
                console.error("Error getting location:", error);
                setIsMap(false);
            }, { maximumAge: 30000, enableHighAccuracy: false }
        )

        return () => {
            // console.log('Unmounting component:', Date.now())
            navigator.geolocation.clearWatch(watch)
        }
    }, []);

    useEffect(() => {
        const handleOrientation = (e) => {
            if (typeof e.alpha === "number") {
                setHeading(e.alpha); // alpha: 0° (North) to 360°
            }
        };


        window.addEventListener("deviceorientation", handleOrientation, true);

        return () => {
            window.removeEventListener("deviceorientation", handleOrientation);
        };
    }, []);

    // if (isMap === null) {
    //     return <div>Placeholder</div>
    // }

    if (isMap === null || !uniqueKey) return <div>Loading map...</div>;

    return (
        <div>
            {isMap === true && (
                <div style={{ position: "relative" }}>
                    {userLocation && (
                        <MapContainer
                            key={uniqueKey}
                            center={userLocation} // Default to New York City
                            zoom={13}
                            style={{ width: "100vw", height: "100vh" }}
                        >
                            <TileLayer
                                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                            />

                            {userLocation && (
                                <MapCenter
                                    positions={[
                                        userLocation,
                                        ...locations.map(loc => loc.coordinates)
                                    ]}
                                />
                            )}

                            {userLocation && (
                                <Marker position={userLocation} icon={createUserIcon(heading)} />
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
                                    eventHandlers={{
                                        click: () => {
                                            //console.log(text["pt"].mapScreen.experiences[selectedExperience.experiment.id].title)
                                            setSelectedExperience(loc);
                                        },
                                    }}
                                >
                                    {/* <Popup>
                                    <h3>{loc.experiment.title}</h3>
                                    <p>Participants: {loc.participants}</p>
                                    <Link to={!loc.experiment.disabled ? `/experiment/${loc.experiment.id}` : '#'}>
                                        <button>Go to Experiment</button>
                                    </Link>
                                </Popup> */}
                                </Marker>
                            ))}
                            <MoveZoomControl />
                            <MapResizer />
                            {/* {userLocation && selectedExperience && (
                                <Routing from={userLocation} to={selectedExperience.coordinates} />
                            )} */}
                            {locations && (
                                <Routing locations={locations.map(loc => loc.coordinates)} />
                            )}
                        </MapContainer>
                    )}
                    {selectedExperience && (
                        <div className='fixed bottom-0 w-full p-2 z-[1000]'>
                            <div className="w-full bg-black bg-opacity-90 text-white p-4 rounded-2xl shadow-2xl">
                                <div className="flex justify-between items-center mb-2">
                                    <h2 className="font-bold font-fontBtnMenus">{ text["pt"].experiences[selectedExperience.experiment.id].title }</h2>
                                    <button onClick={() => setSelectedExperience(null)} className="text-sm text-red-400">{ text["pt"].mapScreen.btnClose }</button>
                                </div>
                                <p className='text-sm font-fontSans'>{
                                text["pt"].experiences[selectedExperience.experiment.id].description.length > 150 ? text["pt"].experiences[selectedExperience.experiment.id].description.slice(0, 150) + "..." : text["pt"].experiences[selectedExperience.experiment.id].description
                                }</p>
                                <div className='flex justify-between items-center'>
                                    <Link
                                        to={`/hidden/website/experience/${selectedExperience.experiment.id}`}
                                        className="inline-block mt-4 bg-blue-600 text-white px-4 py-2 rounded"
                                    >
                                        { text["pt"].mapScreen.btnExperienceDetail }
                                    </Link>
                                    <p className="mt-2 text-sm">{ text["pt"].mapScreen.participants }: {selectedExperience.participants}</p>

                                </div>
                            </div>
                        </div>
                    )}

                </div>
            )}
            {isMap == false && (
                <div className='min-h-screen w-screen bg-black flex flex-col items-center py-10 top-0'>
                    <h1 className="text-3xl text-[#E6E518] font-bold mt-[5rem] mb-10 font-fontTitle">J-U-S-T-I-Ç-A À CHIADO</h1>
                    <div className='grid grid-cols-1 gap-4 p-4'>
                        {locations.map((loc) => (
                            <AccordionItem key={loc.id} expId={loc.experiment.id} title={loc.experiment.title} finished={true} >
                                {loc.experiment.description}
                            </AccordionItem>
                        ))}
                    </div>
                </div>
            )}
            <BackButton to={localStorage.getItem('backLink')} />
        </div>
    );

}

export default ExperiencesScreen;
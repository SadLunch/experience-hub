import { useEffect, useState } from "react";
import { motion } from "framer-motion"
import { MapContainer, TileLayer, Marker } from "react-leaflet";
import L from "leaflet";
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';
import MapCenter from "../../components/MapCenter";
import { locations } from "../../data/locations";
import { Link } from "react-router-dom";
import BackButton from "../../components/BackButton";

const MainScreen = () => {
    const [isLoading, setIsLoading] = useState(true);
    const [isMap, setIsMap] = useState(true);
    const [userLocation, setUserLocation] = useState(null);

    // const experienceLoadingMessage = [
    //     "Getting things ready just for you...",
    //     "Hang tight! We’re getting everything in place...",
    //     "Bringing augmented stories into focus...",
    // ];

    // const gpsLoadingMessage = [
    //     "Dusting off the compass...",
    //     "Calibrating GPS magic...",
    //     "Dropping your pin...",
    //     "Locating you within the narrative",
    // ];

    const checkUserInRadius = () => {
        if (!userLocation) return;
        const center = L.latLng([38.71016737677969, -9.140265017699889]);
        const userLatlng = L.latLng(userLocation);

        const radius = 250;
        const distance = center.distanceTo(userLatlng);
        return distance <= radius;
    }

    useEffect(() => {
        const init = () => {
            // Start loading stuff from backend (add some time to ensure the messages appear)
            // Get user's location
            navigator.geolocation.getCurrentPosition((position) => {
                setUserLocation([position.coords.latitude, position.coords.longitude]);
            }, (error) => {
                console.log(error);
                alert("An error ocurred when trying to get your location!");
            });
            if (checkUserInRadius()) {
                setIsLoading(false);
            } else {
                setIsLoading(false);
                setIsMap(false);
            }
        };

        init();
    }, []);

    //console.log("Render State:", { isLoading, isMap, userLocation });

    return (
        <div className="min-h-screen w-screen bg-gray-900 flex flex-col items-center justify-center p-10">
            <BackButton to="/" />
            {isLoading && (
                <div>
                    {/* Gif of globe spinning like searching for something */}
                    <p id="loadingText" className="text-gray-400 mb-6 text-center"></p>
                </div>
            )}
            {!isLoading && isMap && (
                <div className="relative">
                    <MapContainer center={userLocation} zoom={13} className="w-screen h-screen">
                        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

                        {userLocation && <MapCenter position={userLocation} />}

                        {locations.map((loc) => {
                            <Marker
                                key={loc.id}
                                position={loc.coordinates}
                                icon={L.icon({
                                    iconUrl: icon,
                                    shadowUrl: iconShadow,
                                    iconSize: [25, 41],
                                    iconAnchor: [12, 41]
                                })}
                            ></Marker>
                        })}
                    </MapContainer>
                </div>
            )}
            {!isLoading && !isMap && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl w-full px-4">
                    {locations.map((loc) => (
                        <motion.div key={loc.experiment.id}
                            whileHover={{ scale: 1.05 }}
                            initial={{ opacity: 0, y: 50 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: loc.experiment.id * 0.1 }} >
                            <Link
                                to={!loc.experiment.disabled ? `/website/${loc.experiment.id}` : "#"}
                                className="block bg-gray-800 p-5 rounded-lg shadow-lg hover:bg-gray-700 transition">
                                <h2 className="text-xl font-semibold">{loc.experiment.title}</h2>
                                <p className="text-gray-400">{loc.experiment.description}</p>
                            </Link>
                        </motion.div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default MainScreen
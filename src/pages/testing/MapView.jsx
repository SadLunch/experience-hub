import { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';
import RemoveZoomControl from '../../components/RemoveZoomControl';
import MapResizer from '../../components/MapResizer';
import BackButton from '../../components/BackButton';
import MapCenter from '../../components/MapCenter';
import { Link } from "react-router-dom";
import { locations } from "../../data/locations"; // We'll create this file next
// import { io } from "socket.io-client";

// Connect to Socket.io server
// const socket = io("http://localhost:5000");

const geoapify_API_KEY = 'ccf3f7c703ad4e5585e482e30fc0d767';
const numberOfPpl = (Math.random() * 100).toFixed(0);
const iconSize = numberOfPpl > 999 ? 64 : numberOfPpl > 99 ? 48 : 42;

const userIcon = L.icon({
  iconUrl: `https://api.geoapify.com/v2/icon/?type=material&color=red&size=${iconSize}&contentSize=15&text=${numberOfPpl}&scaleFactor=2&apiKey=${geoapify_API_KEY}`, // Custom icon for user's location
  iconSize: [31, 46],
  iconAnchor: [12, 41],
  className: 'font-FontBtnMenus'
});

const MapView = () => {
  const [userLocation, setUserLocation] = useState(null);

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setUserLocation([position.coords.latitude, position.coords.longitude]);
      },
      (error) => {
        console.error("Error getting location:", error);
        setUserLocation([40.7128, -74.006]); // Default to NYC if location fails
      }
    )
    // socket.on("update_participants", (exp) => {
    //   locations.map((loc) => {
    //     loc.experiment.participants = exp[loc.experiment.id].participants;
    //   });
    // });

    //return () => socket.disconnect();
  }, []);

  // const joinExperiment = (id) => {
  //   socket.emit("join_experiment", id);
  // };

  return (
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
              iconUrl: icon, // Custom marker icon (optional)
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
        <RemoveZoomControl />
        <MapResizer />
      </MapContainer>
      <BackButton to={'/testing'} />
    </div>
  );
};

export default MapView;

import { useEffect } from "react";
import { useMap } from "react-leaflet";

const MapResizer = () => {
  const map = useMap();

  useEffect(() => {
    const handleResize = () => {
      map.invalidateSize();
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [map]);

  return null;
};

export default MapResizer;

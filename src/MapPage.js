import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { firestore } from './firebase-config';
import { collection, getDocs } from 'firebase/firestore';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import './App.css';

function MapPage() {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const snapshot = await getDocs(collection(firestore, 'actus'));
      const data = snapshot.docs
        .map(doc => doc.data())
        .filter(item => item.location && item.location.lat && item.location.lng);
      setEvents(data);
    };

    fetchData();
  }, []);

  const getIconByTheme = (theme) => {
    const colors = {
      "Politique": "blue",
      "Catastrophe naturelle": "red",
      "Culture": "purple",
      "Environnement": "green",
      "Sport": "orange",
      "Sécurité": "black",
    };

    const color = colors[theme] || "gray";

    return L.divIcon({
      className: "custom-marker",
      html: `<div style="background-color:${color}; width:18px; height:18px; border-radius:50%; border:2px solid white;"></div>`,
    });
  };

  return (
    <div className="map-container">
      <h1>Carte des événements</h1>
      <MapContainer center={[20, 0]} zoom={2} style={{ height: "80vh", width: "100%" }}>
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {events.map((event, index) => (
          <Marker
            key={index}
            position={[event.location.lat, event.location.lng]}
            icon={getIconByTheme(event.theme)}
          >
            <Popup>
              <strong>{event.title}</strong><br />
              <em>{event.summary}</em><br />
              <a href={event.url} target="_blank" rel="noopener noreferrer">Lire plus</a>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}

export default MapPage;

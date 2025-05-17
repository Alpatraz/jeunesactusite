import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { firestore } from './firebase-config';
import { collection, getDocs } from 'firebase/firestore';

// Icône personnalisée simple (on peut améliorer par thème ensuite)
const defaultIcon = new L.Icon({
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
  shadowSize: [41, 41]
});

function MapPage() {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const snapshot = await getDocs(collection(firestore, 'events'));
        const data = snapshot.docs.map(doc => doc.data());
        setEvents(data);
      } catch (err) {
        console.error('Erreur de chargement des événements :', err);
      }
    };

    fetchEvents();
  }, []);

  return (
    <div className="App">
      <h1>Carte des Actualités</h1>
      <MapContainer center={[48.8566, 2.3522]} zoom={3} style={{ height: '600px', width: '100%' }}>
        <TileLayer
          attribution='&copy; OpenStreetMap'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {events.map((event, idx) => (
          <Marker
            key={idx}
            position={[event.lat, event.lng]}
            icon={defaultIcon}
          >
            <Popup>
              <strong>{event.title}</strong><br />
              {event.description}<br />
              {event.date && <em>{new Date(event.date).toLocaleDateString()}</em>}
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}

export default MapPage;
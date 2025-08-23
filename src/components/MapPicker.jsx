// src/components/MapPicker.jsx
import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, useMap, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Perbaikan untuk ikon default Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

// Komponen baru yang akan mengontrol peta
function MapController({ position, setPosition }) {
  const map = useMap();

  // Efek ini akan berjalan setiap kali 'position' berubah
  useEffect(() => {
    if (position) {
      // Perintahkan peta untuk terbang ke posisi baru dengan animasi
      map.flyTo([position.lat, position.lng], 15);
    }
  }, [position, map]);

  // Menangani klik pada peta untuk mengubah posisi
  useMapEvents({
    click(e) {
      setPosition(e.latlng);
    },
  });

  return position ? <Marker position={position}></Marker> : null;
}

const MapPicker = ({ onLocationChange }) => {
    // Koordinat default tetap Malang
    const [position, setPosition] = useState({ lat: -7.9666, lng: 112.6326 });

    useEffect(() => {
      // Kirim perubahan lokasi ke komponen induk (ReportPage)
      onLocationChange(position);
    }, [position, onLocationChange]);

    const handleTrackLocation = () => {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const newPos = { lat: pos.coords.latitude, lng: pos.coords.longitude };
          // Cukup ubah state. MapController akan menangani sisanya.
          setPosition(newPos);
        },
        (err) => {
          alert('Tidak bisa mendapatkan lokasi: ' + err.message);
        }
      );
    };

    return (
        <div className="space-y-4">
            <button
                type="button"
                onClick={handleTrackLocation}
                className="w-full p-3 bg-cyan-600 text-white rounded-lg font-bold hover:bg-cyan-700 transition-colors"
            >
                Gunakan Lokasi Saya Saat Ini
            </button>
            <div className="h-64 rounded-lg overflow-hidden border-2 border-white/30">
                <MapContainer
                    center={[position.lat, position.lng]}
                    zoom={13}
                    style={{ height: '100%', width: '100%' }}
                >
                    <TileLayer
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    />
                    {/* Komponen pengontrol kita letakkan di sini */}
                    <MapController position={position} setPosition={setPosition} />
                </MapContainer>
            </div>
        </div>
    );
};

export default MapPicker;
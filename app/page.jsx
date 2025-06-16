"use client";

import { useEffect, useState } from "react";
import axios from "axios";

export default function HomePage() {
  const [locationGranted, setLocationGranted] = useState(null);
  const [ipInfo, setIpInfo] = useState(null);
  const [geoCoords, setGeoCoords] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Ask for geolocation permission
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocationGranted(true);
          setGeoCoords({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
        },
        (err) => {
          setLocationGranted(false);
          setError("Location access denied or unavailable.");
        }
      );
    } else {
      setError("Geolocation is not supported by your browser.");
    }

    // Fetch IP info from ipwho.is
    axios
      .get("https://ipwho.is/")
      .then((res) => {
        if (res.data.success) {
          setIpInfo(res.data);
        } else {
          setError("Failed to fetch IP info.");
        }
      })
      .catch(() => setError("Error fetching IP information."));
  }, []);

  return (
    <main className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-6">
      <h1 className="text-3xl font-bold mb-4">IP & Location Info</h1>

      {error && <p className="text-red-600">{error}</p>}

      {locationGranted === null && <p>Requesting location access...</p>}
      {locationGranted === false && (
        <p className="text-yellow-600">Location access was denied.</p>
      )}
      {locationGranted && geoCoords && (
        <div className="mb-4">
          <h2 className="text-xl font-semibold">Browser Location</h2>
          <p>Latitude: {geoCoords.latitude}</p>
          <p>Longitude: {geoCoords.longitude}</p>
        </div>
      )}

      {ipInfo && (
        <div className="bg-white shadow-lg rounded-lg p-4 w-full max-w-md">
          <h2 className="text-xl font-semibold mb-2">IP Information</h2>
          <p>
            <strong>IP:</strong> {ipInfo.ip}
          </p>
          <p>
            <strong>City:</strong> {ipInfo.city}
          </p>
          <p>
            <strong>Region:</strong> {ipInfo.region}
          </p>
          <p>
            <strong>Country:</strong> {ipInfo.country}
          </p>
          <p>
            <strong>ISP:</strong> {ipInfo.connection?.isp}
          </p>
        </div>
      )}
    </main>
  );
}

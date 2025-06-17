"use client";

import { useEffect, useState } from "react";
import axios from "axios";

const languageContent = {
  en: {
    title: "Welcome",
    message: "This website automatically detects your language.",
    location: "Your IP location info:",
  },
  hi: {
    title: "स्वागत है",
    message: "यह वेबसाइट स्वचालित रूप से आपकी भाषा का पता लगाती है।",
    location: "आपका आईपी स्थान विवरण:",
  },
  fr: {
    title: "Bienvenue",
    message: "Ce site détecte automatiquement votre langue.",
    location: "Informations de localisation IP :",
  },
};

const countryLangMap = {
  IN: "hi",
  US: "en",
  CA: "en",
  FR: "fr",
  DE: "en",
};

export default function HomePage() {
  const [lang, setLang] = useState("en");
  const [ipInfo, setIpInfo] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    axios
      .get("https://ipwho.is/")
      .then((res) => {
        if (res.data.success) {
          setIpInfo(res.data);

          const countryCode = res.data.country_code;
          const detectedLang = countryLangMap[countryCode] || "en";
          setLang(detectedLang);
        } else {
          setError("Could not fetch IP info.");
        }
      })
      .catch(() => setError("Network error while fetching IP info."));
  }, []);

  const content = languageContent[lang];

  return (
    <main className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-6">
      <div className="mb-4">
        <label className="mr-2 font-medium">🌐 Select Language:</label>
        <select
          value={lang}
          onChange={(e) => setLang(e.target.value)}
          className="p-2 border rounded-md shadow-sm"
        >
          {Object.entries(languageContent).map(([code, text]) => (
            <option key={code} value={code}>
              {text.title}
            </option>
          ))}
        </select>
      </div>

      <h1 className="text-3xl font-bold mb-2">{content.title}</h1>
      <p className="mb-6 text-lg">{content.message}</p>

      {error && <p className="text-red-600">{error}</p>}

      {ipInfo && (
        <div className="bg-white shadow-md rounded-lg p-4 w-full max-w-md">
          <h2 className="text-xl font-semibold mb-2">{content.location}</h2>
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

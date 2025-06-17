"use client";

import { useEffect, useState, useCallback } from "react";
import axios from "axios";
import {
  Globe,
  Languages,
  MapPin,
  Wifi,
  Server,
  Clock,
  User,
  Smartphone,
  Monitor,
  Navigation,
  Shield,
  Flag,
  RefreshCw,
  ChevronDown,
  Sparkles,
} from "lucide-react";

const languageContent = {
  en: {
    title: "Welcome",
    message: "This website automatically detects your language and location.",
    location: "Your digital footprint:",
    time: "Current time in your location:",
    device: "Device info:",
    select: "Select Language:",
    refresh: "Refresh Data",
    detected: "Auto-detected",
  },
  hi: {
    title: "स्वागत है",
    message: "यह वेबसाइट स्वचालित रूप से आपकी भाषा और स्थान का पता लगाती है।",
    location: "आपका डिजिटल पदचिह्न:",
    time: "आपके स्थान पर वर्तमान समय:",
    device: "डिवाइस की जानकारी:",
    select: "भाषा चुनें:",
    refresh: "डेटा रिफ्रेश करें",
    detected: "स्वतः पता चला",
  },
  fr: {
    title: "Bienvenue",
    message: "Ce site détecte automatiquement votre langue et votre position.",
    location: "Votre empreinte numérique:",
    time: "Heure actuelle à votre emplacement:",
    device: "Informations sur l'appareil:",
    select: "Choisir la langue:",
    refresh: "Actualiser les données",
    detected: "Détecté automatiquement",
  },
  ja: {
    title: "ようこそ",
    message: "このウェブサイトは自動的にあなたの言語と位置を検出します。",
    location: "デジタルフットプリント:",
    time: "現在の現地時間:",
    device: "デバイス情報:",
    select: "言語を選択:",
    refresh: "データを更新",
    detected: "自動検出",
  },
  es: {
    title: "Bienvenido",
    message: "Este sitio web detecta automáticamente tu idioma y ubicación.",
    location: "Tu huella digital:",
    time: "Hora actual en tu ubicación:",
    device: "Información del dispositivo:",
    select: "Seleccionar idioma:",
    refresh: "Actualizar datos",
    detected: "Detectado automáticamente",
  },
};

const countryLangMap = {
  IN: "hi",
  US: "en",
  CA: "en",
  FR: "fr",
  DE: "de",
  JP: "ja",
  ES: "es",
  MX: "es",
};

export default function HomePage() {
  const [lang, setLang] = useState("en");
  const [ipInfo, setIpInfo] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [userAgent, setUserAgent] = useState(null);
  const [localTime, setLocalTime] = useState("");
  const [isAutoDetected, setIsAutoDetected] = useState(false);

  const fetchData = useCallback(() => {
    setLoading(true);
    axios
      .get("https://ipwho.is/")
      .then((res) => {
        if (res.data.success) {
          setIpInfo(res.data);

          const countryCode = res.data.country_code;
          const detectedLang = countryLangMap[countryCode] || "en";
          setLang(detectedLang);
          setIsAutoDetected(true);

          // Set local time
          const timezone = res.data.timezone?.utc || "UTC";
          const options = {
            timeStyle: "long",
            dateStyle: "full",
            timeZone: timezone,
          };
          setLocalTime(new Date().toLocaleString(lang, options));
        } else {
          setError("Could not fetch IP info.");
        }
      })
      .catch(() => setError("Network error while fetching IP info."))
      .finally(() => setLoading(false));
  }, [lang]); // Add dependencies that are used inside fetchData

  useEffect(() => {
    fetchData();
    setUserAgent(navigator.userAgent);
  }, [fetchData]); // Now we can safely add fetchData to dependencies

  useEffect(() => {
    if (ipInfo?.timezone?.utc) {
      const options = {
        timeStyle: "long",
        dateStyle: "full",
        timeZone: ipInfo.timezone.utc,
      };
      setLocalTime(new Date().toLocaleString(lang, options));

      const timer = setInterval(() => {
        setLocalTime(new Date().toLocaleString(lang, options));
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [ipInfo, lang]);

  const content = languageContent[lang] || languageContent.en;

  const getDeviceType = () => {
    const ua = userAgent;
    if (/(tablet|ipad|playbook|silk)|(android(?!.*mobi))/i.test(ua)) {
      return "Tablet";
    }
    if (
      /Mobile|Android|iP(hone|od)|IEMobile|BlackBerry|Kindle|Silk-Accelerated|(hpw|web)OS|Opera M(obi|ini)/.test(
        ua
      )
    ) {
      return "Mobile";
    }
    return "Desktop";
  };

  const getOS = () => {
    const ua = userAgent;
    if (/Windows/.test(ua)) return "Windows";
    if (/Mac OS/.test(ua)) return "MacOS";
    if (/Linux/.test(ua)) return "Linux";
    if (/Android/.test(ua)) return "Android";
    if (/iOS/.test(ua)) return "iOS";
    return "Unknown OS";
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-gray-100 flex flex-col items-center justify-center p-6">
      <div className="w-full max-w-4xl">
        {/* Header with animated gradient */}
        <div className="mb-8 text-center">
          <div className="flex items-center justify-center mb-4">
            <Globe className="h-10 w-10 mr-3 text-cyan-400" />
            <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-purple-500">
              {content.title}
            </h1>
          </div>
          <p className="text-lg text-gray-300 max-w-2xl mx-auto">
            {content.message}
          </p>
        </div>

        {/* Language selector with futuristic design */}
        <div className="mb-8 bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700 shadow-lg">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center">
              <Languages className="h-5 w-5 mr-2 text-purple-400" />
              <span className="font-medium text-gray-300">
                {content.select}
              </span>
              {isAutoDetected && (
                <span className="ml-2 px-2 py-1 text-xs bg-cyan-900/30 text-cyan-400 rounded-full flex items-center">
                  <Sparkles className="h-3 w-3 mr-1" />
                  {content.detected}
                </span>
              )}
            </div>

            <div className="relative flex-1 max-w-xs">
              <select
                value={lang}
                onChange={(e) => {
                  setLang(e.target.value);
                  setIsAutoDetected(false);
                }}
                className="w-full appearance-none bg-gray-700 border border-gray-600 rounded-lg py-3 pl-4 pr-10 text-gray-100 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
              >
                {Object.entries(languageContent).map(([code, text]) => (
                  <option key={code} value={code} className="bg-gray-800">
                    {text.title} ({code.toUpperCase()})
                  </option>
                ))}
              </select>
              <ChevronDown className="h-4 w-4 absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" />
            </div>

            <button
              onClick={fetchData}
              disabled={loading}
              className="flex items-center justify-center px-4 py-3 bg-cyan-600 hover:bg-cyan-700 text-white rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <RefreshCw
                className={`h-4 w-4 mr-2 ${loading ? "animate-spin" : ""}`}
              />
              {content.refresh}
            </button>
          </div>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-900/30 border border-red-700 rounded-lg flex items-center">
            <Shield className="h-5 w-5 mr-2 text-red-400" />
            <span className="text-red-300">{error}</span>
          </div>
        )}

        {loading && (
          <div className="mb-6 p-6 flex flex-col items-center justify-center">
            <div className="animate-pulse flex space-x-4">
              <div className="rounded-full bg-cyan-500 h-12 w-12"></div>
            </div>
            <p className="mt-4 text-gray-400">
              Detecting your digital footprint...
            </p>
          </div>
        )}

        {ipInfo && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Location Card */}
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700 shadow-lg hover:border-cyan-500/30 transition-all duration-300">
              <div className="flex items-center mb-4">
                <MapPin className="h-5 w-5 mr-2 text-cyan-400" />
                <h2 className="text-xl font-semibold">{content.location}</h2>
              </div>
              <div className="space-y-3">
                <div className="flex items-start">
                  <Wifi className="h-4 w-4 mr-2 mt-1 text-gray-400 flex-shrink-0" />
                  <div>
                    <p className="text-sm text-gray-400">IP Address</p>
                    <p className="font-mono">{ipInfo.ip}</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <Navigation className="h-4 w-4 mr-2 mt-1 text-gray-400 flex-shrink-0" />
                  <div>
                    <p className="text-sm text-gray-400">Location</p>
                    <p>
                      {ipInfo.city}, {ipInfo.region}, {ipInfo.country}
                    </p>
                  </div>
                </div>
                <div className="flex items-start">
                  <Flag className="h-4 w-4 mr-2 mt-1 text-gray-400 flex-shrink-0" />
                  <div>
                    <p className="text-sm text-gray-400">Country Code</p>
                    <p>{ipInfo.country_code}</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <Server className="h-4 w-4 mr-2 mt-1 text-gray-400 flex-shrink-0" />
                  <div>
                    <p className="text-sm text-gray-400">ISP</p>
                    <p>{ipInfo.connection?.isp || "Unknown"}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Time & Device Info Card */}
            <div className="space-y-6">
              <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700 shadow-lg hover:border-purple-500/30 transition-all duration-300">
                <div className="flex items-center mb-4">
                  <Clock className="h-5 w-5 mr-2 text-purple-400" />
                  <h2 className="text-xl font-semibold">{content.time}</h2>
                </div>
                <p className="text-2xl font-mono text-center py-4 bg-gray-900/30 rounded-lg">
                  {localTime || "Calculating..."}
                </p>
                <p className="text-sm text-gray-400 mt-2 text-center">
                  Timezone: {ipInfo.timezone?.utc || "UTC"}
                </p>
              </div>

              <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700 shadow-lg hover:border-amber-500/30 transition-all duration-300">
                <div className="flex items-center mb-4">
                  <User className="h-5 w-5 mr-2 text-amber-400" />
                  <h2 className="text-xl font-semibold">{content.device}</h2>
                </div>
                <div className="space-y-3">
                  <div className="flex items-start">
                    {getDeviceType() === "Mobile" ? (
                      <Smartphone className="h-4 w-4 mr-2 mt-1 text-gray-400 flex-shrink-0" />
                    ) : (
                      <Monitor className="h-4 w-4 mr-2 mt-1 text-gray-400 flex-shrink-0" />
                    )}
                    <div>
                      <p className="text-sm text-gray-400">Device Type</p>
                      <p>{getDeviceType()}</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <Server className="h-4 w-4 mr-2 mt-1 text-gray-400 flex-shrink-0" />
                    <div>
                      <p className="text-sm text-gray-400">Operating System</p>
                      <p>{getOS()}</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <Globe className="h-4 w-4 mr-2 mt-1 text-gray-400 flex-shrink-0" />
                    <div>
                      <p className="text-sm text-gray-400">Browser</p>
                      <p>
                        {navigator.userAgent.split(") ").pop().split(" ")[0]}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="mt-12 text-center text-sm text-gray-500">
          <p>© {new Date().getFullYear()} Digital Footprint Analyzer</p>
          <p className="mt-1">All data is processed locally and not stored</p>
        </div>
      </div>
    </main>
  );
}

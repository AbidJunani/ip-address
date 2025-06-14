/** @type {import('next').NextConfig} */
const nextConfig = {
  i18n: {
    locales: ["en", "hi", "mr", "ur", "ta", "bn", "gu"], // Added Marathi, Urdu, Tamil, Bengali, Gujarati
    defaultLocale: "en",
  },
};

export default nextConfig;

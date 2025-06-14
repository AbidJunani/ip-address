// middleware.js
import { NextResponse } from "next/server";

export async function middleware(req) {
  const { pathname } = req.nextUrl;

  // List of supported locales
  const locales = ["en", "hi", "mr", "ur", "ta", "bn", "gu"];

  // Check if the path starts with a supported locale
  const pathLocale = locales.find(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  );

  // If it's already a localized route or API route, skip
  if (pathLocale || pathname.startsWith("/api")) {
    const response = NextResponse.next();
    // Still pass the IP header if available
    const ip =
      req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "127.0.0.1";
    response.headers.set("x-user-ip", ip);
    return response;
  }

  // Only proceed with geo-detection for non-localized routes
  try {
    const ip =
      req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "127.0.0.1";

    const geoRes = await fetch(`https://ipwho.is/${ip}`);
    const geoData = await geoRes.json();

    if (!geoData.success) {
      throw new Error(geoData.message || "IP lookup failed");
    }

    const countryLangMap = {
      IN: "hi", // India - Hindi
      PK: "ur", // Pakistan - Urdu
      BD: "bn", // Bangladesh - Bengali
      LK: "ta", // Sri Lanka - Tamil
    };

    const regionLangMap = {
      MH: "mr", // Maharashtra - Marathi
      GJ: "gu", // Gujarat - Gujarati
      TN: "ta", // Tamil Nadu - Tamil
      WB: "bn", // West Bengal - Bengali
    };

    let lang =
      regionLangMap[geoData.region_code] ||
      countryLangMap[geoData.country_code] ||
      "en";

    if (!locales.includes(lang)) lang = "en";

    // Redirect to the detected language
    const url = req.nextUrl.clone();
    url.pathname = `/${lang}${pathname}`;
    return NextResponse.redirect(url);
  } catch (error) {
    console.error("Geo IP Lookup failed:", error);
    // Fallback to English
    const url = req.nextUrl.clone();
    url.pathname = `/en${pathname}`;
    return NextResponse.redirect(url);
  }
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};

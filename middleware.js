// middleware.js
import { NextResponse } from "next/server";

export async function middleware(req) {
  const pathname = req.nextUrl.pathname;

  const locales = ["en", "hi", "mr", "ur", "ta", "bn", "gu"];
  const isLocalized = locales.some(
    (locale) => pathname === `/${locale}` || pathname.startsWith(`/${locale}/`)
  );

  const ip = req.headers.get("x-forwarded-for") || "127.0.0.1";

  if (isLocalized || pathname === "/[lang]" || pathname.startsWith("/api")) {
    const response = NextResponse.next();
    response.headers.set("x-user-ip", ip); // ✅ pass IP via header
    return response;
  }

  try {
    const geoRes = await fetch(`https://ipapi.co/${ip}/json/`);
    const geoData = await geoRes.json();
    const countryCode = geoData.country_code;

    const countryLangMap = {
      IN: "hi",
      PK: "ur",
      BD: "bn",
      LK: "ta",
    };

    const regionLangMap = {
      MH: "mr",
      GJ: "gu",
      TN: "ta",
    };

    let lang =
      regionLangMap[geoData.region_code] || countryLangMap[countryCode] || "en";

    if (!locales.includes(lang)) lang = "en";

    const url = req.nextUrl.clone();
    url.pathname = `/${lang}${pathname}`;
    return NextResponse.redirect(url);
  } catch (error) {
    console.error("Geo IP Lookup failed:", error.message);
    const fallbackUrl = req.nextUrl.clone();
    fallbackUrl.pathname = `/en${pathname}`;
    return NextResponse.redirect(fallbackUrl);
  }
}

export const config = {
  matcher: ["/((?!_next|favicon.ico|images|fonts|api).*)"],
};

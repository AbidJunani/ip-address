import { NextResponse } from "next/server";

export async function middleware(req) {
  const pathname = req.nextUrl.pathname;
  console.log("Processing path:", pathname);

  const locales = ["en", "hi", "mr", "ur", "ta", "bn", "gu"];

  // Skip if already localized or API route
  if (
    locales.some(
      (locale) =>
        pathname === `/${locale}` || pathname.startsWith(`/${locale}/`)
    ) ||
    pathname.startsWith("/api")
  ) {
    console.log("Skipping localization for:", pathname);
    return NextResponse.next();
  }

  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "127.0.0.1";
  console.log("Detected IP:", ip);

  try {
    // Try ipwho.is as alternative
    const geoRes = await fetch(`https://ipwho.is/${ip}`);
    const geoData = await geoRes.json();
    console.log("Geo Data:", JSON.stringify(geoData, null, 2));

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

    if (!locales.includes(lang)) {
      console.log("Language not in supported locales, defaulting to English");
      lang = "en";
    }

    console.log("Redirecting to language:", lang);
    const url = req.nextUrl.clone();
    url.pathname = `/${lang}${pathname === "/" ? "" : pathname}`;
    return NextResponse.redirect(url);
  } catch (error) {
    console.error("Geo IP Lookup failed:", error.message);
    const fallbackUrl = req.nextUrl.clone();
    fallbackUrl.pathname = `/en${pathname}`;
    return NextResponse.redirect(fallbackUrl);
  }
}

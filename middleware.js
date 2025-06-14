import { NextResponse } from "next/server";

const locales = ["en", "hi", "mr", "ur", "ta", "bn", "gu"];

export async function middleware(request) {
  const { pathname } = request.nextUrl;

  // Skip if already has a locale or is an API route
  if (
    locales.some(
      (locale) =>
        pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
    ) ||
    pathname.startsWith("/api")
  ) {
    const response = NextResponse.next();
    // Add IP to header
    const ip =
      request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      "127.0.0.1";
    response.headers.set("x-user-ip", ip);
    return response;
  }

  try {
    const ip =
      request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      "127.0.0.1";
    const response = await fetch(`https://ipwho.is/${ip}`);
    const data = await response.json();

    const langMap = {
      // Country codes
      IN: "hi",
      PK: "ur",
      BD: "bn",
      LK: "ta",
      // Region codes (India)
      MH: "mr",
      GJ: "gu",
      TN: "ta",
      WB: "bn",
    };

    let lang = langMap[data.region_code] || langMap[data.country_code] || "en";
    if (!locales.includes(lang)) lang = "en";

    return NextResponse.redirect(new URL(`/${lang}${pathname}`, request.url));
  } catch (error) {
    console.error("GeoIP failed:", error);
    return NextResponse.redirect(new URL("/en", request.url));
  }
}

export const config = {
  matcher: ["/((?!_next|images|fonts|favicon.ico).*)"],
};

// ✅ Server Component
import { headers } from "next/headers";

export default function Page({ params }) {
  const { lang } = params;

  const content = {
    en: {
      title: "Welcome",
      message: "This website automatically detects your language.",
    },
    hi: {
      title: "स्वागत है",
      message: "यह वेबसाइट स्वचालित रूप से आपकी भाषा का पता लगाती है।",
    },
    // Add others...
  };

  const { title, message } = content[lang] || content.en;

  // ✅ Access IP via headers in the same server component
  const ip = headers().get("x-user-ip") || "Unknown IP";

  return (
    <main className="p-10 text-center">
      <h1 className="text-4xl font-bold">{title}</h1>
      <p className="mt-4 text-lg">{message}</p>
      <p className="mt-6 text-sm text-gray-600">
        Your IP address: <strong>{ip}</strong>
      </p>
    </main>
  );
}

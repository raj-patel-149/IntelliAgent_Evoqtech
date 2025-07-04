"use client";

import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Provider } from "react-redux";
import { store, persistor } from "@/store"; // ✅ Import persistor
import { PersistGate } from "redux-persist/integration/react";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// Function to get the tab title dynamically
const getTitleFromPath = (pathname) => {
  if (pathname.includes("/manager")) return " -";
  if (pathname.includes("/customer")) return "HCMS - Customer";
  if (pathname.includes("/employee")) return "HCMS - Employee";
  return "HCMS"; // Default title
};

export default function RootLayout({ children }) {
  const pathname = usePathname();
  const [pageTitle, setPageTitle] = useState("HCMS");

  useEffect(() => {
    setPageTitle(getTitleFromPath(pathname)); // Update title based on URL
  }, [pathname]);
  return (
    <html lang="en">
      <head>
        <title>IntelliAgent</title>
        <link rel="icon" href="/icon1.png" type="image/jpeg" />

        <link
          href="https://cdn.jsdelivr.net/npm/remixicon@4.5.0/fonts/remixicon.css"
          rel="stylesheet"
        />

        <link
          rel="stylesheet"
          href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
        />

        {/* Inside <head> tag */}
        <script src="https://checkout.razorpay.com/v1/checkout.js"></script>
      </head>

      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Provider store={store}>
          <PersistGate loading={null} persistor={persistor}>
            {children}
          </PersistGate>
        </Provider>
      </body>
    </html>
  );
}

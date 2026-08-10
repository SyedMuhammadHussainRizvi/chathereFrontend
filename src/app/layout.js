"use client"

import "./globals.css";
import { SessionProvider } from "next-auth/react";


export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={` h-full`}
    >
      <body className="min-h-full flex flex-col">
        <SessionProvider>
        {children}
        </SessionProvider>

        
      </body>
    </html>
  );
}

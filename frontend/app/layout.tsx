import type React from "react"
import "./globals.css"
import { Sidebar } from "@/components/sidebar"

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="bg-[var(--bg)] text-[var(--text)] min-h-screen">
        <div className="flex min-h-screen">
          <Sidebar />
          <main className="flex-1 lg:ml-64">{children}</main>
        </div>
      </body>
    </html>
  )
}

export const metadata = {
      generator: 'v0.dev'
    };

import './globals.css'
import React from 'react'

export const metadata = {
  title: 'DeviroxN Enterprise',
  description: 'Enterprise app scaffold for Finance, Marketplace, and Real Estate'
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  )
}

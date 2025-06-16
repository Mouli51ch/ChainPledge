import type React from "react"
import type { Metadata } from "next"
import { Inter, Orbitron } from "next/font/google"
import "./globals.css"
import { Toaster } from "@/components/ui/toaster"
import { WalletProvider } from "@/components/WalletProvider"
import { ConnectWallet } from "@/components/ConnectWallet"

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" })
const orbitron = Orbitron({ subsets: ["latin"], variable: "--font-orbitron" })

export const metadata: Metadata = {
  title: "ChainPledge - Make a Promise. Stake It. Keep It.",
  description: "A decentralized self-improvement platform built on Aptos blockchain",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.variable} ${orbitron.variable} font-sans bg-slate-900 text-white min-h-screen`}>
        <WalletProvider>
          <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900/20 to-indigo-900/30">
            <header className="p-4 flex justify-end">
              <ConnectWallet />
            </header>
            {children}
          </div>
        </WalletProvider>
        <Toaster />
      </body>
    </html>
  )
}

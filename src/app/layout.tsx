import type { Metadata } from 'next'
import { Outfit } from 'next/font/google'
import './globals.css'
import Providers from '@/components/Providers'

const outfit = Outfit({ subsets: ['latin'], variable: '--font-outfit' })

export const metadata: Metadata = {
    title: 'Visionboard.ro - Creează-ți Panoul Visurilor',
    description: 'Proiectează și comandă propriul Visionboard pe canvas, forex sau sticlă acrilică. Dă viață visurilor tale!',
}

export default function RootLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <html lang="ro">
            <body className={outfit.variable}>
                <div className="flex flex-col min-h-screen">
                    <Providers>
                        {children}
                    </Providers>
                </div>
            </body>
        </html>
    )
}

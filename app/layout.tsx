import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import './globals.css'
import ThemeToggle from '@/components/ThemeToggle'

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode
}>) {
	return (
		<html lang='en'>
			<body
				className={`${geistSans.variable} ${geistMono.variable} antialiased`}
			>
				<div className='flex flex-col justify-center items-center min-h-dvh p-8 font-[family-name:var(--font-geist-sans)]'>
					<div className='fixed right-4 top-2'>
						<ThemeToggle />
					</div>
					{children}
				</div>
			</body>
		</html>
	)
}

const geistSans = Geist({
	variable: '--font-geist-sans',
	subsets: ['latin'],
})

const geistMono = Geist_Mono({
	variable: '--font-geist-mono',
	subsets: ['latin'],
})

export const metadata: Metadata = {
	title: 'MPL results',
}

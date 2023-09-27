import './globals.scss'
import { Inter } from 'next/font/google'
import LocalFont from 'next/font/local'
import { NextAuthProvider } from './Providers'
const inter = Inter({ subsets: ['latin'] })

const pro = LocalFont({
  src: [
    {
      path: '../../public/fonts/ProximaNova-Black.otf',
      weight: '1000',
      style: 'bold',
    },
    {
      path: '../../public/fonts/ProximaNova-Extrabold.otf',
      weight: '900',
      style: 'bold',
    },
    {
      path: '../../public/fonts/ProximaNova-Bold.otf',
      weight: '800',
      style: 'normal',
    },
    {
      path: '../../public/fonts/ProximaNova-Regular.otf',
      weight: '600',
      style: 'normal',
    },
    {
      path: '../../public/fonts/ProximaNova-Semibold.otf',
      weight: '700',
      style: 'normal',
    },
    {
      path: '../../public/fonts/ProximaNova-Light.otf',
      weight: '200',
      style: 'normal',
    },
    {
      path: '../../public/fonts/ProximaNova-Thin.otf',
      weight: '100',
      style: 'normal',
    }
  ]
})

export const metadata = {
  title: 'Roggers Portfolio',
  description: 'complete next app created with love!',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={pro.className}>
        <NextAuthProvider>
        {children}
        </NextAuthProvider>
        </body>
    </html>
  )
}

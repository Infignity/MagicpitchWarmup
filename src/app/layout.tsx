import './globals.css'
import GlobalToastProvider from "./contexts/GlobalToastProvider"
import AuthProvider from './contexts/AuthProvider'
import AuthProtected from './components/AuthProtected'

export default function RootLayout({
  children,
}: {
    children: React.ReactNode
  }) {
  return (
    <html lang="en">
      <body className={`w-screen h-screen`}>
        <GlobalToastProvider>
          <AuthProvider>
            {/* <AuthProtected> */ }
              {children}
            {/* </AuthProtected> */ }
          </AuthProvider>
        </GlobalToastProvider>
      </body>
    </html>
  )
}

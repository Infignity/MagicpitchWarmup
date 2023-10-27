import './globals.css'
import GlobalToastProvider from "./contexts/GlobalToastProvider"
import AuthProvider from './contexts/AuthProvider'
import AuthProtected from './components/AuthProtected'
import ReduxProvider from './(dashboard)/contexts/ReduxProvider'

export default function RootLayout({
  children,
}: {
    children: React.ReactNode
  }) {
  return (
    <html lang="en">
      <body className={`w-screen h-screen`}>
        <ReduxProvider>
          <GlobalToastProvider>
            <AuthProvider>
              <AuthProtected>
                {children}
              </AuthProtected>
            </AuthProvider>
          </GlobalToastProvider>
        </ReduxProvider>
      </body>
    </html>
  )
}

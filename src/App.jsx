import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'

import { LanguageProvider } from '@/context/LanguageContext'
import { ThemeProvider } from '@/context/ThemeContext'
import { UserProvider } from '@/context/UserContext'
import DashboardLayout from '@/layouts/DashboardLayout'
import AboutUs from '@/pages/AboutUs'
import DashboardHome from '@/pages/DashboardHome'
import LoginSignup from '@/pages/LoginSignup'
import ScreeningPage from '@/pages/ScreeningPage'
import Settings from '@/pages/Settings'

export default function App() {
  return (
    <UserProvider>
      <ThemeProvider>
        <LanguageProvider>
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<LoginSignup />} />
              <Route element={<DashboardLayout />}>
                <Route path="/dashboard" element={<DashboardHome />} />
                <Route path="/screening" element={<ScreeningPage />} />
                <Route path="/settings" element={<Settings />} />
                <Route path="/about" element={<AboutUs />} />
              </Route>
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </BrowserRouter>
        </LanguageProvider>
      </ThemeProvider>
    </UserProvider>
  )
}

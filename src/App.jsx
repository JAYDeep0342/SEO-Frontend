import { useState, useEffect } from 'react'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { ThemeProvider } from './context/ThemeContext'
import { AuthProvider } from './context/AuthContext'
import Layout from './components/layout/Layout'
import AuthLayout from './components/layout/AuthLayout'
import AppLayout from './components/layout/AppLayout'
import ProtectedRoute from './components/auth/ProtectedRoute'
import Home from './pages/Home'
import Login from './pages/auth/Login'
import Signup from './pages/auth/Signup'
import Dashboard from './pages/app/Dashboard'
import OnPageScore from './pages/app/onpage/OnPageScore'
import MetaTagGenerator from './pages/app/metatag/MetaTagGenerator'
import SchemaMarkup from './pages/app/schema/SchemaMarkup'
import RobotsAnalyzer from './pages/app/robots/RobotsAnalyzer'
import KeywordResearch from './pages/app/keyword/KeywordResearch'
import PageSpeed from './pages/app/pagespeed/PageSpeed'
import TechnicalAudit from './pages/app/audit/TechnicalAudit'
import ContentGenerator from './pages/app/content/ContentGenerator'
import GscDashboard from './pages/app/gsc/GscDashboard'
import ConnectGoogle from './pages/app/gsc/ConnectGoogle'
import PageLoader from './components/common/PageLoader'

function App() {
  const [loading, setLoading] = useState(true)

  useEffect(() => {




    const id = requestAnimationFrame(() => {
      setTimeout(() => setLoading(false), 900)
    })
    return () => cancelAnimationFrame(id)
  }, [])

  return (
    <ThemeProvider>
      <AuthProvider>
        <PageLoader visible={loading} />
        <Toaster position="top-center" toastOptions={{
          style: { background: 'var(--color-surface-card)', color: 'var(--color-text)', border: '1px solid var(--color-border)' },
        }} />
        <BrowserRouter>
          <Routes>
            <Route element={<Layout />}>
              <Route path="/" element={<Home />} />
            </Route>

            <Route element={<AuthLayout />}>
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
            </Route>

            <Route element={<ProtectedRoute />}>
              <Route element={<AppLayout />}>
                <Route path="/app" element={<Dashboard />} />
                <Route path="/app/onpage" element={<OnPageScore />} />
                <Route path="/app/meta-tags" element={<MetaTagGenerator />} />
                <Route path="/app/schema" element={<SchemaMarkup />} />
                <Route path="/app/robots" element={<RobotsAnalyzer />} />
                <Route path="/app/keyword" element={<KeywordResearch />} />
                <Route path="/app/pagespeed" element={<PageSpeed />} />
                <Route path="/app/audit" element={<TechnicalAudit />} />
                <Route path="/app/content" element={<ContentGenerator />} />
                <Route path="/app/gsc" element={<GscDashboard />} />
                <Route path="/app/gsc/connect" element={<ConnectGoogle />} />
              </Route>
            </Route>

            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  )
}

export default App

import { useState } from 'react'
import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom'
import { Home, LayoutGrid, LogOut, Menu, X } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuth } from '../../context/AuthContext'
import { APP_NAV_ITEMS } from '../../config/tools'
import PageBackground from '../common/PageBackground'
import Logo from '../common/Logo'
import ThemeToggle from '../common/ThemeToggle'
import Button from '../common/Button'
import ToolSearch from './ToolSearch'

function navLinkClass({ isActive }) {
  return `flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm transition-all ${
    isActive
      ? 'bg-primary/10 text-primary border border-primary/25'
      : 'text-text-muted border border-transparent hover:bg-surface-2/60 hover:text-text'
  }`
}

function SidebarLinks({ onNavigate }) {
  return (
    <nav className="flex flex-col gap-1">
      <NavLink to="/app" end className={navLinkClass} onClick={onNavigate}>
        <LayoutGrid size={17} />
        Dashboard
      </NavLink>
      {APP_NAV_ITEMS.map(({ icon: Icon, title, route }) => (
        <NavLink key={route} to={route} className={navLinkClass} onClick={onNavigate}>
          <Icon size={17} />
          {title}
        </NavLink>
      ))}
    </nav>
  )
}

// Signed-in user + logout — lives at the bottom of the sidebar (desktop and
// mobile). Theme toggle lives in the top header instead (next to search),
// not duplicated here.
function SidebarFooter({ user, onLogout }) {
  return (
    <div className="mt-auto flex items-center justify-between gap-2 border-t border-border pt-4">
      <span className="min-w-0 truncate text-xs text-text-muted">{user?.username}</span>
      <Button variant="ghost" size="sm" onClick={onLogout} className="shrink-0 whitespace-nowrap">
        <LogOut size={15} />
        Log out
      </Button>
    </div>
  )
}

export default function AppLayout() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [mobileOpen, setMobileOpen] = useState(false)

  const handleLogout = () => {
    logout()
    navigate('/login', { replace: true })
  }

  return (
    <div className="relative flex min-h-screen bg-bg text-text selection:bg-primary/30 selection:text-primary">
      <PageBackground />

      {/* Desktop sidebar — sticky + its own scroll, so it stays put while
          the main content scrolls. */}
      <aside className="sticky top-0 z-10 hidden h-screen w-64 shrink-0 flex-col overflow-y-auto border-r border-border bg-surface/60 px-4 py-6 backdrop-blur-md lg:flex">
        <Logo className="mb-8 px-1" />
        <SidebarLinks />
        <SidebarFooter user={user} onLogout={handleLogout} />
      </aside>

      <div className="relative z-10 flex min-w-0 flex-1 flex-col">
        {/* App header — logo on the left (mirrors the home page), tool
            search + theme toggle grouped together on the right. */}
        <header className="sticky top-0 z-10 flex items-center gap-3 border-b border-border bg-surface/80 px-4 py-3 backdrop-blur-md sm:px-6">
          <button
            type="button"
            onClick={() => setMobileOpen(true)}
            aria-label="Open menu"
            className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-border bg-surface/60 text-text transition-colors hover:border-primary/40 lg:hidden"
          >
            <Menu size={18} />
          </button>

          <Link
            to="/"
            aria-label="Back to home"
            className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-border bg-surface/60 text-text transition-colors hover:border-primary/40 hover:text-primary"
          >
            <Home size={18} />
          </Link>

          <div className="flex flex-1 items-center justify-end gap-3">
            <ToolSearch className="w-full max-w-sm" />
            <ThemeToggle className="shrink-0" />
          </div>
        </header>

        <main className="flex-1 px-4 py-6 sm:px-6 lg:px-10">
          <Outlet />
        </main>
      </div>

      {/* Mobile slide-over sidebar */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              key="backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40 bg-black/50 lg:hidden"
              onClick={() => setMobileOpen(false)}
            />
            <motion.aside
              key="panel"
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
              className="fixed inset-y-0 left-0 z-50 flex w-72 flex-col border-r border-border bg-surface px-4 py-6 shadow-xl lg:hidden"
            >
              <div className="mb-8 flex items-center justify-between">
                <Logo />
                <button
                  type="button"
                  onClick={() => setMobileOpen(false)}
                  aria-label="Close menu"
                  className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-border text-text"
                >
                  <X size={18} />
                </button>
              </div>
              <SidebarLinks onNavigate={() => setMobileOpen(false)} />
              <SidebarFooter user={user} onLogout={handleLogout} />
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}

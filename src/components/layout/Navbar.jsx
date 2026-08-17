import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { LayoutGrid, LogOut, Menu, X } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import Container from '../common/Container'
import Button from '../common/Button'
import ThemeToggle from '../common/ThemeToggle'
import ScrambleText from '../common/ScrambleText'
import Logo from '../common/Logo'
import { useAuth } from '../../context/AuthContext'

const NAV_LINKS = [
  { label: 'Home',     href: '#home' },
  { label: 'Services', href: '#services' },
  { label: 'Features', href: '#features' },
  { label: 'About',    href: '#about' },
]

function navLinkClass({ mobile = false } = {}) {
  if (mobile) {
    return 'rounded-full border border-border bg-surface-2/50 px-4 py-2.5 text-sm text-center font-normal text-text transition-all hover:border-accent-lime/40 hover:bg-accent-lime/10 hover:text-accent-lime hover:shadow-[0_0_16px_var(--glow-lime)]'
  }
  return 'rounded-full px-4 py-1.5 text-xs font-normal whitespace-nowrap text-text transition-all hover:bg-accent-lime/10 hover:text-accent-lime hover:shadow-[0_0_16px_var(--glow-lime)]'
}

const mobileMenuVariants = {
  hidden:  { opacity: 0, y: -16, scaleY: 0.92 },
  visible: { opacity: 1, y: 0,   scaleY: 1 },
  exit:    { opacity: 0, y: -12, scaleY: 0.95 },
}

const MotionLink = motion.create(Link)

// `showActions` controls whether the theme toggle + login/signup (or
// dashboard/logout) button cluster renders — AppLayout passes `false` since
// those same controls live in its sidebar instead, avoiding duplication.
// `leftAccessory` renders just before the logo — AppLayout uses it for its
// own mobile "open tool sidebar" hamburger, distinct from this navbar's own
// (marketing nav links) mobile menu toggle.
export default function Navbar({ showActions = true, leftAccessory = null }) {
  const [open, setOpen] = useState(false)
  const { isAuthenticated, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    setOpen(false)
    navigate('/')
  }

  return (
    <header className="relative z-50 w-full px-3 py-3 sm:px-6 sm:py-4">

      <div className="mx-auto max-w-7xl rounded-2xl border border-border-strong bg-bg/80 shadow-[0_4px_24px_var(--glow)] backdrop-blur-2xl transition-all duration-300 glass-panel">
        <Container className="flex h-16 items-center justify-between gap-3">

          {/* Logo (+ optional accessory before it) — goes to the dashboard
              if already signed in, or the login page otherwise, rather than
              always bouncing back to the marketing homepage. */}
          <div className="flex shrink-0 items-center gap-2">
            {leftAccessory}
            <Logo to={isAuthenticated ? '/app' : '/login'} />
          </div>

          {/* Desktop nav — routes to "/" + the section hash rather than a
              plain #anchor, so clicking these from /login, /app/*, etc.
              actually navigates home first instead of just appending a
              hash to whatever page you're already on (Home.jsx scrolls to
              the matching section once it mounts). */}
          <nav className="hidden items-center gap-3 rounded-full border border-primary/30 bg-surface-2/40 px-2 py-1.5 md:flex lg:gap-17 lg:px-3">
            {NAV_LINKS.map((link) => (
              <Link key={link.href} to={`/${link.href}`} className={navLinkClass()}>
                <ScrambleText text={link.label} />
              </Link>
            ))}
          </nav>

          {showActions && (
            <div className="hidden shrink-0 items-center gap-7 md:flex">
              <ThemeToggle />
              {isAuthenticated ? (
                <>
                  <Button as={Link} to="/app" variant="secondary" size="sm">
                    <LayoutGrid size={15} />
                    <ScrambleText text="Dashboard" />
                  </Button>
                  <Button variant="ghost" size="sm" onClick={handleLogout}>
                    <LogOut size={15} />
                    <ScrambleText text="Log out" />
                  </Button>
                </>
              ) : (
                <>
                  <Button as={Link} to="/login" variant="ghost" size="sm">
                    <ScrambleText text="Log in" />
                  </Button>
                  <Button as={Link} to="/signup" variant="primary" size="sm">
                    <ScrambleText text="Get Started" />
                  </Button>
                </>
              )}
            </div>
          )}

          {/* Mobile controls */}
          <div className="flex items-center gap-2 md:hidden">
            {showActions && <ThemeToggle />}
            <button
              type="button"
              onClick={() => setOpen((o) => !o)}
              aria-label="Toggle menu"
              className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-border bg-surface/60 text-text transition-all hover:border-primary/40"
            >
              <AnimatePresence mode="wait" initial={false}>
                {open ? (
                  <motion.span
                    key="close"
                    initial={{ rotate: -90, opacity: 0 }}
                    animate={{ rotate: 0,   opacity: 1 }}
                    exit={{   rotate:  90,  opacity: 0 }}
                    transition={{ duration: 0.18 }}
                  >
                    <X size={18} />
                  </motion.span>
                ) : (
                  <motion.span
                    key="menu"
                    initial={{ rotate: 90,  opacity: 0 }}
                    animate={{ rotate: 0,   opacity: 1 }}
                    exit={{   rotate: -90,  opacity: 0 }}
                    transition={{ duration: 0.18 }}
                  >
                    <Menu size={18} />
                  </motion.span>
                )}
              </AnimatePresence>
            </button>
          </div>
        </Container>
      </div>

      {/* Mobile slide-down menu */}
      <AnimatePresence>
        {open && (
          <motion.div
            key="mobile-menu"
            variants={mobileMenuVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
            style={{ transformOrigin: 'top center' }}
            className="mx-auto mt-1.5 max-w-7xl origin-top rounded-2xl border border-border-strong bg-surface/95 shadow-xl backdrop-blur-2xl md:hidden glass-panel"
          >
            <Container className="flex flex-col gap-2 py-5">
              {NAV_LINKS.map((link, i) => (
                <MotionLink
                  key={link.href}
                  to={`/${link.href}`}
                  onClick={() => setOpen(false)}
                  className={navLinkClass({ mobile: true })}
                  initial={{ opacity: 0, x: -16 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.06 + 0.05, duration: 0.25 }}
                >
                  {link.label}
                </MotionLink>
              ))}
              {showActions && (
                <motion.div
                  className="flex flex-col gap-2 pt-3 border-t border-border"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.28 }}
                >
                  {isAuthenticated ? (
                    <>
                      <Button as={Link} to="/app" variant="outline" size="sm" onClick={() => setOpen(false)}>
                        <LayoutGrid size={15} />
                        Dashboard
                      </Button>
                      <Button variant="primary" size="sm" onClick={handleLogout}>
                        <LogOut size={15} />
                        Log out
                      </Button>
                    </>
                  ) : (
                    <>
                      <Button as={Link} to="/login" variant="outline" size="sm" onClick={() => setOpen(false)}>
                        Log in
                      </Button>
                      <Button as={Link} to="/signup" variant="primary" size="sm" onClick={() => setOpen(false)}>
                        Get Started
                      </Button>
                    </>
                  )}
                </motion.div>
              )}
            </Container>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}

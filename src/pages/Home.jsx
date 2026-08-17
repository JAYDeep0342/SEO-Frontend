import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import Hero from './home/Hero'
import About from './home/About'
import Services from './home/Services'
import LogoMarquee from '../components/common/LogoMarquee'
import ComparisonChart from '../components/home/ComparisonChart'
import TerminalCard from '../components/home/TerminalCard'
import RevealBox from '../components/common/RevealBox'
import Container from '../components/common/Container'

export default function Home() {
  const { hash } = useLocation()

  // Navbar's Home/Services/About links route here as "/#section" (a real
  // route change from /login, /app/*, etc.) rather than a plain #anchor —
  // once this page mounts, scroll to the matching section ourselves, since
  // client-side navigation doesn't trigger the browser's native hash-jump.
  useEffect(() => {
    if (!hash) return
    const el = document.querySelector(hash)
    if (!el) return
    const id = requestAnimationFrame(() => {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' })
    })
    return () => cancelAnimationFrame(id)
  }, [hash])

  return (
    <>
      {/* ── Hero ── */}
      <Hero />

      {/* ── Logo Marquee (right below hero) ── */}
      <div className="hero-aurora-bg relative border-y border-border backdrop-blur-md">
        <LogoMarquee />
      </div>

      {/* ── About ── */}
      <About />

      {/* ── Comparison Chart + Terminal Card ── side-by-side */}
      <section className="py-16 sm:py-24 bg-surface/40">
        <Container>
          <RevealBox direction="fade-up" className="mb-10 text-center">
            <span className="mb-4 inline-flex items-center gap-1.5 rounded-full border border-primary/30 bg-primary/10 px-3.5 py-1 text-xs font-normal tracking-wider text-primary uppercase backdrop-blur-md">
              Performance & CLI
            </span>
            <h2 className="mt-3 font-heading text-3xl font-normal tracking-tight text-text sm:text-4xl">
              Built for speed, built for SEOs
            </h2>
            <p className="mt-4 text-base text-text-muted sm:text-lg leading-relaxed max-w-2xl mx-auto">
              Benchmark results speak for themselves — and the CLI keeps you in control.
            </p>
          </RevealBox>

          <div className="grid gap-8 lg:grid-cols-2">
            <RevealBox direction="fade-left" delay={0.1}>
              <ComparisonChart className="h-full" />
            </RevealBox>
            <RevealBox direction="fade-right" delay={0.18}>
              <TerminalCard className="h-full" />
            </RevealBox>
          </div>
        </Container>
      </section>

      {/* ── Services ── */}
      <Services />
    </>
  )
}

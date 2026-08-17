import Hero from './home/Hero'
import About from './home/About'
import Services from './home/Services'
import LogoMarquee from '../components/common/LogoMarquee'
import ComparisonChart from '../components/home/ComparisonChart'
import TerminalCard from '../components/home/TerminalCard'
import RevealBox from '../components/common/RevealBox'
import Container from '../components/common/Container'

export default function Home() {
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

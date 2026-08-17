import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import { motion } from 'framer-motion'
import Container from '../../components/common/Container'
import Button from '../../components/common/Button'
import ScrambleText from '../../components/common/ScrambleText'
import DashboardAssembly from '../../components/home/DashboardAssembly'
import { useAuth } from '../../context/AuthContext'

const POP_TRANSITION = { duration: 0.7, ease: [0.34, 1.56, 0.64, 1] }

/* ─── Stagger variants for Framer Motion ────────────────────────────────── */
const stagger = {
  hidden:  {},
  visible: { transition: { staggerChildren: 0.12, delayChildren: 0.1 } },
}
const popUp = {
  hidden:  { opacity: 0, y: 20, scale: 1.2 },
  visible: { opacity: 1, y: 0, scale: 1, transition: POP_TRANSITION },
}

/* ═══════════════════════════════════════════════════════════════════════════
   HERO SECTION
═══════════════════════════════════════════════════════════════════════════ */
export default function Hero() {
  const [revealed, setRevealed] = useState(false)
  const { isAuthenticated } = useAuth()

  return (
    <section
      id="home"
      className="relative isolate overflow-hidden"
      style={{ minHeight: '100dvh' }}
    >
      {/* Dashboard-assembly plays as the hero's animated foreground — the ribbon
          backdrop itself now comes from the site-wide PageBackground (rendered
          once in Layout.jsx), so this no longer needs its own background or any
          offset trick to reach behind the navbar; the same backdrop already runs
          behind everything, navbar included. */}
      <DashboardAssembly className="absolute inset-0 -z-10" onFirstComplete={() => setRevealed(true)} />

      <Container
        className="relative z-10 flex min-h-[100dvh] flex-col items-center justify-center text-center"
      >
        <motion.div
          variants={stagger}
          initial="hidden"
          animate={revealed ? 'visible' : 'hidden'}
          className="flex flex-col items-center"
        >
          {/* Headline */}
          <motion.h1
            variants={popUp}
            className="font-heading text-4xl font-normal leading-[1.1] tracking-tight text-text sm:text-5xl lg:text-6xl xl:text-7xl"
          >
            AI Intelligence
            <br />
            Behind Better Rankings
          </motion.h1>

          {/* CTA Buttons */}
          <motion.div variants={popUp} className="mt-7 flex flex-wrap justify-center gap-3">
            <Button
              as={Link}
              to={isAuthenticated ? '/app' : '/login'}
              variant="primary"
              size="lg"
              className="glow-md hover:glow-lg"
            >
              <ScrambleText text="Start Free" />
              <ArrowRight size={18} className="transition-transform duration-300 group-hover:translate-x-1" />
            </Button>
            <Button as="a" href="#services" variant="outline" size="lg">
              <ScrambleText text="Explore Tools" />
            </Button>
          </motion.div>
        </motion.div>
      </Container>
    </section>
  )
}

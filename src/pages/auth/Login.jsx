import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { useAuth } from '../../context/AuthContext'
import Input from '../../components/common/Input'
import Button from '../../components/common/Button'
import ErrorBanner from '../../components/tools/ErrorBanner'

export default function Login() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  const [username, setUsername] = useState(location.state?.prefillUsername ?? '')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!username.trim() || !password) {
      setError({ localMessage: 'Please enter both your username and password.' })
      return
    }
    setError(null)
    setLoading(true)
    try {
      await login({ username: username.trim(), password })
      toast.success('Welcome back!')
      navigate(location.state?.from?.pathname ?? '/app', { replace: true })
    } catch (err) {
      // Backend returns two different shapes for "wrong username" (400, raw
      // Java message) vs "wrong password" (401, "Bad credentials") — neither
      // is user-facing text, so both collapse to one generic message here.
      setError({ localMessage: 'Invalid username or password.', raw: err })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="text-left">
      <h1 className="font-heading text-2xl font-normal text-text">Log in</h1>
      <p className="mt-1.5 text-sm text-text-muted">Welcome back — pick up where you left off.</p>

      <form onSubmit={handleSubmit} className="mt-6 space-y-4">
        <Input
          label="Username"
          type="text"
          autoComplete="username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <Input
          label="Password"
          type="password"
          autoComplete="current-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        {error && <ErrorBanner message={error.localMessage} />}

        <Button type="submit" variant="primary" size="lg" className="w-full" disabled={loading}>
          {loading ? 'Logging in…' : 'Log in'}
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-text-muted">
        Don't have an account?{' '}
        <Link to="/signup" className="text-primary transition-colors hover:text-primary-bright">
          Sign up
        </Link>
      </p>
    </div>
  )
}

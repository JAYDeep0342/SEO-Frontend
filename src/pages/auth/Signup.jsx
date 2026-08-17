import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import * as authApi from '../../api/auth'
import { useAuth } from '../../context/AuthContext'
import Input from '../../components/common/Input'
import Button from '../../components/common/Button'
import ErrorBanner from '../../components/tools/ErrorBanner'
import { getErrorMessage } from '../../utils/errors'

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export default function Signup() {
  const navigate = useNavigate()
  const { login } = useAuth()

  const [form, setForm] = useState({ name: '', email: '', username: '', password: '', confirmPassword: '' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const update = (field) => (e) => setForm((f) => ({ ...f, [field]: e.target.value }))

  const validate = () => {
    if (!form.name.trim() || !form.email.trim() || !form.username.trim() || !form.password) {
      return 'Please fill in every field.'
    }
    if (!EMAIL_RE.test(form.email.trim())) return 'Please enter a valid email address.'
    if (form.password.length < 8) return 'Password must be at least 8 characters.'
    if (form.password !== form.confirmPassword) return "Passwords don't match."
    return null
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const localError = validate()
    if (localError) {
      setError({ localMessage: localError })
      return
    }
    setError(null)
    setLoading(true)
    try {
      const username = form.username.trim()
      await authApi.signup({
        username,
        password: form.password,
        name: form.name.trim(),
        email: form.email.trim(),
      })
      // Signup itself doesn't return a JWT (backend doesn't auto-login) — so
      // chain a real login call with the same credentials the user just
      // typed, rather than bouncing them to a login form to re-type it.
      try {
        await login({ username, password: form.password })
        toast.success('Account created — welcome!')
        navigate('/app', { replace: true })
      } catch {
        // Signup succeeded but the follow-up login failed for some reason —
        // fall back to the login page instead of leaving the user stuck.
        toast.success('Account created — please log in.')
        navigate('/login', { state: { prefillUsername: username } })
      }
    } catch (err) {
      setError({ localMessage: getErrorMessage(err) })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="text-left">
      <h1 className="font-heading text-2xl font-normal text-text">Create your account</h1>
      <p className="mt-1.5 text-sm text-text-muted">Start ranking smarter, free.</p>

      <form onSubmit={handleSubmit} className="mt-6 space-y-4">
        <Input label="Name" type="text" autoComplete="name" value={form.name} onChange={update('name')} />
        <Input label="Email" type="email" autoComplete="email" value={form.email} onChange={update('email')} />
        <Input label="Username" type="text" autoComplete="username" value={form.username} onChange={update('username')} />
        <Input label="Password" type="password" autoComplete="new-password" value={form.password} onChange={update('password')} />
        <Input label="Confirm password" type="password" autoComplete="new-password" value={form.confirmPassword} onChange={update('confirmPassword')} />

        {error && <ErrorBanner message={error.localMessage} />}

        <Button type="submit" variant="primary" size="lg" className="w-full" disabled={loading}>
          {loading ? 'Creating account…' : 'Create account'}
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-text-muted">
        Already have an account?{' '}
        <Link to="/login" className="text-primary transition-colors hover:text-primary-bright">
          Log in
        </Link>
      </p>
    </div>
  )
}

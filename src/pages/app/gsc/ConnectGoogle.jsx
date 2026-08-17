import { useEffect, useRef, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { CheckCircle2, ExternalLink, XCircle } from 'lucide-react'
import * as gscApi from '../../../api/gsc'
import Button from '../../../components/common/Button'
import Card from '../../../components/common/Card'

// The backend's OAuth callback (/api/auth/google/callback) now redirects
// back to this exact page with `?connected=true` or `?connected=false&error=…`
// once Google consent finishes — so this page does double duty: it's both
// the "click to connect" starting point (opened normally) AND the landing
// page the popup itself navigates to after the backend redirect (in which
// case it shows the result and closes itself automatically).
export default function ConnectGoogle() {
  const [searchParams] = useSearchParams()
  const redirectConnected = searchParams.get('connected') // "true" | "false" | null
  const redirectError = searchParams.get('error')
  const isPopup = typeof window !== 'undefined' && !!window.opener

  const [status, setStatus] = useState('idle') // idle | opening | waiting | connected | error
  const [error, setError] = useState(null)
  const [fallbackUrl, setFallbackUrl] = useState(null)
  const pollRef = useRef(null)

  useEffect(() => () => clearInterval(pollRef.current), [])

  // Landed here because the backend just redirected after Google consent —
  // this IS the popup window itself. Show the result briefly, then close so
  // the main window's popup.closed check (below) picks it up.
  useEffect(() => {
    if (redirectConnected === null || !isPopup) return
    const t = setTimeout(() => window.close(), redirectConnected === 'true' ? 1200 : 2500)
    return () => clearTimeout(t)
  }, [redirectConnected, isPopup])

  const handleConnect = async () => {
    setStatus('opening')
    setError(null)
    setFallbackUrl(null)
    try {
      const { url } = await gscApi.getGoogleLoginUrl()
      const popup = window.open(url, 'gsc-oauth', 'width=520,height=650')
      if (!popup) {
        setFallbackUrl(url)
        setStatus('idle')
        return
      }
      setStatus('waiting')
      pollRef.current = setInterval(() => {
        if (popup.closed) {
          clearInterval(pollRef.current)
          setStatus('connected')
        }
      }, 500)
    } catch (err) {
      setError(err)
      setStatus('error')
    }
  }

  // This page just got redirected to by the backend (popup or not) —
  // render the result instead of the normal "click to connect" UI.
  if (redirectConnected !== null) {
    const success = redirectConnected === 'true'
    return (
      <div>
        <h1 className="font-heading text-2xl font-normal text-text sm:text-3xl">Connect Google Search Console</h1>
        <Card hoverGlow={false} className="mt-6 max-w-lg text-center">
          {success ? (
            <>
              <CheckCircle2 size={32} className="mx-auto text-primary" />
              <p className="mt-3 text-text">Google account connected.</p>
              {isPopup ? (
                <p className="mt-1 text-sm text-text-muted">This window will close automatically…</p>
              ) : (
                <Button as={Link} to="/app/gsc" variant="primary" className="mt-4">
                  Continue to Search Console
                </Button>
              )}
            </>
          ) : (
            <>
              <XCircle size={32} className="mx-auto text-red-500" />
              <p className="mt-3 text-text">Couldn't connect Google.</p>
              {redirectError && <p className="mt-1 text-sm text-text-muted">{redirectError}</p>}
              {isPopup ? (
                <p className="mt-3 text-sm text-text-muted">This window will close automatically…</p>
              ) : (
                <Button as={Link} to="/app/gsc/connect" variant="primary" className="mt-4">
                  Try again
                </Button>
              )}
            </>
          )}
        </Card>
      </div>
    )
  }

  return (
    <div>
      <h1 className="font-heading text-2xl font-normal text-text sm:text-3xl">Connect Google Search Console</h1>
      <p className="mt-1.5 max-w-lg text-text-muted">
        Connect your Google account to pull live clicks, impressions, and ranking data straight from Search Console.
      </p>

      <Card hoverGlow={false} className="mt-6 max-w-lg">
        {status === 'connected' ? (
          <div className="text-center">
            <p className="text-text">Google account connected.</p>
            <Button as={Link} to="/app/gsc" variant="primary" className="mt-4">
              Continue to Search Console
            </Button>
          </div>
        ) : (
          <>
            <Button variant="primary" onClick={handleConnect} disabled={status === 'opening' || status === 'waiting'}>
              {status === 'waiting' ? 'Waiting for Google…' : 'Connect Google Search Console'}
            </Button>

            {status === 'waiting' && (
              <p className="mt-3 text-sm text-text-muted">
                Complete the sign-in in the popup window — it'll close automatically when you're done.
              </p>
            )}

            {fallbackUrl && (
              <p className="mt-3 text-sm text-text-muted">
                Your browser blocked the popup —{' '}
                <a href={fallbackUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-primary hover:underline">
                  open it in a new tab <ExternalLink size={12} />
                </a>{' '}
                and come back here once you're done.
              </p>
            )}
          </>
        )}
        {status === 'error' && error && (
          <p className="mt-4 text-sm" style={{ color: 'var(--color-accent-orange)' }}>
            {error.response?.data?.error ?? 'Something went wrong. Please try again.'}
          </p>
        )}
      </Card>
    </div>
  )
}

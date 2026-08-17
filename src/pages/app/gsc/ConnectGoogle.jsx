import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { ExternalLink } from 'lucide-react'
import * as gscApi from '../../../api/gsc'
import Button from '../../../components/common/Button'
import Card from '../../../components/common/Card'
import ErrorBanner from '../../../components/tools/ErrorBanner'

// The backend's OAuth callback (/api/auth/google/callback) returns raw JSON
// today, not a redirect back into the SPA — so the connect flow is handled
// entirely on this side: open the consent URL in a popup and treat the
// popup closing as "done". There's no dedicated "am I connected?" endpoint,
// so this is optimistic — the next real GSC call is the actual source of
// truth, and will re-prompt via the same connect flow if it wasn't.
export default function ConnectGoogle() {
  const [status, setStatus] = useState('idle') // idle | opening | waiting | connected | error
  const [error, setError] = useState(null)
  const [fallbackUrl, setFallbackUrl] = useState(null)
  const pollRef = useRef(null)

  useEffect(() => () => clearInterval(pollRef.current), [])

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
        {error && <div className="mt-4"><ErrorBanner error={error} /></div>}
      </Card>
    </div>
  )
}

export function getErrorMessage(error) {
  return error?.response?.data?.error ?? 'Something went wrong. Please try again.'
}

export function isRetryable503(error) {
  return error?.response?.status === 503
}

export function isAuthFailure(error) {
  return [401, 403].includes(error?.response?.status)
}

export function isGscNotConnected(error) {
  return error?.response?.status === 503 && error?.response?.data?.error === 'Connect Google Search Console first.'
}

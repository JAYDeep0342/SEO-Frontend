import { createContext, useContext, useEffect, useState } from 'react'
import * as authApi from '../api/auth'

const AuthContext = createContext(null)

function getInitialUser() {
  const stored = localStorage.getItem('authUser')
  return stored ? JSON.parse(stored) : null
}

export function AuthProvider({ children }) {
  const [jwt, setJwt] = useState(() => localStorage.getItem('jwt'))
  const [user, setUser] = useState(getInitialUser)

  useEffect(() => {
    if (jwt) localStorage.setItem('jwt', jwt)
    else localStorage.removeItem('jwt')
  }, [jwt])

  useEffect(() => {
    if (user) localStorage.setItem('authUser', JSON.stringify(user))
    else localStorage.removeItem('authUser')
  }, [user])

  const login = async ({ username, password }) => {
    const res = await authApi.login({ username, password })
    setJwt(res.jwt)
    setUser({ userId: res.userId, username, roles: res.roles })
    return res
  }

  const logout = () => {
    setJwt(null)
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ jwt, user, login, logout, isAuthenticated: !!jwt }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within an AuthProvider')
  return ctx
}

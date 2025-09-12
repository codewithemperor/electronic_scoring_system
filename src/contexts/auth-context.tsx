'use client'

import React, { createContext, useContext, useEffect, useState } from 'react'
import { UserRole } from '@prisma/client'

interface User {
  id: string
  email: string
  firstName: string
  lastName: string
  role: UserRole
  status?: string
  profile?: any
  lastLogin?: Date
}

interface AuthContextType {
  user: User | null
  token: string | null
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string; user?: User }>
  loginSuperAdmin: (email: string, password: string) => Promise<{ success: boolean; error?: string; user?: User }>
  loginAdmin: (email: string, password: string) => Promise<{ success: boolean; error?: string; user?: User }>
  loginStaff: (email: string, password: string) => Promise<{ success: boolean; error?: string; user?: User }>
  loginCandidate: (email: string, password: string) => Promise<{ success: boolean; error?: string; user?: User }>
  register: (userData: any) => Promise<{ success: boolean; error?: string; user?: User }>
  logout: () => void
  isLoading: boolean
  isAuthenticated: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [token, setToken] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Check for existing token on mount
    const savedToken = localStorage.getItem('auth-token')
    if (savedToken) {
      setToken(savedToken)
      // Verify token and get user info
      verifyTokenAndSetUser(savedToken)
    } else {
      setIsLoading(false)
    }
  }, [])

  const verifyTokenAndSetUser = async (token: string) => {
    try {
      const response = await fetch('/api/auth/verify', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (response.ok) {
        const data = await response.json()
        setUser(data.user)
      } else {
        // Token is invalid, clear it
        localStorage.removeItem('auth-token')
        setToken(null)
      }
    } catch (error) {
      console.error('Token verification error:', error)
      localStorage.removeItem('auth-token')
      setToken(null)
    } finally {
      setIsLoading(false)
    }
  }

  const login = async (email: string, password: string) => {
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
      })

      const data = await response.json()

      if (response.ok) {
        setUser(data.user)
        setToken(data.token)
        localStorage.setItem('auth-token', data.token)
        
        // Set token as cookie for middleware
        document.cookie = `auth-token=${data.token}; path=/; max-age=86400; secure; samesite=strict`
        
        return { success: true, user: data.user }
      } else {
        return { success: false, error: data.error }
      }
    } catch (error) {
      console.error('Login error:', error)
      return { success: false, error: 'Network error' }
    }
  }

  const loginSuperAdmin = async (email: string, password: string) => {
    try {
      const response = await fetch('/api/auth/login/super-admin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
      })

      const data = await response.json()

      if (response.ok) {
        setUser(data.user)
        setToken(data.token)
        localStorage.setItem('auth-token', data.token)
        
        // Set token as cookie for middleware
        document.cookie = `auth-token=${data.token}; path=/; max-age=86400; secure; samesite=strict`
        
        return { success: true, user: data.user }
      } else {
        return { success: false, error: data.error }
      }
    } catch (error) {
      console.error('Super Admin login error:', error)
      return { success: false, error: 'Network error' }
    }
  }

  const loginAdmin = async (email: string, password: string) => {
    try {
      const response = await fetch('/api/auth/login/admin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
      })

      const data = await response.json()

      if (response.ok) {
        setUser(data.user)
        setToken(data.token)
        localStorage.setItem('auth-token', data.token)
        
        // Set token as cookie for middleware
        document.cookie = `auth-token=${data.token}; path=/; max-age=86400; secure; samesite=strict`
        
        return { success: true, user: data.user }
      } else {
        return { success: false, error: data.error }
      }
    } catch (error) {
      console.error('Admin login error:', error)
      return { success: false, error: 'Network error' }
    }
  }

  const loginStaff = async (email: string, password: string) => {
    try {
      const response = await fetch('/api/auth/login/staff', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
      })

      const data = await response.json()

      if (response.ok) {
        setUser(data.user)
        setToken(data.token)
        localStorage.setItem('auth-token', data.token)
        
        // Set token as cookie for middleware
        document.cookie = `auth-token=${data.token}; path=/; max-age=86400; secure; samesite=strict`
        
        return { success: true, user: data.user }
      } else {
        return { success: false, error: data.error }
      }
    } catch (error) {
      console.error('Staff login error:', error)
      return { success: false, error: 'Network error' }
    }
  }

  const loginCandidate = async (email: string, password: string) => {
    try {
      const response = await fetch('/api/auth/login/candidate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
      })

      const data = await response.json()

      if (response.ok) {
        setUser(data.user)
        setToken(data.token)
        localStorage.setItem('auth-token', data.token)
        
        // Set token as cookie for middleware
        document.cookie = `auth-token=${data.token}; path=/; max-age=86400; secure; samesite=strict`
        
        return { success: true, user: data.user }
      } else {
        return { success: false, error: data.error }
      }
    } catch (error) {
      console.error('Candidate login error:', error)
      return { success: false, error: 'Network error' }
    }
  }

  const register = async (userData: any) => {
    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(userData)
      })

      const data = await response.json()

      if (response.ok) {
        setUser(data.user)
        setToken(data.token)
        localStorage.setItem('auth-token', data.token)
        
        // Set token as cookie for middleware
        document.cookie = `auth-token=${data.token}; path=/; max-age=86400; secure; samesite=strict`
        
        return { success: true, user: data.user }
      } else {
        return { success: false, error: data.error }
      }
    } catch (error) {
      console.error('Registration error:', error)
      return { success: false, error: 'Network error' }
    }
  }

  const logout = async () => {
    try {
      if (token) {
        await fetch('/api/auth/logout', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        })
      }
    } catch (error) {
      console.error('Logout error:', error)
    } finally {
      setUser(null)
      setToken(null)
      localStorage.removeItem('auth-token')
      
      // Clear the cookie
      document.cookie = 'auth-token=; path=/; max-age=0; secure; samesite=strict'
    }
  }

  const value: AuthContextType = {
    user,
    token,
    login,
    loginSuperAdmin,
    loginAdmin,
    loginStaff,
    loginCandidate,
    register,
    logout,
    isLoading,
    isAuthenticated: !!user && !!token
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
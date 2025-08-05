import React, { createContext, useState, useEffect, useMemo } from 'react'

const defaultAuthContext = {
  isAuthenticated: false,
  user: null,
  loading: true,
  login: () => {},
  logout: () => {},
  initialize: () => {}
}

export const AuthContext = createContext(defaultAuthContext)

export const AuthProvider = ({ children }) => {
  const [state, setState] = useState({
    isAuthenticated: false,
    user: null,
    loading: true
  })

  const initialize = async () => {
    try {
      const user = localStorage.getItem('user')
      const token = localStorage.getItem('access')
      
      if (user && token) {
        setState({
          isAuthenticated: true,
          user: JSON.parse(user),
          loading: false
        })
      } else {
        setState(prev => ({ ...prev, loading: false }))
      }
    } catch (error) {
      console.error('Auth initialization error:', error)
      setState({
        isAuthenticated: false,
        user: null,
        loading: false
      })
    }
  }

  const login = (userData, accessToken, refreshToken) => {
    const user = {
      ...userData,
      username: userData.username || userData.email?.split('@')[0] || 'User'
    }
    
    localStorage.setItem('user', JSON.stringify(user))
    localStorage.setItem('access', accessToken)
    localStorage.setItem('refresh', refreshToken)
    
    setState({
      isAuthenticated: true,
      user,
      loading: false
    })
  }

  const logout = () => {
    localStorage.removeItem('user')
    localStorage.removeItem('access')
    localStorage.removeItem('refresh')
    setState({
      isAuthenticated: false,
      user: null,
      loading: false
    })
  }

  useEffect(() => {
    initialize()
  }, [])

  const value = useMemo(() => ({
    ...state,
    login,
    logout,
    initialize
  }), [state])

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}
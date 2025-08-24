import { createContext, useContext, useState, useEffect } from 'react'
import { apiService } from '../services/api'

const AuthContext = createContext()

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const checkSession = async () => {
      try {
        console.log('Checking admin session...')
        
        // Check if we have a token in localStorage
        const token = localStorage.getItem('admin_token')
        const userData = localStorage.getItem('admin_user')
        
        if (token && userData) {
          console.log('Found stored admin session')
          try {
            const parsedUser = JSON.parse(userData)
            setUser(parsedUser)
            
            // Optionally verify token with backend
            // This could be added here for additional security
          } catch (parseError) {
            console.error('Error parsing stored user data:', parseError)
            // Clear invalid session
            localStorage.removeItem('admin_token')
            localStorage.removeItem('admin_user')
            setError('Invalid session data')
          }
        } else {
          console.log('No stored admin session found')
        }
      } catch (error) {
        console.error('Error checking session:', error)
        setError('Session check failed')
        // Clear invalid session
        localStorage.removeItem('admin_token')
        localStorage.removeItem('admin_user')
      } finally {
        setLoading(false)
      }
    }

    checkSession()
  }, [])

  const login = async (email, password) => {
    try {
      console.log('Attempting admin login for:', email)
      setError(null)
      
      const response = await apiService.loginAdmin(email, password)
      
      if (response.success) {
        console.log('Admin login successful')
        // Store token and user data
        localStorage.setItem('admin_token', response.token)
        localStorage.setItem('admin_user', JSON.stringify(response.user))
        setUser(response.user)
        return response
      } else {
        throw new Error(response.message || 'Login failed')
      }
    } catch (error) {
      console.error('Login error:', error)
      const errorMessage = error.response?.data?.message || error.message || 'Login failed'
      setError(errorMessage)
      throw new Error(errorMessage)
    }
  }

  const logout = async () => {
    try {
      console.log('Logging out admin user')
      // Clear local storage
      localStorage.removeItem('admin_token')
      localStorage.removeItem('admin_user')
      setUser(null)
      setError(null)
    } catch (error) {
      console.error('Logout error:', error)
      // Force logout even if there's an error
      localStorage.removeItem('admin_token')
      localStorage.removeItem('admin_user')
      setUser(null)
      setError(null)
    }
  }

  const clearError = () => {
    setError(null)
  }

  const value = {
    user,
    login,
    logout,
    loading,
    error,
    clearError
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

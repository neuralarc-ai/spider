import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { getSupabaseClient } from '@/lib/supabase'

const AuthCallback = () => {
  const navigate = useNavigate()
  const supabase = getSupabaseClient()

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        // Get the URL hash
        const hashParams = window.location.hash.substring(1)
        const searchParams = new URLSearchParams(hashParams)
        
        // Check if we have an access token
        const accessToken = searchParams.get('access_token')
        const refreshToken = searchParams.get('refresh_token')
        
        if (!accessToken) {
          console.error('No access token found in URL')
          navigate('/auth/signin?error=no-access-token')
          return
        }

        // Set the session using the tokens
        const { data: { session }, error } = await supabase.auth.setSession({
          access_token: accessToken,
          refresh_token: refreshToken || ''
        })

        if (error) {
          console.error('Error setting session:', error)
          navigate('/auth/signin?error=auth-callback-failed')
          return
        }

        if (!session) {
          console.error('No session established')
          navigate('/auth/signin?error=no-session')
          return
        }

        // Successful authentication, redirect to spider page
        navigate('/spider')
      } catch (error) {
        console.error('Error during auth callback:', error)
        navigate('/auth/signin?error=auth-callback-failed')
      }
    }

    handleAuthCallback()
  }, [navigate, supabase.auth])

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#1C1C1C]">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto mb-4"></div>
        <p className="text-gray-400">Completing sign in...</p>
      </div>
    </div>
  )
}

export default AuthCallback 
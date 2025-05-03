import { getSupabaseClient } from '@/lib/supabase'
import { useToast } from '@/components/Toast/Toaster'

export const signUp = async (email: string, password: string, fullName: string) => {
    const supabase = getSupabaseClient()
    try {
        console.log('Attempting signup with:', { email, fullName })

        // Proceed with signup
        const { data, error } = await supabase.auth.signUp({
            email,
            password,
            options: {
                data: {
                    full_name: fullName,
                },
                emailRedirectTo: `${window.location.origin}/auth/callback`,
            },
        })

        if (error) {
            console.error('Signup error:', error)
            throw error
        }

        console.log('Signup successful:', data)
        return { data, error: null }
    } catch (error: any) {
        console.error('Signup caught error:', error)
        return {
            data: null,
            error: {
                message: error.message || 'An unexpected error occurred during signup'
            }
        }
    }
}

export const signIn = async (email: string, password: string) => {
    const supabase = getSupabaseClient()
    try {
        console.log('Attempting signin with:', { email })

        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password,
        })

        if (error) {
            console.error('Signin error:', error)
            throw error
        }

        console.log('Signin successful:', data)
        return { data, error: null }
    } catch (error: any) {
        console.error('Signin caught error:', error)
        return {
            data: null,
            error: {
                message: error.message || 'An unexpected error occurred during signin'
            }
        }
    }
}

export const resetPassword = async (email: string) => {
    const supabase = getSupabaseClient()
    try {
        console.log('Attempting password reset for:', { email })

        const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
            redirectTo: `${window.location.origin}/auth/reset-password`,
        })

        if (error) {
            console.error('Password reset error:', error)
            throw error
        }

        console.log('Password reset successful:', data)
        return { data, error: null }
    } catch (error: any) {
        console.error('Password reset caught error:', error)
        return {
            data: null,
            error: {
                message: error.message || 'An unexpected error occurred during password reset'
            }
        }
    }
}

export const updatePassword = async (password: string) => {
    const supabase = getSupabaseClient()
    const { error } = await supabase.auth.updateUser({
        password: password
    })
    return { error }
}

export const signInWithGoogle = async () => {
    const supabase = getSupabaseClient()
    try {
        // Determine if we're in development or production
        const isDevelopment = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
        
        const { data, error } = await supabase.auth.signInWithOAuth({
            provider: 'google',
            options: {
                redirectTo: isDevelopment 
                    ? 'http://localhost:5173/auth/callback'
                    : 'https://spider.neuralarc.ai/auth/callback',
                queryParams: {
                    access_type: 'offline',
                    prompt: 'consent',
                },
                skipBrowserRedirect: false
            }
        })

        if (error) {
            console.error('Google signin error:', error)
            throw error
        }

        console.log('Google signin initiated:', data)
        return { data, error: null }
    } catch (error: any) {
        console.error('Google signin caught error:', error)
        return {
            data: null,
            error: {
                message: error.message || 'An unexpected error occurred during Google sign in'
            }
        }
    }
} 
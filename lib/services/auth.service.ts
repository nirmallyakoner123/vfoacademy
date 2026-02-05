import { supabase } from '../supabase/client';
import type { Database } from '@/types/database';

type Profile = Database['public']['Tables']['profiles']['Row'];
type UserRole = Database['public']['Enums']['user_role'];

export interface SignInCredentials {
    email: string;
    password: string;
}

export interface SignUpData {
    email: string;
    password: string;
    fullName: string;
    role?: UserRole;
    employeeId?: string;
    department?: string;
}

export interface AuthResponse {
    success: boolean;
    user?: Profile;
    error?: string;
}

/**
 * Sign in with email and password
 */
export async function signIn(credentials: SignInCredentials): Promise<AuthResponse> {
    try {
        console.log('🔐 Starting sign in...');
        
        const { data, error } = await supabase.auth.signInWithPassword({
            email: credentials.email,
            password: credentials.password,
        });

        if (error) {
            console.error('❌ Auth error:', error.message);
            return { success: false, error: error.message };
        }

        if (!data.user) {
            console.error('❌ No user data returned');
            return { success: false, error: 'No user data returned' };
        }

        console.log('✅ Auth successful, user ID:', data.user.id);

        // Wait a moment for the session to be properly set
        await new Promise(resolve => setTimeout(resolve, 100));

        // Fetch user profile - retry logic for RLS timing issues
        let profile = null;
        let profileError = null;
        
        for (let attempt = 0; attempt < 3; attempt++) {
            const result = await supabase
                .from('profiles')
                .select('*')
                .eq('id', data.user.id)
                .single();
            
            if (!result.error) {
                profile = result.data;
                break;
            }
            
            profileError = result.error;
            console.log(`⏳ Profile fetch attempt ${attempt + 1} failed:`, result.error.message);
            
            // Wait before retry
            if (attempt < 2) {
                await new Promise(resolve => setTimeout(resolve, 200));
            }
        }

        if (profileError || !profile) {
            console.error('❌ Failed to fetch profile after retries:', profileError?.message);
            // Still return success but without profile - let middleware handle role check
            return { 
                success: true, 
                user: {
                    id: data.user.id,
                    email: data.user.email || credentials.email,
                    full_name: data.user.user_metadata?.full_name || 'User',
                    role: 'learner' as const, // Default role, middleware will verify
                    is_active: true,
                    created_at: new Date().toISOString(),
                    updated_at: new Date().toISOString(),
                } as Profile
            };
        }

        console.log('✅ Profile fetched, role:', profile.role);

        if (!profile.is_active) {
            await supabase.auth.signOut();
            return { success: false, error: 'Account is inactive. Please contact administrator.' };
        }

        return { success: true, user: profile };
    } catch (error) {
        console.error('❌ Unexpected error:', error);
        return { success: false, error: 'An unexpected error occurred' };
    }
}

/**
 * Sign out current user
 */
export async function signOut(): Promise<void> {
    await supabase.auth.signOut();
}

/**
 * Get current user session
 */
export async function getCurrentUser(): Promise<Profile | null> {
    try {
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
            return null;
        }

        const { data: profile } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', user.id)
            .single();

        return profile;
    } catch (error) {
        return null;
    }
}

/**
 * Check if user has admin privileges
 */
export async function isAdmin(userId?: string): Promise<boolean> {
    try {
        const id = userId || (await supabase.auth.getUser()).data.user?.id;

        if (!id) return false;

        const { data } = await supabase
            .from('profiles')
            .select('role')
            .eq('id', id)
            .single();

        return data?.role === 'super_admin' || data?.role === 'admin' || data?.role === 'instructor';
    } catch (error) {
        return false;
    }
}

/**
 * Get user role
 */
export async function getUserRole(userId?: string): Promise<UserRole | null> {
    try {
        const id = userId || (await supabase.auth.getUser()).data.user?.id;

        if (!id) return null;

        const { data } = await supabase
            .from('profiles')
            .select('role')
            .eq('id', id)
            .single();

        return data?.role || null;
    } catch (error) {
        return null;
    }
}

/**
 * Create new employee/learner account (Admin only)
 */
export async function createEmployee(employeeData: SignUpData): Promise<AuthResponse> {
    try {
        // Check if current user is admin
        const isAdminUser = await isAdmin();
        if (!isAdminUser) {
            return { success: false, error: 'Unauthorized. Admin access required.' };
        }

        // Create auth user
        const { data: authData, error: authError } = await supabase.auth.admin.createUser({
            email: employeeData.email,
            password: employeeData.password,
            email_confirm: true, // Auto-confirm email
        });

        if (authError) {
            return { success: false, error: authError.message };
        }

        if (!authData.user) {
            return { success: false, error: 'Failed to create user' };
        }

        // Create profile
        const { data: profile, error: profileError } = await supabase
            .from('profiles')
            .insert({
                id: authData.user.id,
                email: employeeData.email,
                full_name: employeeData.fullName,
                role: employeeData.role || 'learner',
                employee_id: employeeData.employeeId,
                department: employeeData.department,
                is_active: true,
            })
            .select()
            .single();

        if (profileError) {
            // Rollback: delete auth user if profile creation fails
            await supabase.auth.admin.deleteUser(authData.user.id);
            return { success: false, error: 'Failed to create user profile' };
        }

        return { success: true, user: profile };
    } catch (error) {
        return { success: false, error: 'An unexpected error occurred' };
    }
}

/**
 * Update user profile
 */
export async function updateProfile(
    userId: string,
    updates: Partial<Profile>
): Promise<AuthResponse> {
    try {
        const { data, error } = await supabase
            .from('profiles')
            .update(updates)
            .eq('id', userId)
            .select()
            .single();

        if (error) {
            return { success: false, error: error.message };
        }

        return { success: true, user: data };
    } catch (error) {
        return { success: false, error: 'An unexpected error occurred' };
    }
}

/**
 * Reset password
 */
export async function resetPassword(email: string): Promise<{ success: boolean; error?: string }> {
    try {
        const { error } = await supabase.auth.resetPasswordForEmail(email, {
            redirectTo: `${window.location.origin}/reset-password`,
        });

        if (error) {
            return { success: false, error: error.message };
        }

        return { success: true };
    } catch (error) {
        return { success: false, error: 'An unexpected error occurred' };
    }
}

/**
 * Update password
 */
export async function updatePassword(newPassword: string): Promise<{ success: boolean; error?: string }> {
    try {
        const { error } = await supabase.auth.updateUser({
            password: newPassword,
        });

        if (error) {
            return { success: false, error: error.message };
        }

        return { success: true };
    } catch (error) {
        return { success: false, error: 'An unexpected error occurred' };
    }
}

/**
 * Listen to auth state changes
 */
export function onAuthStateChange(callback: (user: Profile | null) => void) {
    return supabase.auth.onAuthStateChange(async (event, session) => {
        if (session?.user) {
            const profile = await getCurrentUser();
            callback(profile);
        } else {
            callback(null);
        }
    });
}

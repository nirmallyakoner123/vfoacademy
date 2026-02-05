'use server';

import { getSupabaseAdmin } from '@/lib/supabase/client';
import { revalidatePath } from 'next/cache';

interface InviteUserParams {
    email: string;
    name: string;
    role: 'admin' | 'learner' | 'instructor';
}

export async function inviteUser(params: InviteUserParams) {
    const supabase = getSupabaseAdmin();

    try {
        // User requested to create user directly without email service for now
        // We set a default password and auto-confirm the email
        const defaultPassword = 'Vfo@123456';

        const { data, error } = await supabase.auth.admin.createUser({
            email: params.email,
            password: defaultPassword,
            email_confirm: true,
            user_metadata: {
                full_name: params.name
            }
        });

        if (error) {
            console.error('Error creating user:', error);
            const errorMessage = error.message.includes('unique')
                ? 'User with this email already exists.'
                : error.message;
            return { success: false, error: errorMessage };
        }

        let retries = 5;
        let profileUpdated = false;

        while (retries > 0 && !profileUpdated) {
            // Check if profile exists
            const { data: profile } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', data.user.id)
                .single();

            if (profile) {
                // Profile exists, update it
                const { error: updateError } = await supabase
                    .from('profiles')
                    .update({
                        role: params.role,
                        full_name: params.name // Ensure name is synced
                    })
                    .eq('id', data.user.id);

                if (!updateError) {
                    profileUpdated = true;
                } else {
                    console.error('Error updating profile:', updateError);
                }
            } else if (retries === 1) {
                // Last retry and profile still missing? Manual insert (Fallback)
                console.warn('Profile trigger delayed/failed. Manual insert.');
                const { error: insertError } = await supabase
                    .from('profiles')
                    .insert({
                        id: data.user.id,
                        email: params.email,
                        full_name: params.name,
                        role: params.role,
                        is_active: true
                    });

                if (!insertError) profileUpdated = true;
                else console.error('Manual profile insert failed:', insertError);
            }

            if (!profileUpdated) {
                await new Promise(resolve => setTimeout(resolve, 1000)); // Wait 1s
                retries--;
            }
        }

        revalidatePath('/admin/users');
        return { success: true, data };
    } catch (error: any) {
        console.error('Unexpected error:', error);
        return { success: false, error: error.message || 'An unexpected error occurred' };
    }
}

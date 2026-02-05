
const { createClient } = require('@supabase/supabase-js');


const supabaseUrl = 'https://emvvohsrpiewmsvjugjm.supabase.co';
const supabaseServiceRoleKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVtdnZvaHNycGlld21zdmp1Z2ptIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MDI3Nzc1MywiZXhwIjoyMDg1ODUzNzUzfQ.BO5OekWpfJXYiUs6158ojFpEOdD8Yg-gmQ61idJEdHI';

if (!supabaseUrl || !supabaseServiceRoleKey) {
    console.error('Missing Supabase environment variables');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceRoleKey, {
    auth: {
        autoRefreshToken: false,
        persistSession: false
    }
});

async function createLearner() {
    const email = 'learner@vfoacademy.com';
    const password = 'Learner@123456';

    console.log(`Creating user ${email}...`);

    const { data, error } = await supabase.auth.admin.createUser({
        email,
        password,
        email_confirm: true,
        user_metadata: {
            full_name: 'Test Learner',
        }
    });

    if (error) {
        console.error('Error creating user:', error.message);
        return;
    }

    console.log('User created:', data.user.id);

    // The trigger should automatically create the profile, but let's verify/update the role
    const { error: updateError } = await supabase
        .from('profiles')
        .update({ role: 'learner' })
        .eq('id', data.user.id);

    if (updateError) {
        console.error('Error updating profile role:', updateError.message);
    } else {
        console.log('Profile role set to learner');
    }
}

createLearner();

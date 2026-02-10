import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version',
};

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { mobile } = await req.json();

    if (!mobile || typeof mobile !== 'string') {
      return new Response(
        JSON.stringify({ error: 'Mobile number is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Use service role to look up email from profiles
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
      { auth: { autoRefreshToken: false, persistSession: false } }
    );

    // Normalize the phone number - strip spaces and dashes
    const normalizedMobile = mobile.replace(/[\s\-()]/g, '');

    const { data: profile, error } = await supabaseAdmin
      .from('profiles')
      .select('user_id')
      .eq('phone', normalizedMobile)
      .eq('is_active', true)
      .single();

    if (error || !profile) {
      // Also try without normalization
      const { data: profile2 } = await supabaseAdmin
        .from('profiles')
        .select('user_id')
        .eq('phone', mobile)
        .eq('is_active', true)
        .single();

      if (!profile2) {
        return new Response(
          JSON.stringify({ error: 'No active account found with this mobile number' }),
          { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      // Get email from auth
      const { data: userData } = await supabaseAdmin.auth.admin.getUserById(profile2.user_id);
      if (!userData?.user?.email) {
        return new Response(
          JSON.stringify({ error: 'Account configuration error' }),
          { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      return new Response(
        JSON.stringify({ email: userData.user.email }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Get email from auth
    const { data: userData } = await supabaseAdmin.auth.admin.getUserById(profile.user_id);
    if (!userData?.user?.email) {
      return new Response(
        JSON.stringify({ error: 'Account configuration error' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    return new Response(
      JSON.stringify({ email: userData.user.email }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Unexpected error:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});

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
    const authHeader = req.headers.get('Authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
    }

    const supabaseClient = createClient(Deno.env.get('SUPABASE_URL')!, Deno.env.get('SUPABASE_ANON_KEY')!, { global: { headers: { Authorization: authHeader } } });
    const token = authHeader.replace('Bearer ', '');
    const { data: claimsData, error: claimsError } = await supabaseClient.auth.getUser(token);
    if (claimsError || !claimsData?.user?.id) {
      return new Response(JSON.stringify({ error: 'Invalid token' }), { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
    }

    const requestingUserId = claimsData.user.id;
    const supabaseAdmin = createClient(Deno.env.get('SUPABASE_URL')!, Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!, { auth: { autoRefreshToken: false, persistSession: false } });

    // Check admin via roles table
    const { data: adminCheck } = await supabaseAdmin.from('user_roles').select('role_id, roles(name)').eq('user_id', requestingUserId);
    const isAdmin = (adminCheck || []).some((r: any) => r.roles?.name === 'Admin');
    if (!isAdmin) {
      return new Response(JSON.stringify({ error: 'Only admins can create users' }), { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
    }

    const body = await req.json();
    if (!body.email || !body.password || !body.full_name || !body.role_id) {
      return new Response(JSON.stringify({ error: 'Missing required fields: email, password, full_name, role_id' }), { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
    }
    if (body.password.length < 8) {
      return new Response(JSON.stringify({ error: 'Password must be at least 8 characters' }), { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
    }

    const { data: newUser, error: createError } = await supabaseAdmin.auth.admin.createUser({
      email: body.email,
      password: body.password,
      email_confirm: true,
      user_metadata: { full_name: body.full_name },
    });
    if (createError || !newUser.user) {
      return new Response(JSON.stringify({ error: createError?.message || 'Failed to create user' }), { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
    }

    const userId = newUser.user.id;

    // Update profile with all fields
    await supabaseAdmin.from('profiles').update({
      full_name: body.full_name,
      phone: body.phone || null,
      employee_code: body.employee_code || null,
      is_active: body.is_active !== false,
      age: body.age || null,
      nationality: body.nationality || null,
      national_id: body.national_id || null,
      national_id_expiry: body.national_id_expiry || null,
      passport_number: body.passport_number || null,
      passport_expiry: body.passport_expiry || null,
      emp_type_id: body.emp_type_id || null,
      default_language: body.default_language || 'en',
      force_password_change: body.force_password_change ?? false,
    }).eq('user_id', userId);

    // Assign role (using role_id)
    const { error: roleError } = await supabaseAdmin.from('user_roles').insert({ user_id: userId, role_id: body.role_id });
    if (roleError) {
      return new Response(JSON.stringify({ error: 'User created but role assignment failed' }), { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
    }

    // Assign branches (array)
    const branchIds = body.branch_ids || (body.branch_id ? [body.branch_id] : []);
    if (branchIds.length > 0) {
      await supabaseAdmin.from('user_branches').insert(branchIds.map((bid: string) => ({ user_id: userId, branch_id: bid })));
    }

    // Log activity
    await supabaseAdmin.from('user_activity_log').insert({
      target_user_id: userId,
      action: 'created',
      performed_by: requestingUserId,
      details: { email: body.email, role_id: body.role_id },
    });

    return new Response(JSON.stringify({ success: true, user_id: userId, message: 'User created successfully' }), { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
  } catch (error) {
    console.error('Unexpected error:', error);
    return new Response(JSON.stringify({ error: 'Internal server error' }), { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
  }
});

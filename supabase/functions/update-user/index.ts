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

    // Check admin
    const { data: adminCheck } = await supabaseAdmin.from('user_roles').select('role_id, roles(name)').eq('user_id', requestingUserId);
    const isAdmin = (adminCheck || []).some((r: any) => r.roles?.name === 'Admin');
    if (!isAdmin) {
      return new Response(JSON.stringify({ error: 'Only admins can update users' }), { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
    }

    const body = await req.json();
    if (!body.user_id) {
      return new Response(JSON.stringify({ error: 'Missing required field: user_id' }), { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
    }

    const targetUserId = body.user_id;

    // Update profile
    const { error: profileError } = await supabaseAdmin.from('profiles').update({
      full_name: body.full_name,
      phone: body.phone || null,
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
      profile_image: body.profile_image || null,
    }).eq('user_id', targetUserId);

    if (profileError) {
      console.error('Profile update error:', profileError);
      return new Response(JSON.stringify({ error: 'Failed to update profile: ' + profileError.message }), { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
    }

    // Sync role
    const { error: deleteRoleError } = await supabaseAdmin.from('user_roles').delete().eq('user_id', targetUserId);
    if (deleteRoleError) {
      console.error('Delete role error:', deleteRoleError);
      return new Response(JSON.stringify({ error: 'Failed to clear roles: ' + deleteRoleError.message }), { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
    }

    if (body.role_id) {
      const { error: insertRoleError } = await supabaseAdmin.from('user_roles').insert({ user_id: targetUserId, role_id: body.role_id });
      if (insertRoleError) {
        console.error('Insert role error:', insertRoleError);
        return new Response(JSON.stringify({ error: 'Failed to assign role: ' + insertRoleError.message }), { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
      }
    }

    // Sync branches
    const { error: deleteBranchError } = await supabaseAdmin.from('user_branches').delete().eq('user_id', targetUserId);
    if (deleteBranchError) {
      console.error('Delete branches error:', deleteBranchError);
      return new Response(JSON.stringify({ error: 'Failed to clear branches: ' + deleteBranchError.message }), { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
    }

    const branchIds = body.branch_ids || [];
    if (branchIds.length > 0) {
      const { error: insertBranchError } = await supabaseAdmin.from('user_branches').insert(
        branchIds.map((bid: string) => ({ user_id: targetUserId, branch_id: bid }))
      );
      if (insertBranchError) {
        console.error('Insert branches error:', insertBranchError);
        return new Response(JSON.stringify({ error: 'Failed to assign branches: ' + insertBranchError.message }), { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
      }
    }

    // Log activity
    await supabaseAdmin.from('user_activity_log').insert({
      target_user_id: targetUserId,
      action: 'updated',
      performed_by: requestingUserId,
      details: { role_id: body.role_id, branch_ids: branchIds },
    });

    return new Response(JSON.stringify({ success: true, message: 'User updated successfully' }), { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
  } catch (error) {
    console.error('Unexpected error:', error);
    return new Response(JSON.stringify({ error: 'Internal server error' }), { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
  }
});

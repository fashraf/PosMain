 import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
 
 const corsHeaders = {
   'Access-Control-Allow-Origin': '*',
   'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version',
 };
 
 interface CreateUserRequest {
   email: string;
   password: string;
   full_name: string;
   role: 'admin' | 'manager' | 'cashier' | 'waiter' | 'kitchen' | 'kiosk';
   phone?: string;
   employee_code?: string;
   branch_id?: string;
   is_active?: boolean;
 }
 
 Deno.serve(async (req) => {
   // Handle CORS preflight
   if (req.method === 'OPTIONS') {
     return new Response('ok', { headers: corsHeaders });
   }
 
   try {
     // Validate auth header
     const authHeader = req.headers.get('Authorization');
     if (!authHeader?.startsWith('Bearer ')) {
       return new Response(
         JSON.stringify({ error: 'Unauthorized' }),
         { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
       );
     }
 
     // Create client to verify the requesting user is admin
     const supabaseClient = createClient(
       Deno.env.get('SUPABASE_URL')!,
       Deno.env.get('SUPABASE_ANON_KEY')!,
       { global: { headers: { Authorization: authHeader } } }
     );
 
     const token = authHeader.replace('Bearer ', '');
     const { data: claimsData, error: claimsError } = await supabaseClient.auth.getClaims(token);
     
     if (claimsError || !claimsData?.claims?.sub) {
       console.error('Auth error:', claimsError);
       return new Response(
         JSON.stringify({ error: 'Invalid token' }),
         { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
       );
     }
 
     const requestingUserId = claimsData.claims.sub;
 
     // Check if requesting user is admin using service role
     const supabaseAdmin = createClient(
       Deno.env.get('SUPABASE_URL')!,
       Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
       { auth: { autoRefreshToken: false, persistSession: false } }
     );
 
     const { data: adminCheck, error: adminCheckError } = await supabaseAdmin
       .from('user_roles')
       .select('role')
       .eq('user_id', requestingUserId)
       .eq('role', 'admin')
       .single();
 
     if (adminCheckError || !adminCheck) {
       console.error('Admin check failed:', adminCheckError);
       return new Response(
         JSON.stringify({ error: 'Only admins can create users' }),
         { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
       );
     }
 
     // Parse request body
     const body: CreateUserRequest = await req.json();
     console.log('Creating user:', body.email, 'with role:', body.role);
 
     // Validate required fields
     if (!body.email || !body.password || !body.full_name || !body.role) {
       return new Response(
         JSON.stringify({ error: 'Missing required fields: email, password, full_name, role' }),
         { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
       );
     }
 
     // Validate password strength
     if (body.password.length < 8) {
       return new Response(
         JSON.stringify({ error: 'Password must be at least 8 characters' }),
         { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
       );
     }
 
     // Create user in auth.users
     const { data: newUser, error: createError } = await supabaseAdmin.auth.admin.createUser({
       email: body.email,
       password: body.password,
       email_confirm: true, // Auto-confirm email
       user_metadata: { full_name: body.full_name }
     });
 
     if (createError || !newUser.user) {
       console.error('User creation error:', createError);
       return new Response(
         JSON.stringify({ error: createError?.message || 'Failed to create user' }),
         { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
       );
     }
 
     const userId = newUser.user.id;
     console.log('User created with ID:', userId);
 
     // Update profile with additional fields
     const { error: profileError } = await supabaseAdmin
       .from('profiles')
       .update({
         full_name: body.full_name,
         phone: body.phone || null,
         employee_code: body.employee_code || null,
         is_active: body.is_active !== false
       })
       .eq('user_id', userId);
 
     if (profileError) {
       console.error('Profile update error:', profileError);
       // Don't fail the request, profile was created by trigger
     }
 
     // Assign role
     const { error: roleError } = await supabaseAdmin
       .from('user_roles')
       .insert({
         user_id: userId,
         role: body.role
       });
 
     if (roleError) {
       console.error('Role assignment error:', roleError);
       return new Response(
         JSON.stringify({ error: 'User created but role assignment failed' }),
         { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
       );
     }
 
     // Assign branch if provided
     if (body.branch_id) {
       const { error: branchError } = await supabaseAdmin
         .from('user_branches')
         .insert({
           user_id: userId,
           branch_id: body.branch_id
         });
 
       if (branchError) {
         console.error('Branch assignment error:', branchError);
       }
     }
 
     // Log activity
     await supabaseAdmin
       .from('user_activity_log')
       .insert({
         target_user_id: userId,
         action: 'created',
         performed_by: requestingUserId,
         details: { email: body.email, role: body.role }
       });
 
     console.log('User creation completed successfully');
 
     return new Response(
       JSON.stringify({ 
         success: true, 
         user_id: userId,
         message: 'User created successfully'
       }),
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
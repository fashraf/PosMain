 import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
 
 const corsHeaders = {
   'Access-Control-Allow-Origin': '*',
   'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version',
 };
 
 interface ResetPasswordRequest {
   user_id: string;
   new_password?: string;
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
       return new Response(
         JSON.stringify({ error: 'Invalid token' }),
         { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
       );
     }
 
     const requestingUserId = claimsData.claims.sub;
 
     // Check if requesting user is admin
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
       return new Response(
         JSON.stringify({ error: 'Only admins can reset passwords' }),
         { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
       );
     }
 
     // Parse request body
     const body: ResetPasswordRequest = await req.json();
 
     if (!body.user_id) {
       return new Response(
         JSON.stringify({ error: 'Missing user_id' }),
         { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
       );
     }
 
     if (body.new_password) {
       // Direct password update
       if (body.new_password.length < 8) {
         return new Response(
           JSON.stringify({ error: 'Password must be at least 8 characters' }),
           { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
         );
       }
 
       const { error: updateError } = await supabaseAdmin.auth.admin.updateUserById(
         body.user_id,
         { password: body.new_password }
       );
 
       if (updateError) {
         console.error('Password update error:', updateError);
         return new Response(
           JSON.stringify({ error: updateError.message }),
           { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
         );
       }
 
       // Log activity
       await supabaseAdmin
         .from('user_activity_log')
         .insert({
           target_user_id: body.user_id,
           action: 'password_reset',
           performed_by: requestingUserId,
           details: { method: 'direct' }
         });
 
       return new Response(
         JSON.stringify({ success: true, message: 'Password updated successfully' }),
         { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
       );
     } else {
       // Get user email for password reset email
       const { data: userData, error: userError } = await supabaseAdmin.auth.admin.getUserById(body.user_id);
 
       if (userError || !userData.user?.email) {
         return new Response(
           JSON.stringify({ error: 'User not found' }),
           { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
         );
       }
 
       // Generate password reset link
       const { data: linkData, error: linkError } = await supabaseAdmin.auth.admin.generateLink({
         type: 'recovery',
         email: userData.user.email
       });
 
       if (linkError) {
         console.error('Reset link error:', linkError);
         return new Response(
           JSON.stringify({ error: 'Failed to generate reset link' }),
           { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
         );
       }
 
       // Log activity
       await supabaseAdmin
         .from('user_activity_log')
         .insert({
           target_user_id: body.user_id,
           action: 'password_reset',
           performed_by: requestingUserId,
           details: { method: 'email_link' }
         });
 
       return new Response(
         JSON.stringify({ 
           success: true, 
           message: 'Password reset link generated',
           reset_link: linkData.properties?.action_link
         }),
         { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
       );
     }
 
   } catch (error) {
     console.error('Unexpected error:', error);
     return new Response(
       JSON.stringify({ error: 'Internal server error' }),
       { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
     );
   }
 });
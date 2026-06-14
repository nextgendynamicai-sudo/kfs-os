import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import webPush from 'https://esm.sh/web-push@3.6.4'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { title, body, image, roles, destinationType, destinationValue } = await req.json()

    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // Build the URL payload
    let url = '/';
    if (destinationType === 'external') url = destinationValue;
    else if (destinationType === 'local') url = `/?login=true&role=core&store=${destinationValue}`;
    else if (destinationType === 'product') url = `/?product=${destinationValue}`;

    const pushPayload = JSON.stringify({
      title,
      body,
      image: image || null,
      url
    })

    // Fetch users based on roles and who have push_subscriptions
    // Assuming you have a 'users' table with 'role' and 'push_subscription' JSONB
    const { data: users, error } = await supabaseClient
      .from('users')
      .select('push_subscription')
      .in('role', roles)
      .not('push_subscription', 'is', null)

    if (error) throw error

    webPush.setVapidDetails(
      'mailto:admin@kfs-os.com',
      Deno.env.get('VAPID_PUBLIC_KEY') ?? '',
      Deno.env.get('VAPID_PRIVATE_KEY') ?? ''
    )

    let successCount = 0;
    let failCount = 0;

    const pushPromises = users.map(async (user: any) => {
      try {
        await webPush.sendNotification(user.push_subscription, pushPayload)
        successCount++;
      } catch (err) {
        console.error("Push failed for a user:", err)
        failCount++;
        // Optional: remove invalid subscription from DB here
      }
    })

    await Promise.all(pushPromises)

    return new Response(
      JSON.stringify({ success: true, successCount, failCount }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
    )
  } catch (error: any) {
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 400,
    })
  }
})

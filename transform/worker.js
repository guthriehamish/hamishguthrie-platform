import { createClient } from '@supabase/supabase-js'

const json=(body,status=200)=>new Response(JSON.stringify(body),{status,headers:{'content-type':'application/json','cache-control':'no-store'}})

export default {
 async fetch(request,env){
  const url=new URL(request.url)
  if(url.pathname!=='/api/admin/temporary-password') return env.ASSETS.fetch(request)
  if(request.method!=='POST') return json({error:'Method not allowed'},405)
  if(!env.SUPABASE_URL||!env.SUPABASE_ANON_KEY||!env.SUPABASE_SERVICE_ROLE_KEY) return json({error:'Server configuration incomplete'},503)
  const auth=request.headers.get('authorization')||''
  if(!auth.startsWith('Bearer ')) return json({error:'Authentication required'},401)
  const token=auth.slice(7)
  const member=createClient(env.SUPABASE_URL,env.SUPABASE_ANON_KEY,{global:{headers:{Authorization:'Bearer '+token}},auth:{persistSession:false}})
  const {data:access,error:accessError}=await member.rpc('transform_access_status')
  const status=Array.isArray(access)?access[0]:access
  if(accessError||!status?.is_admin) return json({error:'Administrator access required'},403)
  let payload
  try{payload=await request.json()}catch{return json({error:'Invalid request'},400)}
  const userId=payload?.userId,password=String(payload?.password||'')
  if(!userId||password.length<8) return json({error:'Temporary password must be at least 8 characters'},400)
  const admin=createClient(env.SUPABASE_URL,env.SUPABASE_SERVICE_ROLE_KEY,{auth:{persistSession:false,autoRefreshToken:false}})
  const {data:target,error:targetError}=await admin.auth.admin.getUserById(userId)
  if(targetError||!target?.user) return json({error:'Participant not found'},404)
  if(target.user.id===status.user_id) return json({error:'Cannot reset your own administrator password here'},400)
  const {error:updateError}=await admin.auth.admin.updateUserById(userId,{password})
  if(updateError) return json({error:'Temporary password could not be set'},500)
  const {error:flagError}=await admin.from('transform_profiles').update({must_change_password:true}).eq('user_id',userId)
  if(flagError) return json({error:'Password changed but required-change flag failed. Resolve before sharing the password.'},500)
  return json({ok:true})
 }
}

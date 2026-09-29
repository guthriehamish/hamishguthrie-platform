import { createClient } from '@supabase/supabase-js'

const json=(body,status=200)=>new Response(JSON.stringify(body),{status,headers:{'content-type':'application/json','cache-control':'no-store'}})

export default {
 async fetch(request,env){
  const url=new URL(request.url)
  if(!url.pathname.startsWith('/api/admin/')) return env.ASSETS.fetch(request)
  if(url.pathname==='/api/admin/temporary-password'&&request.method!=='POST') return json({error:'Method not allowed'},405)
  if(!env.SUPABASE_URL||!env.SUPABASE_SERVICE_ROLE_KEY){const missing=[];if(!env.SUPABASE_URL)missing.push('SUPABASE_URL');if(!env.SUPABASE_SERVICE_ROLE_KEY)missing.push('SUPABASE_SERVICE_ROLE_KEY');return json({error:'Server configuration incomplete',detail:'Missing: '+missing.join(', '),stage:'worker-env'},503)}
  const auth=request.headers.get('authorization')||''
  if(!auth.startsWith('Bearer ')) return json({error:'Authentication required'},401)
  const token=auth.slice(7)
  const member=createClient(env.SUPABASE_URL,env.SUPABASE_SERVICE_ROLE_KEY,{global:{headers:{Authorization:'Bearer '+token}},auth:{persistSession:false,autoRefreshToken:false}})
  const {data:access,error:accessError}=await member.rpc('transform_access_status')
  const status=Array.isArray(access)?access[0]:access
  if(accessError) return json({error:'Admin verification failed',detail:accessError.message,stage:'access-status'},403)
  if(!status?.is_admin) return json({error:'Administrator access required',stage:'access-status'},403)
  let payload
  try{payload=await request.json()}catch{return json({error:'Invalid request'},400)}
  if(url.pathname==='/api/admin/member'&&request.method==='POST'){
    const email=String(payload?.email||'').trim().toLowerCase(),password=String(payload?.password||''),displayName=String(payload?.displayName||'').trim(),temporary=payload?.temporary!==false
    if(!email||!displayName||password.length<8)return json({error:'Name, email and password are required'},400)
    const admin=createClient(env.SUPABASE_URL,env.SUPABASE_SERVICE_ROLE_KEY,{auth:{persistSession:false,autoRefreshToken:false}})
    const created=await admin.auth.admin.createUser({email,password,email_confirm:true,user_metadata:{display_name:displayName}})
    if(created.error)return json({error:'Member could not be created',detail:created.error.message},400)
    await admin.from('transform_profiles').upsert({user_id:created.data.user.id,display_name:displayName,must_change_password:temporary},{onConflict:'user_id'})
    return json({ok:true})
  }
  if(url.pathname==='/api/admin/member'&&request.method==='DELETE'){
    const targetId=String(payload?.userId||'')
    if(!targetId)return json({error:'Member is required'},400)
    if(targetId===status.user_id)return json({error:'Cannot delete your own administrator account'},400)
    const admin=createClient(env.SUPABASE_URL,env.SUPABASE_SERVICE_ROLE_KEY,{auth:{persistSession:false,autoRefreshToken:false}})
    const removed=await admin.auth.admin.deleteUser(targetId)
    if(removed.error)return json({error:'Member could not be deleted',detail:removed.error.message},500)
    return json({ok:true})
  }
  if(url.pathname!=='/api/admin/temporary-password')return json({error:'Not found'},404)
  const userId=payload?.userId,password=String(payload?.password||'')
  if(!userId||password.length<8) return json({error:'Temporary password must be at least 8 characters'},400)
  const admin=createClient(env.SUPABASE_URL,env.SUPABASE_SERVICE_ROLE_KEY,{auth:{persistSession:false,autoRefreshToken:false}})
  const {data:target,error:targetError}=await admin.auth.admin.getUserById(userId)
  if(targetError) return json({error:'Participant lookup failed',detail:targetError.message,stage:'participant-lookup'},500)
  if(!target?.user) return json({error:'Participant not found',stage:'participant-lookup'},404)
  if(target.user.id===status.user_id) return json({error:'Cannot reset your own administrator password here'},400)
  const {error:updateError}=await admin.auth.admin.updateUserById(userId,{password})
  if(updateError) return json({error:'Supabase Auth rejected the password update',detail:updateError.message,stage:'auth-update'},500)
  const {error:flagError}=await member.rpc('transform_admin_require_password_change',{target_user:userId})
  if(flagError) return json({error:'Password changed but required-change flag failed. Resolve before sharing the password.',detail:flagError.message,stage:'profile-flag'},500)
  return json({ok:true})
 }
}

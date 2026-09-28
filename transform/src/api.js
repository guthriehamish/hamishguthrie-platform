import { supabase } from './supabase.js'
import { todayKey } from './store.js'

export async function loadCloudState(userId) {
  // A profile is normally created by the auth trigger. maybeSingle() keeps a
  // brand-new/legacy account from being treated as a cloud failure if that
  // row has not appeared yet, and the client can safely self-heal it under RLS.
  let profile = await supabase.from('transform_profiles').select('*').eq('user_id', userId).maybeSingle()
  if (!profile.error && !profile.data) {
    profile = await supabase.from('transform_profiles')
      .upsert({ user_id:userId }, { onConflict:'user_id', ignoreDuplicates:true })
      .select('*')
      .maybeSingle()
  }

  const [activities, checkin, mates] = await Promise.all([
    supabase.from('transform_activities').select('*').eq('user_id', userId).order('activity_date', { ascending:false }).limit(500),
    supabase.from('transform_daily_checkins').select('*').eq('user_id', userId).eq('checkin_date', todayKey()).maybeSingle(),
    supabase.from('transform_workout_mates').select('*').or(`requester_id.eq.${userId},mate_id.eq.${userId}`)
  ])
  const errors=[
    ['profile',profile.error],
    ['activities',activities.error],
    ['daily check-in',checkin.error],
    ['workout mates',mates.error]
  ].filter(([,error])=>error).map(([source,error])=>({source,error}))
  return { profile:profile.data, activities:activities.data||[], checkin:checkin.data, mates:mates.data||[], errors }
}

export async function saveDirection(userId, direction) {
  return supabase.from('transform_profiles').update({ direction, updated_at:new Date().toISOString() }).eq('user_id',userId)
}

export async function addActivity(userId, activity) {
  return supabase.from('transform_activities').insert({
    user_id:userId, activity_type:activity.type||'activity', workout_number:activity.workoutNumber||null,
    name:activity.name, minutes:activity.minutes, activity_date:activity.date,
    distance_km:activity.distanceKm??null, elevation_gain_m:activity.elevationGain??null,
    laps:activity.laps??null, intensity:activity.intensity??null, route_points:activity.routePoints||null, metadata:activity.metadata||{}
  })
}

export async function updateActivity(userId,id,values) {
  const allowed={}
  if(values.name!==undefined)allowed.name=values.name
  if(values.intensity!==undefined)allowed.intensity=values.intensity
  if(values.notes!==undefined)allowed.notes=values.notes
  if(values.metadata!==undefined)allowed.metadata=values.metadata
  return supabase.from('transform_activities').update(allowed).eq('id',id).eq('user_id',userId).select().single()
}

export async function saveProfileProgress(userId, values) {
  return supabase.from('transform_profiles').update({ ...values, updated_at:new Date().toISOString() }).eq('user_id',userId)
}

export async function saveCheckin(userId, date, values) {
  return supabase.from('transform_daily_checkins').upsert({ user_id:userId, checkin_date:date, ...values, updated_at:new Date().toISOString() })
}

export async function addFood(userId, item) {
  return supabase.from('transform_food_log').insert({
    user_id:userId, eaten_date:item.date, name:item.name, food_group:item.group,
    portion:item.portion, points:item.points
  })
}

export async function saveWeighIn(userId, date, weightKg) {
  return supabase.from('transform_weigh_ins').upsert({
    user_id:userId, weigh_date:date, weight_kg:weightKg
  }, { onConflict:'user_id,weigh_date' })
}

export async function loadWellbeing(userId) {
  const [food, weighIns] = await Promise.all([
    supabase.from('transform_food_log').select('*').eq('user_id',userId).order('eaten_date',{ascending:false}).limit(500),
    supabase.from('transform_weigh_ins').select('*').eq('user_id',userId).order('weigh_date',{ascending:true}).limit(500)
  ])
  const errors=[
    ['food log',food.error],
    ['weigh-ins',weighIns.error]
  ].filter(([,error])=>error).map(([source,error])=>({source,error}))
  return { food:food.data||[], weighIns:weighIns.data||[], errors }

}

export async function loadMemberDirectory() {
  return supabase.rpc('transform_member_directory')
}

export async function requestWorkoutMate(requesterId, mateId) {
  return supabase.from('transform_workout_mates').upsert(
    { requester_id:requesterId, mate_id:mateId, status:'pending', updated_at:new Date().toISOString() },
    { onConflict:'requester_id,mate_id' }
  )
}

export async function updateWorkoutMate(id, status) {
  return supabase.from('transform_workout_mates').update(
    { status, updated_at:new Date().toISOString() }
  ).eq('id',id)
}

export async function loadProgressPhotos(userId) {
  const rows=await supabase.from('transform_progress_photos').select('*').eq('user_id',userId).order('photo_date',{ascending:true})
  if(rows.error)return rows
  const data=await Promise.all((rows.data||[]).map(async row=>{
    const signed=await supabase.storage.from('transform-progress-photos').createSignedUrl(row.storage_path,3600)
    return {...row,url:signed.data?.signedUrl||null}
  }))
  return {data,error:null}
}

export async function addProgressPhoto(userId,file,{kind='progress',date=todayKey(),weightKg=null,note=''}={}) {
  const ext=(file.name?.split('.').pop()||'jpg').toLowerCase().replace(/[^a-z0-9]/g,'')
  const id=crypto.randomUUID?.()||Date.now()+'-'+Math.random().toString(36).slice(2);const path=userId+'/'+id+'.'+(ext||'jpg')
  const uploaded=await supabase.storage.from('transform-progress-photos').upload(path,file,{upsert:false,contentType:file.type})
  if(uploaded.error)return uploaded
  const row=await supabase.from('transform_progress_photos').insert({user_id:userId,photo_date:date,storage_path:path,kind,weight_kg:weightKg||null,note:note||null}).select().single()
  if(row.error){await supabase.storage.from('transform-progress-photos').remove([path]);return row}
  const signed=await supabase.storage.from('transform-progress-photos').createSignedUrl(path,3600)
  return {data:{...row.data,url:signed.data?.signedUrl||null},error:null}
}

export async function deleteProgressPhoto(row) {
  const file=await supabase.storage.from('transform-progress-photos').remove([row.storage_path])
  if(file.error)return file
  return supabase.from('transform_progress_photos').delete().eq('id',row.id).eq('user_id',row.user_id)
}

export async function loadAccessStatus(){return supabase.rpc('transform_access_status')}
export async function loadAdminParticipants(){return supabase.rpc('transform_admin_participants')}
export async function setParticipantBlocked(userId,blocked,reason=''){return supabase.rpc('transform_admin_set_blocked',{target_user:userId,blocked,reason})}

export async function loadCommunity(){
 const [feed,settings,notices]=await Promise.all([
  supabase.rpc('transform_community_feed'),
  supabase.from('transform_community_settings').select('*').eq('id',true).maybeSingle(),
  supabase.from('transform_moderator_notices').select('*').order('created_at',{ascending:false}).limit(20)
 ])
 return {feed:feed.data||[],settings:settings.data||{comments_enabled:true,moderated_posts:false},notices:notices.data||[],errors:[feed.error,settings.error,notices.error].filter(Boolean)}
}
export async function createCommunityPost(body){return supabase.rpc('transform_create_community_post',{post_body:body})}
export async function loadCommunityComments(postIds=[]){if(!postIds.length)return {data:[],error:null};return supabase.rpc('transform_community_comments_for_posts',{post_ids:postIds})}
export async function addCommunityComment(postId,userId,body){return supabase.from('transform_community_comments').insert({post_id:postId,user_id:userId,body:body.trim()})}
export async function updateCommunitySettings(values){return supabase.from('transform_community_settings').update({...values,updated_at:new Date().toISOString()}).eq('id',true)}
export async function moderateCommunityPost(id,values){return supabase.from('transform_community_posts').update({...values,updated_at:new Date().toISOString()}).eq('id',id)}
export async function hideCommunityComment(id,hidden=true){return supabase.from('transform_community_comments').update({is_hidden:hidden}).eq('id',id)}
export async function sendModeratorNotice(userId,message){return supabase.from('transform_moderator_notices').insert({user_id:userId,message:message.trim()})}
export async function markModeratorNoticeRead(id){return supabase.from('transform_moderator_notices').update({read_at:new Date().toISOString()}).eq('id',id)}

export async function sendCommunityAnnouncement(body,allowComments=false){return supabase.rpc('transform_admin_announce',{announcement_body:body,allow_comments:allowComments})}

export async function changeOwnPassword(password){const result=await supabase.auth.updateUser({password});if(result.error)return result;const done=await supabase.rpc('transform_password_change_complete');return done.error?{data:result.data,error:done.error}:result}

export async function setTemporaryPassword(userId,password){const {data}=await supabase.auth.getSession();const token=data.session?.access_token;if(!token)return {error:new Error('Not signed in')};const response=await fetch('/api/admin/temporary-password',{method:'POST',headers:{'content-type':'application/json','authorization':'Bearer '+token},body:JSON.stringify({userId,password})});const body=await response.json().catch(()=>({}));return response.ok?{data:body,error:null}:{data:null,error:new Error(body.error||'Temporary password could not be set')}}

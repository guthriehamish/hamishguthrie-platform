import { supabase } from './supabase.js'

export async function loadCloudState(userId) {
  const [profile, activities, checkin, mates] = await Promise.all([
    supabase.from('transform_profiles').select('*').eq('user_id', userId).single(),
    supabase.from('transform_activities').select('*').eq('user_id', userId).order('activity_date', { ascending:false }).limit(50),
    supabase.from('transform_daily_checkins').select('*').eq('user_id', userId).eq('checkin_date', new Date().toISOString().slice(0,10)).maybeSingle(),
    supabase.from('transform_workout_mates').select('*').or(`requester_id.eq.${userId},mate_id.eq.${userId}`)
  ])
  return { profile:profile.data, activities:activities.data||[], checkin:checkin.data, mates:mates.data||[] }
}

export async function saveDirection(userId, direction) {
  return supabase.from('transform_profiles').update({ direction, updated_at:new Date().toISOString() }).eq('user_id',userId)
}

export async function addActivity(userId, activity) {
  return supabase.from('transform_activities').insert({
    user_id:userId, activity_type:activity.type||'activity', workout_number:activity.workoutNumber||null,
    name:activity.name, minutes:activity.minutes, activity_date:activity.date
  })
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
    supabase.from('transform_food_log').select('*').eq('user_id',userId).order('eaten_date',{ascending:false}).limit(100),
    supabase.from('transform_weigh_ins').select('*').eq('user_id',userId).order('weigh_date',{ascending:true}).limit(100)
  ])
  return { food:food.data||[], weighIns:weighIns.data||[] }
}

const KEY = 'transform-with-me-v1'
let activeUser = null
const storageKey = () => activeUser ? KEY + ':' + activeUser : KEY + ':guest'

const initial = {
  workoutIndex: 0, activeMinutes: 0, activities: [], fuel: {}, hydrationByDate: {},
  direction: '', mate: '', completedWorkouts: [], streak: 0, lastActiveDate: null,
  equipment: [], foodLog: [], weighIns: [], heightCm: null, exerciseOverrides: {}, autoProgress: true
}

export function setStateUser(userId) { activeUser = userId || null }
export function resetState() {
  return { ...initial, activities:[], fuel:{}, hydrationByDate:{}, completedWorkouts:[], equipment:[], foodLog:[], weighIns:[], exerciseOverrides:{} }
}
export function loadState() {
  try {
    const saved = JSON.parse(localStorage.getItem(storageKey()) || '{}')
    const state = { ...resetState(), ...saved }
    if (!state.hydrationByDate) state.hydrationByDate = {}
    return state
  } catch { return resetState() }
}
export function saveState(state) { localStorage.setItem(storageKey(), JSON.stringify(state)) }
export function todayKey(date=new Date()) {
  const y=date.getFullYear(), m=String(date.getMonth()+1).padStart(2,'0'), d=String(date.getDate()).padStart(2,'0')
  return y+'-'+m+'-'+d
}
export function touchStreak(state) {
  const today=todayKey()
  if(state.lastActiveDate===today)return
  const yesterday=new Date(); yesterday.setDate(yesterday.getDate()-1)
  state.streak=state.lastActiveDate===todayKey(yesterday)?state.streak+1:1
  state.lastActiveDate=today
}

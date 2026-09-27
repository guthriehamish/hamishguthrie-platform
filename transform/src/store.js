const KEY = 'transform-with-me-v1'\nlet activeUser = null\nconst storageKey = () => activeUser ? KEY + ':' + activeUser : KEY + ':guest'

const initial = {
  workoutIndex: 0,
  activeMinutes: 0,
  activities: [],
  fuel: {},
  hydration: 0,
  direction: '',
  mate: '',
  completedWorkouts: [],
  streak: 0,
  lastActiveDate: null,
  equipment: [],
  foodLog: [],
  weighIns: [],
  heightCm: null,
  exerciseOverrides: {}
}

export function setStateUser(userId) { activeUser = userId || null }\n\nexport function resetState() { return { ...initial, activities:[], fuel:{}, completedWorkouts:[], equipment:[], foodLog:[], weighIns:[], exerciseOverrides:{} } }\n\nexport function loadState() {
  try { return { ...initial, ...JSON.parse(localStorage.getItem(storageKey()) || '{}') } }
  catch { return resetState() }
}

export function saveState(state) {
  localStorage.setItem(storageKey(), JSON.stringify(state))
}

export function todayKey() {
  return new Date().toISOString().slice(0, 10)
}

export function touchStreak(state) {
  const today = todayKey()
  if (state.lastActiveDate === today) return
  const yesterday = new Date()
  yesterday.setDate(yesterday.getDate() - 1)
  const y = yesterday.toISOString().slice(0, 10)
  state.streak = state.lastActiveDate === y ? state.streak + 1 : 1
  state.lastActiveDate = today
}

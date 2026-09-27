const KEY = 'transform-with-me-v1'

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

export function loadState() {
  try { return { ...initial, ...JSON.parse(localStorage.getItem(KEY) || '{}') } }
  catch { return { ...initial } }
}

export function saveState(state) {
  localStorage.setItem(KEY, JSON.stringify(state))
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

export class WalkTracker {
  constructor(onUpdate) {
    this.onUpdate = onUpdate
    this.watchId = null
    this.startedAt = null
    this.points = []
    this.distanceM = 0
  }
  start() {
    if (!navigator.geolocation) throw new Error('Location tracking is not available on this device.')
    this.startedAt = Date.now()
    this.watchId = navigator.geolocation.watchPosition(
      p => this.addPoint(p),
      e => this.onUpdate({ error: e.message }),
      { enableHighAccuracy: true, maximumAge: 3000, timeout: 15000 }
    )
  }
  stop() {
    if (this.watchId !== null) navigator.geolocation.clearWatch(this.watchId)
    this.watchId = null
    return this.summary()
  }
  addPoint(position) {
    const point = {
      lat: position.coords.latitude,
      lng: position.coords.longitude,
      altitude: position.coords.altitude,
      accuracy: position.coords.accuracy,
      speed: position.coords.speed,
      at: Date.now()
    }
    const previous = this.points.at(-1)
    if (previous && point.accuracy <= 50) this.distanceM += haversine(previous, point)
    this.points.push(point)
    this.onUpdate(this.summary())
  }
  summary() {
    const elapsedSeconds = this.startedAt ? Math.floor((Date.now() - this.startedAt) / 1000) : 0
    const km = this.distanceM / 1000
    const pace = km > .03 ? elapsedSeconds / 60 / km : 0
    const altitudes = this.points.map(p => p.altitude).filter(Number.isFinite)
    let elevationGain = 0
    for (let i=1;i<altitudes.length;i++) if (altitudes[i] > altitudes[i-1]) elevationGain += altitudes[i]-altitudes[i-1]
    return { elapsedSeconds, km, pace, elevationGain, points:this.points }
  }
}
function haversine(a,b) {
  const R=6371000, rad=x=>x*Math.PI/180
  const dLat=rad(b.lat-a.lat), dLng=rad(b.lng-a.lng)
  const q=Math.sin(dLat/2)**2+Math.cos(rad(a.lat))*Math.cos(rad(b.lat))*Math.sin(dLng/2)**2
  return 2*R*Math.asin(Math.sqrt(q))
}
export function formatTime(s){return `${Math.floor(s/60)}:${String(s%60).padStart(2,'0')}`}
export function formatPace(p){if(!p)return '—';const m=Math.floor(p),s=Math.round((p-m)*60);return `${m}:${String(s).padStart(2,'0')}/km`}

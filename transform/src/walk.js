export class ActivityTracker {
  constructor(onUpdate,{mode='walk'}={}){this.onUpdate=onUpdate;this.mode=mode;this.watchId=null;this.startedAt=null;this.points=[];this.distanceM=0;this.paused=false;this.pausedMs=0;this.pauseStarted=null;this.lastPointAt=null;this.visibilityHandler=()=>{if(document.visibilityState==='visible'&&this.watchId!==null&&!this.paused)this.restartWatch()}}
  start(){if(!navigator.geolocation)throw new Error('Location tracking is not available on this device.');this.startedAt=Date.now();document.addEventListener('visibilitychange',this.visibilityHandler);this.restartWatch()}
  restartWatch(){if(this.watchId!==null)navigator.geolocation.clearWatch(this.watchId);this.watchId=navigator.geolocation.watchPosition(p=>this.addPoint(p),e=>this.onUpdate({...this.summary(),error:e.message}),{enableHighAccuracy:true,maximumAge:1000,timeout:12000})}
  pause(){if(this.paused)return;this.paused=true;this.pauseStarted=Date.now()}
  resume(){if(!this.paused)return;this.pausedMs+=Date.now()-this.pauseStarted;this.pauseStarted=null;this.paused=false}
  stop(){if(this.watchId!==null)navigator.geolocation.clearWatch(this.watchId);this.watchId=null;document.removeEventListener('visibilitychange',this.visibilityHandler);if(this.paused)this.resume();return this.summary()}
  addPoint(position){
    if(this.paused)return
    const point={lat:position.coords.latitude,lng:position.coords.longitude,altitude:position.coords.altitude,accuracy:position.coords.accuracy,speed:position.coords.speed,at:Date.now()}
    this.lastPointAt=point.at
    const previous=this.points.at(-1)
    if(previous&&point.accuracy<=50&&previous.accuracy<=50){
      const metres=haversine(previous,point),seconds=Math.max(1,(point.at-previous.at)/1000),kph=metres/seconds*3.6,max={walk:18,run:35,ride:100,hike:15,gps:100}[this.mode]||100
      if(kph<=max&&metres<500)this.distanceM+=metres
    }
    this.points.push(point);this.onUpdate(this.summary())
  }
  summary(){
    const now=this.paused&&this.pauseStarted?this.pauseStarted:Date.now(),elapsedSeconds=this.startedAt?Math.max(0,Math.floor((now-this.startedAt-this.pausedMs)/1000)):0,km=this.distanceM/1000
    const pace=km>.03?elapsedSeconds/60/km:0,alts=this.points.filter(p=>p.accuracy<=35&&Number.isFinite(p.altitude)).map(p=>p.altitude)
    let elevationGain=0;for(let i=1;i<alts.length;i++){const rise=alts[i]-alts[i-1];if(rise>1&&rise<20)elevationGain+=rise}
    const gpsAgeSeconds=this.lastPointAt?Math.floor((Date.now()-this.lastPointAt)/1000):null
    return {mode:this.mode,elapsedSeconds,km,pace,elevationGain,points:this.points,paused:this.paused,gpsAgeSeconds,gpsStale:gpsAgeSeconds!=null&&gpsAgeSeconds>30}
  }
}
export class WalkTracker extends ActivityTracker{constructor(onUpdate){super(onUpdate,{mode:'walk'})}}
function haversine(a,b){const R=6371000,rad=x=>x*Math.PI/180,dLat=rad(b.lat-a.lat),dLng=rad(b.lng-a.lng),q=Math.sin(dLat/2)**2+Math.cos(rad(a.lat))*Math.cos(rad(b.lat))*Math.sin(dLng/2)**2;return 2*R*Math.asin(Math.sqrt(q))}
export function formatTime(s){return `${Math.floor(s/60)}:${String(s%60).padStart(2,'0')}`}
export function formatPace(p){if(!p)return '—';const m=Math.floor(p),s=Math.round((p-m)*60);return `${m}:${String(s).padStart(2,'0')}/km`}

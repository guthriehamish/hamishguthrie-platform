import './style.css'
import { workouts, fuelChoices } from './data.js'
import { loadState, saveState, todayKey, touchStreak } from './store.js'
import { supabase } from './supabase.js'
import { getSession, signIn, signUp, signOut } from './auth.js'

let state=loadState(), view='today', session=null, timer=null
const nav=[['today','Today'],['move','Move'],['fuel','Fuel'],['progress','Progress'],['together','Together'],['direction','My Direction']]

const button=(id,label)=>`<button data-view="${id}">${label}</button>`
function layout(body){return `<header><button class="brand" data-view="today">TRANSFORM <small>WITH ME</small></button><nav>${nav.map(x=>button(...x)).join('')}</nav></header><main>${body}</main><footer>Consistent. Persistent. Targeted.</footer>`}
function head(k,t,p){return `<section class="head"><p class="eyebrow">${k}</p><h1>${t}</h1><p>${p}</p></section>`}
function today(){
 const w=workouts[state.workoutIndex%28], f=Object.values(state.fuel[todayKey()]||{}).filter(Boolean).length
 return head('TODAY','Show up. <span>That counts.</span>','Do what fits today. The aim is consistency, not a perfect scorecard.')+`
 <section class="dashboard"><article class="feature"><div><p class="eyebrow">NEXT WORKOUT · ${w.id}/28</p><h2>${w.title}</h2><p>${w.focus} · ${w.minutes} min</p></div>${button('move','Go to Move →')}</article>
 ${[['Active minutes',state.activeMinutes],['Day streak',state.streak],['Healthy choices',f],['Water',state.hydration]].map(x=>`<article class="stat"><strong>${x[1]}</strong><span>${x[0]}</span></article>`).join('')}</section>`}
function move(){
 const w=workouts[state.workoutIndex%28]
 return head('MOVE','Your next move.','Follow the sequence, replace it with another activity, or add extra movement. It all counts.')+`
 <section class="cols"><article class="feature workout"><div><p class="eyebrow">WORKOUT ${w.id} OF 28 · ${w.level.toUpperCase()}</p><h2>${w.title}</h2><p>${w.focus} · ${w.exercises.length} exercises · ${w.rounds} rounds</p><strong>~${w.minutes} minutes</strong></div><button id="start-workout">Start workout →</button></article>
 <article class="form"><h3>Log another activity</h3><label>Activity<input id="activity" placeholder="Walk, swim, sport…"></label><label>Active minutes<input id="minutes" type="number" min="1" placeholder="30"></label><button id="log">Add activity</button><p class="hint">Your next workout stays waiting for you.</p></article></section>
 <section class="exercise-preview"><h3>Inside this workout</h3><div>${w.exercises.map((e,i)=>`<span><b>${i+1}</b>${e.name}</span>`).join('')}</div></section><section class="history"><h3>Recent movement</h3>${state.activities.length?state.activities.slice(-5).reverse().map(a=>`<div><span>${a.name}</span><strong>${a.minutes} min</strong></div>`).join(''):'<p>Nothing logged yet.</p>'}</section>`}
function buildIntervals(w){const steps=[];for(let r=1;r<=w.rounds;r++){w.exercises.forEach((e,i)=>{steps.push({kind:'work',name:e.name,note:e.note,seconds:w.workSeconds,round:r});if(!(r===w.rounds&&i===w.exercises.length-1))steps.push({kind:'rest',name:'Recover',note:'Next: '+(w.exercises[(i+1)%w.exercises.length]?.name||''),seconds:w.restSeconds,round:r})})}return steps}
function timerView(){const w=workouts[state.workoutIndex%28],s=timer.steps[timer.index],pct=Math.round((timer.index/timer.steps.length)*100);return `<section class="timer-screen"><p class="eyebrow">WORKOUT ${w.id} · ROUND ${s.round} OF ${w.rounds}</p><div class="timer-progress"><i style="width:${pct}%"></i></div><p class="timer-kind">${s.kind==='rest'?'RECOVER':'MOVE'}</p><h1>${s.name}</h1><div class="countdown">${Math.floor(timer.left/60)}:${String(timer.left%60).padStart(2,'0')}</div><p class="timer-note">${s.note}</p><div class="timer-actions"><button id="prev-step">← Previous</button><button id="toggle-timer">${timer.running?'Pause':'Start'}</button><button id="next-step">Skip →</button></div><button class="quit" id="quit-workout">Exit workout</button></section>`}
function startTimer(w){timer={steps:buildIntervals(w),index:0,left:w.workSeconds,running:false,tick:null};view='timer';render()}
function advanceTimer(delta=1){timer.index+=delta;if(timer.index<0)timer.index=0;if(timer.index>=timer.steps.length){finishWorkout();return}timer.left=timer.steps[timer.index].seconds;render()}
function runTimer(){timer.running=!timer.running;if(timer.running){timer.tick=setInterval(()=>{timer.left--;const el=document.querySelector('.countdown');if(el)el.textContent=Math.floor(timer.left/60)+':'+String(timer.left%60).padStart(2,'0');if(timer.left<=0){clearInterval(timer.tick);timer.running=false;advanceTimer()}},1000)}else clearInterval(timer.tick);render()}
function finishWorkout(){const w=workouts[state.workoutIndex%28];if(timer?.tick)clearInterval(timer.tick);timer=null;state.completedWorkouts.push({id:w.id,date:todayKey()});state.activities.push({name:w.title,minutes:w.minutes,date:todayKey()});state.activeMinutes+=w.minutes;state.workoutIndex=(state.workoutIndex+1)%28;touchStreak(state);view='move';commit()}
function fuel(){
 const d=state.fuel[todayKey()]||{}
 return head('FUEL','Choose healthier.','No calorie counting. No judgement. Just notice the choices that move you forward.')+`<section class="choices">${fuelChoices.map(([id,label])=>`<button class="choice ${d[id]?'done':''}" data-fuel="${id}"><strong>${d[id]?'✓':'○'}</strong>${label}</button>`).join('')}<button class="choice water" id="water"><strong>+${state.hydration}</strong>Log a drink of water</button></section>`}
function progress(){
 const n=state.completedWorkouts.length,p=Math.round(n/28*100)
 return head('PROGRESS','Momentum, visible.','Celebrate what you actually did.')+`<section class="progress"><div class="ring" style="--p:${p}"><strong>${p}%</strong></div><div><h2>${n} workouts completed</h2><p>${state.activeMinutes} active minutes · ${state.streak} day streak</p></div></section><section class="badges">${[['First Move',n>=1],['100 Minutes',state.activeMinutes>=100],['Consistent 7',state.streak>=7],['28 Strong',n>=28]].map(([x,e])=>`<article class="${e?'earned':''}"><strong>${x}</strong><span>${e?'Earned':'Still ahead'}</span></article>`).join('')}</section>`}
function together(){return head('TOGETHER','Better with a mate.','Choose someone in the programme as your workout mate. Your own workout sequence still carries over.')+`<section class="form narrow"><label>Workout mate<input id="mate" value="${state.mate}" placeholder="Choose a member"></label><button id="save-mate">Connect workout mate</button>${state.mate?`<p class="success">Connected with <strong>${state.mate}</strong>.</p>`:''}</section>`}
function direction(){return head('MY DIRECTION','What are you moving toward?','Private to you. Keep it simple and meaningful.')+`<section class="form narrow"><label>My direction<textarea id="direction" rows="5" placeholder="What would transformation look like for me?">${state.direction}</textarea></label><button id="save-direction">Save my direction</button></section>`}
function authView(){return `<section class="head"><p class="eyebrow">TRANSFORM WITH ME</p><h1>Start where you are.</h1><p>Sign in to keep your transformation progress with you.</p></section><section class="form narrow"><label>Display name<input id="display-name" placeholder="Your name"></label><label>Email<input id="email" type="email" autocomplete="email"></label><label>Password<input id="password" type="password" autocomplete="current-password"></label><div class="auth-actions"><button id="sign-in">Sign in</button><button id="sign-up" class="secondary">Create account</button></div><p id="auth-message" class="hint"></p></section>`}
function render(){if(supabase&&!session){document.querySelector('#app').innerHTML=layout(authView());bindAuth();return}if(view==='timer'&&timer){document.querySelector('#app').innerHTML=layout(timerView());bindTimer();return}const views={today,move,fuel,progress,together,direction};document.querySelector('#app').innerHTML=layout(views[view]());bind()}
function commit(){saveState(state);render()}
function bindAuth(){
 const email=()=>document.querySelector('#email').value.trim(), pass=()=>document.querySelector('#password').value, name=()=>document.querySelector('#display-name').value.trim(), msg=document.querySelector('#auth-message')
 document.querySelector('#sign-in').onclick=async()=>{const {data,error}=await signIn(email(),pass());if(error){msg.textContent=error.message;return}session=data.session;render()}
 document.querySelector('#sign-up').onclick=async()=>{if(!name()){msg.textContent='Add your display name first.';return}const {data,error}=await signUp(email(),pass(),name());if(error){msg.textContent=error.message;return}session=data.session;msg.textContent=session?'Account created.':'Check your email to confirm your account.';render()}
}
function bindTimer(){document.querySelector('#toggle-timer').onclick=runTimer;document.querySelector('#next-step').onclick=()=>{if(timer.tick)clearInterval(timer.tick);timer.running=false;advanceTimer()};document.querySelector('#prev-step').onclick=()=>{if(timer.tick)clearInterval(timer.tick);timer.running=false;advanceTimer(-1)};document.querySelector('#quit-workout').onclick=()=>{if(timer.tick)clearInterval(timer.tick);timer=null;view='move';render()}}
function bind(){
 document.querySelectorAll('[data-view]').forEach(b=>b.onclick=()=>{view=b.dataset.view;render();scrollTo(0,0)})
 document.querySelector('#start-workout')?.addEventListener('click',()=>startTimer(workouts[state.workoutIndex%28]))
 document.querySelector('#log')?.addEventListener('click',()=>{const name=document.querySelector('#activity').value.trim(),minutes=+document.querySelector('#minutes').value;if(!name||minutes<1)return;state.activities.push({name,minutes,date:todayKey()});state.activeMinutes+=minutes;touchStreak(state);commit()})
 document.querySelectorAll('[data-fuel]').forEach(b=>b.onclick=()=>{const d=todayKey();state.fuel[d]??={};state.fuel[d][b.dataset.fuel]=!state.fuel[d][b.dataset.fuel];touchStreak(state);commit()})
 document.querySelector('#water')?.addEventListener('click',()=>{state.hydration++;touchStreak(state);commit()})
 document.querySelector('#save-mate')?.addEventListener('click',()=>{state.mate=document.querySelector('#mate').value.trim();commit()})
 document.querySelector('#save-direction')?.addEventListener('click',()=>{state.direction=document.querySelector('#direction').value.trim();commit()})
}
async function start(){session=await getSession();if(supabase){supabase.auth.onAuthStateChange((_event,s)=>{session=s;render()})}render()}
start()

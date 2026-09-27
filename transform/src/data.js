const templates = [
 ['Foundation','Full body',20,'Start here',['cardio','legs','push','core','legs','core']],
 ['Engine','Cardio + core',22,'Build',['cardio','core','cardio','core','cardio','core']],
 ['Strength','Upper + lower',24,'Build',['legs','push','legs','push','legs','core']],
 ['Mobility','Movement + recovery',18,'Reset',['mobility','mobility','core','mobility','legs','mobility']],
 ['Challenge','Full body',26,'Push',['legs','cardio','push','legs','cardio','core']],
 ['Core','Core + stability',20,'Build',['core','core','legs','core','core','core']],
 ['Recovery','Easy movement',15,'Reset',['cardio','mobility','mobility','mobility','legs','mobility']]
]
const fixed = {
 mobility:['Shoulder rolls','Cat-cow','Worlds greatest stretch','Hip opener','Hamstring sweep','Thoracic rotation']
}
export const workouts = Array.from({length:28},(_,i)=>{
 const [base,focus,baseMinutes,level,slots]=templates[i%7], phase=Math.floor(i/7)
 return {
  id:i+1,title:phase?`${base} ${['','+','II','III'][phase]}`:base,focus,level,
  minutes:baseMinutes+phase*2,rounds:phase===0?2:3,
  workSeconds:phase===0?30:phase===1?35:phase===2?40:45,
  restSeconds:phase<2?20:15,
  slots:slots.map((category,n)=>({category,fallback:category==='mobility'?fixed.mobility[n%fixed.mobility.length]:null}))
 }
})
export const fuelChoices=[['healthy-meal','I chose a healthier meal'],['snack','I avoided the snacks'],['drink','I chose healthier drinks'],['fruit-veg','I added fruit or vegetables']]

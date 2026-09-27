const templates = [
 ['Foundation','Full body',20,'Start here',['cardio','legs','push','pull','hinge','core']],
 ['Engine','Cardio + core',22,'Build',['cardio','core','cardio','hinge','cardio','core']],
 ['Strength','Upper + lower',24,'Build',['legs','push','pull','hinge','legs','core']],
 ['Mobility','Movement + recovery',18,'Reset',['mobility','balance','core','mobility','legs','mobility']],
 ['Challenge','Full body',26,'Push',['legs','cardio','push','pull','hinge','core']],
 ['Core','Core + stability',20,'Build',['core','balance','hinge','core','legs','core']],
 ['Recovery','Easy movement',15,'Reset',['cardio','mobility','balance','mobility','hinge','mobility']]
]
export const workouts = Array.from({length:28},(_,i)=>{
 const [base,focus,baseMinutes,level,slots]=templates[i%7], phase=Math.floor(i/7)
 return {
  id:i+1,title:phase?`${base} ${['','+','II','III'][phase]}`:base,focus,level,
  minutes:baseMinutes+phase*2,rounds:phase===0?2:3,
  workSeconds:phase===0?30:phase===1?35:phase===2?40:45,
  restSeconds:phase<2?20:15,
  slots:slots.map(category=>({category}))
 }
})
export const fuelChoices=[['healthy-meal','I chose a healthier meal'],['snack','I avoided the snacks'],['drink','I chose healthier drinks'],['fruit-veg','I added fruit or vegetables']]

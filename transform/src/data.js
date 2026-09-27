const plans = [
  ['Foundation','Full body',20,'Start here',['March in place','Bodyweight squat','Wall push-up','Standing knee drive','Glute bridge','Bird dog']],
  ['Engine','Cardio + core',22,'Build',['Fast march','Step jacks','Mountain climber - elevated','Dead bug','High knees - low impact','Plank shoulder tap']],
  ['Strength','Upper + lower',24,'Build',['Squat','Incline push-up','Reverse lunge','Hip hinge','Chair tricep press','Glute bridge']],
  ['Mobility','Movement + recovery',18,'Reset',['Shoulder rolls','Cat-cow','Worlds greatest stretch','Hip opener','Hamstring sweep','Thoracic rotation']],
  ['Challenge','Full body',26,'Push',['Squat to reach','Step jack','Incline push-up','Alternating lunge','Mountain climber - elevated','Plank']],
  ['Core','Core + stability',20,'Build',['Dead bug','Bird dog','Glute bridge','Standing knee drive','Side plank - knees','Plank']],
  ['Recovery','Easy movement',15,'Reset',['Easy march','Shoulder rolls','Hip circles','Hamstring sweep','Calf raise','Full body stretch']]
]
export const workouts = Array.from({length:28},(_,i)=>{
  const [base,focus,baseMinutes,level,exercises]=plans[i%7]
  const phase=Math.floor(i/7)
  const work=phase===0?30:phase===1?35:phase===2?40:45
  const rest=phase===0?20:phase===1?20:15
  const rounds=phase===0?2:3
  return {
    id:i+1,
    title: phase ? `${base} ${['','+','II','III'][phase]}` : base,
    focus, level,
    minutes: baseMinutes + phase*2,
    rounds,
    workSeconds:work,
    restSeconds:rest,
    exercises: exercises.map((name,n)=>({name, note:n===0?'Find a sustainable rhythm.':'Quality movement first.'}))
  }
})
export const fuelChoices=[
 ['healthy-meal','I chose a healthier meal'],
 ['snack','I avoided the snacks'],
 ['drink','I chose healthier drinks'],
 ['fruit-veg','I added fruit or vegetables']
]

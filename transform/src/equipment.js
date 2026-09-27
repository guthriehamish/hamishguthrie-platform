export const equipmentCatalog=[
 ['mat','Exercise mat'],['dumbbells','Free weights / dumbbells'],['kettlebell','Kettlebell'],['barbell','Barbell / bench press'],
 ['weights-machine','Weights machine'],['bands','Resistance bands'],['rope','Skipping rope'],['bag','Boxing bag'],
 ['treadmill','Treadmill'],['rower','Rowing machine'],['bike','Exercise bike'],['elliptical','Cross-trainer / elliptical'],
 ['bench','Step / bench'],['pool','Swimming pool access']
]
const x=(name,equipment=[],level=1,note='')=>({name,equipment,level,note})
export const exerciseOptions={
 cardio:[
  x('March in place',[],1),x('Fast march',[],1),x('Step jacks',[],1),x('Low-impact high knees',[],2),
  x('Skipping',['rope'],2),x('Fast skipping',['rope'],3),x('Boxing combinations',['bag'],1),x('Boxing power rounds',['bag'],3),
  x('Treadmill brisk effort',['treadmill'],1),x('Treadmill run',['treadmill'],2),x('Treadmill incline effort',['treadmill'],3),
  x('Rowing steady effort',['rower'],1),x('Rowing intervals',['rower'],2),x('Rowing power effort',['rower'],3),
  x('Bike steady effort',['bike'],1),x('Bike intervals',['bike'],2),x('Bike resistance effort',['bike'],3),
  x('Cross-trainer steady effort',['elliptical'],1),x('Cross-trainer intervals',['elliptical'],2),x('Cross-trainer resistance effort',['elliptical'],3)
 ],
 pull:[
  x('Standing reverse fly',[],1,'Open the chest and squeeze the shoulder blades gently.'),x('Prone arm pull',['mat'],1,'Move slowly and keep the neck relaxed.'),
  x('Resistance-band row',['bands'],1,'Pull elbows back without shrugging.'),x('Dumbbell row',['dumbbells'],2,'Brace comfortably and draw the elbow toward the hip.'),
  x('Kettlebell row',['kettlebell'],2,'Keep the movement controlled.'),x('Machine seated row',['weights-machine'],1,'Use a smooth controlled pull.')
 ],
 hinge:[
  x('Hip hinge',[],1,'Push the hips back while keeping the movement comfortable.'),x('Glute bridge',['mat'],1,'Drive through the feet and finish tall through the hips.'),
  x('Kettlebell deadlift',['kettlebell'],1,'Keep the weight close and move smoothly.'),x('Dumbbell Romanian deadlift',['dumbbells'],2,'Hinge at the hips with a controlled range.'),
  x('Machine hamstring curl',['weights-machine'],1,'Use a controlled range without swinging.')
 ],
 mobility:[
  x('Shoulder rolls',[],1,'Move gently through a comfortable range.'),x('Standing hip opener',[],1,'Move slowly and stay balanced.'),
  x('Hamstring sweep',[],1,'Use a comfortable range rather than forcing the stretch.'),x('Thoracic rotation',[],1,'Rotate gently through the upper body.'),
  x('Cat-cow',['mat'],1,'Move slowly between comfortable positions.'),x('Worlds greatest stretch',['mat'],2,'Take your time and keep the range comfortable.')
 ],
 balance:[
  x('Supported single-leg stand',[],1,'Keep support within reach.'),x('Heel-to-toe walk',[],1,'Move slowly and use support if needed.'),
  x('Step and hold',[],2,'Pause briefly after each controlled step.')
 ],
 push:[
  x('Wall push-up',[],1),x('Knee push-up',['mat'],1),x('Incline push-up',['bench'],2),x('Push-up',['mat'],3),
  x('Resistance-band chest press',['bands'],1),x('Dumbbell floor press',['dumbbells','mat'],1),x('Dumbbell press',['dumbbells'],2),
  x('Bench press',['barbell'],2),x('Bench press - controlled',['barbell'],3),x('Machine chest press',['weights-machine'],1)
 ],
 legs:[
  x('Chair squat',[],1),x('Bodyweight squat',[],1),x('Reverse lunge',[],2),x('Squat to calf raise',[],2),
  x('Goblet squat',['kettlebell'],2),x('Kettlebell deadlift',['kettlebell'],1),x('Dumbbell squat',['dumbbells'],2),
  x('Dumbbell Romanian deadlift',['dumbbells'],2),x('Resistance-band squat',['bands'],1),x('Step-up',['bench'],2),
  x('Machine leg press',['weights-machine'],1),x('Machine leg extension',['weights-machine'],2)
 ],
 core:[
  x('Standing knee drive',[],1),x('Standing cross-body knee drive',[],2),x('Dead bug',['mat'],1),x('Bird dog',['mat'],1),
  x('Glute bridge',['mat'],1),x('Plank - knees',['mat'],1),x('Plank',['mat'],2),x('Side plank - knees',['mat'],2),
  x('Dumbbell carry',['dumbbells'],2),x('Kettlebell carry',['kettlebell'],2),x('Resistance-band anti-rotation hold',['bands'],2)
 ]
}
export function availableOptions(category,equipment=[],maxLevel=3){
 const owned=new Set(equipment)
 return (exerciseOptions[category]||[]).filter(o=>o.level<=maxLevel&&o.equipment.every(e=>owned.has(e)))
}
export function chooseExercise(category,equipment=[],seed=0,maxLevel=3){
 const options=availableOptions(category,equipment,maxLevel)
 if(!options.length)return null
 const preferred=options.filter(o=>o.level===maxLevel), pool=preferred.length?preferred:options
 return pool[seed%pool.length]
}
export function levelForWorkout(workoutId){return workoutId<=7?1:workoutId<=14?2:3}


export const exerciseGuides = {
  'Standing reverse fly': {
    summary: 'Open your arms out to the sides while standing to work the upper back and rear shoulders.',
    steps: ['Stand tall with soft knees and brace comfortably.', 'Lean slightly forward from the hips.', 'With soft elbows, open the arms out to the sides.', 'Gently draw the shoulder blades together, then lower with control.'],
    cues: 'Keep the shoulders down and avoid swinging. Use a comfortable range.',
    easier: 'Use a smaller range or stay more upright.'
  },
  'Hip hinge': {
    summary: 'Fold from the hips while keeping a long spine, then use the hips to return to standing.',
    steps: ['Stand with feet about hip-width apart and knees softly bent.', 'Send your hips backward.', 'Allow the torso to tip forward while keeping your back long.', 'Return to standing with control.'],
    cues: 'Think hips back rather than squat down. Stay within a comfortable range.',
    easier: 'Use a smaller range and practise with your hands on your hips.'
  },
  'Standing knee drive': {
    summary: 'A controlled standing movement where you lift one knee toward your torso and lower it again.',
    steps: ['Stand tall with support nearby if needed.', 'Brace gently through your middle.', 'Lift one knee toward your torso without leaning far backward.', 'Lower with control and repeat or alternate sides.'],
    cues: 'Stay tall and control both the lift and lowering.',
    easier: 'Lift the knee less high or keep one hand on a wall or sturdy chair.'
  }
}

export function exerciseGuide(name, note='') {
  return exerciseGuides[name] || {
    summary: name + ' is one of the movements selected for this workout.',
    steps: ['Set up in a stable, comfortable position.', 'Move slowly through a comfortable range.', 'Keep breathing and stop if the movement does not feel right.'],
    cues: note || 'Use a controlled, comfortable range.',
    easier: 'Reduce the range or use Swap to choose another suitable movement.'
  }
}

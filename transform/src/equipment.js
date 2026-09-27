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
 return options.length?options[seed%options.length]:null
}
export function levelForWorkout(workoutId){return workoutId<=7?1:workoutId<=14?2:3}

export const equipmentCatalog = [
 ['mat','Exercise mat'],['dumbbells','Free weights / dumbbells'],['kettlebell','Kettlebell'],
 ['barbell','Barbell / bench press'],['weights-machine','Weights machine'],['bands','Resistance bands'],
 ['rope','Skipping rope'],['bag','Boxing bag'],['treadmill','Treadmill'],['rower','Rowing machine'],
 ['bike','Exercise bike'],['elliptical','Cross-trainer / elliptical'],['bench','Step / bench'],['pool','Swimming pool access']
]
export const exerciseOptions = {
 cardio:[
  {name:'Fast march',equipment:[]},{name:'Step jacks',equipment:[]},{name:'Skipping',equipment:['rope']},
  {name:'Boxing combinations',equipment:['bag']},{name:'Treadmill effort',equipment:['treadmill']},
  {name:'Rowing effort',equipment:['rower']},{name:'Bike effort',equipment:['bike']},{name:'Cross-trainer effort',equipment:['elliptical']}
 ],
 push:[
  {name:'Wall push-up',equipment:[]},{name:'Incline push-up',equipment:['bench']},
  {name:'Dumbbell press',equipment:['dumbbells']},{name:'Bench press',equipment:['barbell']},{name:'Machine chest press',equipment:['weights-machine']}
 ],
 legs:[
  {name:'Bodyweight squat',equipment:[]},{name:'Goblet squat',equipment:['kettlebell']},
  {name:'Dumbbell squat',equipment:['dumbbells']},{name:'Machine leg press',equipment:['weights-machine']}
 ],
 core:[
  {name:'Standing knee drive',equipment:[]},{name:'Dead bug',equipment:['mat']},{name:'Bird dog',equipment:['mat']},
  {name:'Kettlebell carry',equipment:['kettlebell']}
 ]
}
export function availableOptions(category,equipment=[]){
 const owned=new Set(equipment)
 return (exerciseOptions[category]||[]).filter(x=>x.equipment.every(e=>owned.has(e)))
}
export function chooseExercise(category,equipment=[],seed=0){
 const options=availableOptions(category,equipment)
 return options.length?options[seed%options.length]:null
}

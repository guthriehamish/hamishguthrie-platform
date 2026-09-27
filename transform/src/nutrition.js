export const portionOptions=[['small',0.75,'Small'],['standard',1,'Standard'],['large',1.5,'Large'],['extra',2,'Extra large']]
export const foodGroups=[
 ['vegetables',1,'Vegetables / salad'],['fruit',2,'Fruit'],['lean-protein',3,'Lean protein'],['wholegrain',3,'Wholegrain / high-fibre starch'],
 ['dairy',3,'Dairy / alternative'],['refined-starch',4,'Refined starch'],['mixed-meal',5,'Mixed meal'],['fried',7,'Fried / takeaway'],
 ['sweet',6,'Sweet / dessert'],['snack',5,'Snack food'],['sugary-drink',5,'Sugary drink'],['other',4,'Other']
]
export function estimatePoints(group,portion='standard'){
 const base=foodGroups.find(x=>x[0]===group)?.[1]??4
 const factor=portionOptions.find(x=>x[0]===portion)?.[1]??1
 return Math.max(1,Math.round(base*factor))
}
export function bmi(weightKg,heightCm){
 if(!(weightKg>0&&heightCm>0))return null
 return weightKg/((heightCm/100)**2)
}

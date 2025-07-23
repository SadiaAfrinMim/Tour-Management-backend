
import { IDivision } from "./division.interface";
import { model, Schema } from "mongoose";


const divisionSchema =  new Schema<IDivision>({
    name:{type:String,require:true,unique:true},
    slug:{type:String,require:true,unique:true},
    thumbnail:{type:String},
    description:{type:String}
   
},{
    timestamps:true
})
divisionSchema.pre("save",async function(next){

   if( this.isModified("name")){
       const baseSlug = this.name.toLocaleLowerCase().split(" ").join("-");
    let slug =`${baseSlug}-division`
    console.log(slug)
    let counter = 0

    while(await Division.exists({slug})){
        slug = `${slug}-${counter++}`
   }
   this.slug = slug
}
    next()
})

export const Division = model<IDivision>("Division",divisionSchema)
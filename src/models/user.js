import mongoose from "mongoose" 

const userSchema = new mongoose.Schema({

 firstName:{
    type: String,
    required: true,
    minLength: 2,
    maxLength: 50
 },
 lastName:{
    type: String,
 },
 emailId: {
    type: String,
    lowercase: true,
    trim: true,
     required: true,
     unique: true

 },
 password:{
    type: String,
     required: true,
 },
 age:{
    type: Number,
    min: 18,
    max: 200
 },
 gender:{
    type : String,
    validate(value){
      if(!["male", "female", "other"].includes(value.toLowerCase())){
         throw new Error("Gender data is not valid")
      }
    }
 },
 shortUrl:{
   type: String,
   
 },
 photoUrl:{
   type: String,
   default: "stock.adobe.com/in/search?k=default+profile+picture&asset_id=633072621"
 },
 about:{
   type: String,
   default:"This is a default about section of a user."
 },
 skills:{
   type: [String]
 }
},{
   timestamps : true
}
)
const User = mongoose.model("users",userSchema)
export default User 
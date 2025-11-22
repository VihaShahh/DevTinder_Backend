import mongoose from "mongoose";

const connectDb = async () => {
    try{
  await mongoose.connect(
    "mongodb+srv://vihashah1103:vihaShah%401103@namstenodejs.2dppwza.mongodb.net/devTinder?retryWrites=true&w=majority"
  );
  console.log("MongoDB connected successfully!");
} catch(error){
    console.log("mongodb connection fail", error)
};
}
export default connectDb;

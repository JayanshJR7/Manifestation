import mongoose from "mongoose"

export const ConnectDB = async () => {
    try {
       const conn =  await mongoose.connect(process.env.MONGODB_URI)
       console.log(`mongodb connected : ${conn.connection.host}`);
       
    } catch (error) {
        console.log("mongodb connection error", error);
        
    }
}





/*
user model will consist of 
1)email
2)fullname
3)password
4)profile pic
5)_id (will be created by default by mongo db)
6)created At
7)Update at 




messages model will consist of
1)senderid
2)receiver id
3)text
4)image

*/
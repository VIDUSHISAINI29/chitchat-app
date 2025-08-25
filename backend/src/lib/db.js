import mongoose from 'mongoose';

export const connectDb = async() => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI);
        console.log("MongoDb connected successfully : ", conn.connection.host);
    } catch (error) {
        console.log("Mongodb connection error", error);
    }
}
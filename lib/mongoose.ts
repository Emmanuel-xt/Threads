import mongoose from 'mongoose'

let isConnected = false;

export const connectToDB = async () => {
    mongoose.set('strictQuery', true);

    if (!process.env.MONGODB_URI) return console.log('Mongo DB URL not found')
    if (isConnected) return console.log('------> MongoDB Already Conneected')

    try {
        await mongoose.connect(process.env.MONGODB_URI, {
            dbName: 'threads'
        })
        isConnected = true
        console.log('------> MongoDB Conneected')
    } catch (error) {
        console.log(error)
    }
}

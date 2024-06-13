import mongoose from "mongoose"

export const connectDB = async () => {
  try {
    if (mongoose.connection.readyState >= 1) return
    const connectDB = await mongoose.connect(process.env.MONGODB_URL as string)
    console.log(`MongoDB Connected:${connectDB.connection.host}`)
  } catch (err) {
    console.error(`Error : ${err}`)
    process.exit(1)
  }
}

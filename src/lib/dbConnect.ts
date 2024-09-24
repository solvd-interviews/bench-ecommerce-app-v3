import mongoose from "mongoose";

/* async function dbConnect() {
  try {
    await mongoose.connect(process.env.MONGODB_URI!);
  } catch (error) {
    throw new Error("Connection failed!");
  }
}

export default dbConnect; */

// Singleton class for the database connection
export class DatabaseSingleton {
  private static instance: DatabaseSingleton;
  private isConnected: boolean = false;

  private constructor() {}

  // Public method to access the Singleton instance
  public static getInstance(): DatabaseSingleton {
    if (!DatabaseSingleton.instance) {
      DatabaseSingleton.instance = new DatabaseSingleton();
    }
    return DatabaseSingleton.instance;
  }

  // Connect to the database if not already connected
  public async connect() {
    if (this.isConnected) {
      console.log("Already connected to the database.");
      return;
    }

    try {
      await mongoose.connect(process.env.MONGODB_URI!);
      this.isConnected = true;
      console.log("Database connection established.");
    } catch (error) {
      console.error("Database connection failed!", error);
      throw new Error("Connection failed!");
    }
  }
}

// Usage example
export default async function dbConnect() {
  return await DatabaseSingleton.getInstance().connect();
}

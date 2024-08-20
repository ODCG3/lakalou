import { config } from 'dotenv';
import mongoose from 'mongoose';

export default class Connexion {
    constructor() {
        this.db = null;
    }

    static async connect() {
        try {
            if(this.db == null)
            this.db = await mongoose.connect(process.env.DATABASE_URL);
            console.log('Connected to MongoDB');
            return this.db;
        } catch (error) {
            console.error('Error connecting to MongoDB:', error);
        }
    }
}

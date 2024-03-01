'use strict';

import mongoose from 'mongoose';

// Función para realizar la conexión a la base de datos
export const dbConnection = async () => {
    try {
        // Manejadores de eventos para la conexión de la base de datos
        mongoose.connection.on('error', () => {
            console.log('MongoDB | could not be connected to MongoDB');
            mongoose.disconnect();
        });
        mongoose.connection.on('connecting', () => {
            console.log('MongoDB | Try connecting');
        });
        mongoose.connection.on('connected', () => {
            console.log('MongoDB | connected to MongoDB');
        });
        mongoose.connection.on('open', () => {
            console.log('MongoDB | connected to database');
        });
        mongoose.connection.on('reconnected', () => {
            console.log('MongoDB | reconnected to MongoDB');
        });
        mongoose.connection.on('disconnected', () => {
            console.log('MongoDB | disconnected');
        });

        // Conexión a la base de datos
        await mongoose.connect(process.env.URI_MONGO, {
            serverSelectionTimeoutMS: 5000,
            maxPoolSize: 50
        });
    } catch (error) {
        console.log('Database connection failed', error);
    }
};

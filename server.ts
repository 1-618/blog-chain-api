//Import the dependencies need in this module
import express from 'express';
import morgan from 'morgan';
import logging from './src/config/logging';
import config from './src/config/config';
import mongoose from 'mongoose';
import firebaseAdmin from 'firebase-admin';
import dotenv from 'dotenv'
import cors from 'cors'


//Give access to private application information
dotenv.config()

//Import the routes that will be used to direct the flow of requests in the application
import userRoutes from './src/routes/user';
import blogRoutes from './src/routes/blog'

//Initialize express application by running the express function
const app = express();

//Logging Middleware
app.use(morgan('tiny'));

//Parse the body
app.use(cors())
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

//Connect to Firebase Admin
let serviceAccountKey = require('serviceAccountKey.json');

//Initialize firebase
firebaseAdmin.initializeApp({
    credential: firebaseAdmin.credential.cert(serviceAccountKey)
});

//Connect to Mongo database
mongoose
    .connect(`mongodb+srv://${process.env.USER_NAME}:${process.env.PASSWORD}@blog0.dnbjn.mongodb.net/blog0`, config.mongo.options)
    .then((result) => {
        logging.info('Mongo connected!');
    })
    .catch((error) => {
        logging.error(error);
    });

//Detailed Logging
app.use((req, res, next) => {
    logging.info(`METHOD: [${req.method}] - URL: [${req.url}] - IP: [${req.socket.remoteAddress}]`);

    res.on('finish', () => {
        logging.info(`METHOD: [${req.method}] - URL: [${req.url}] - STATUS: [${res.statusCode}] - IP: [${req.socket.remoteAddress}]`);
    });

    next();
});

//Our Routes
app.use('/users', userRoutes);
app.use('/blogs', blogRoutes)

// Error Handling middleware to catch stray requests
app.use((req, res, next) => {
    const error = new Error('Not found');

    res.status(404).json({
        message: error.message
    });
});
let prt = process.env.PORT || 9000
//Listen for http requests on specified port
//app.listen(config.server.port, () => console.log(`Server is running on port${config.server.port}`));
app.listen(prt, () => console.log(`listening on port ${prt}`))

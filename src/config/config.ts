//Ease of access to settings we may want to change
const config = {
    mongo: {
        options: {
            useUnifiedTopology: true,
            useNewUrlParser: true,
            socketTimeoutMS: 30000,
            keepAlive: true,
            autoIndex: false,
            retryWrites: false
        },

   },
    server: {
        port: process.env.PORT || 9000
    }
};

export default config;

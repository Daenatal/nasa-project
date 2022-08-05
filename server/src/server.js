const http = require('http');
const { resourceUsage } = require('process');

require('dotenv').config();



const app = require('./app');
const { mongoConnect } = require('./services/mongo');
const {loadPlanetsData} = require('./models/planets.model');
const {loadLaunchData} = require('./models/launches.model');

const PORT = process.env.PORT || 8000;

// const MONGO_URL = 'mongodb+srv://nasa-api:Xuh1xq8gFR4BcFZn@nasacluster.x4lkp.mongodb.net/nasa?retryWrites=true&w=majority'

const server = http.createServer(app);

// mongoose.connection.once('open', () => {
//     console.log('MongoDB connection ready!');
// });

// mongoose.connection.on('error', (err) => {
//     console.error(err);
// });

async function startServer(){
    await mongoConnect();
    await loadPlanetsData(); //will not listen for any incoming requests until this promise resolves
    await loadLaunchData();

    server.listen(PORT, () => {
        console.log(`Listening on port ${PORT}...`);
    });
}

startServer(); //will wait for the promise to resolve before we start listening for requests


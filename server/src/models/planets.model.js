const fs = require('fs'); //fs.createReadStream allows us to open the file as a readable stream
const path = require('path');
const {parse}  = require('csv-parse');

const planets = require('./planets.mongo');

//const habitablePlanets = [];

function isHabitablePlanet(planet) {
    return planet['koi_disposition'] === 'CONFIRMED' && planet['koi_insol'] > 0.36 && planet['koi_insol'] < 1.11
    && planet['koi_prad'] < 1.6;
}

/*
const promise = new Promise((resolve, reject) => {
    resolve(42);
});
promise.then((result) = {

});
const result = await promise; //code would block before logging the result or continuing
*/

function loadPlanetsData() {
    return new Promise((resolve, reject) => {
        fs.createReadStream(path.join(__dirname, '..', '..', 'data', 'kepler_data.csv'))
        .pipe(parse({
            comment: '#',
            columns: true,
        })) //connecting two streams together, connect a readable stream source to a writable stream destination
        .on('data', async (data) => {
            if (isHabitablePlanet(data)){
                //habitablePlanets.push(data); instead save to mongodb
                // TODO: replace below create with insert + update = upsert to avoid duplication
                savePlanet(data);
            }
        })
        .on('error', (err) => {
            console.log(err);
            reject(err);
        })
        .on('end', async () => {
            const countPlanetsFound = (await getAllPlanets()).length
            console.log(`${countPlanetsFound} habitable planets found!`);
            resolve();
        }); 
    });
}

async function getAllPlanets() {
    //return habitablePlanets; no longer using locally stored variable below using mongoose related method
    return await planets.find({}, {
        '_id': 0, '__v': 0,
    }); //documents will be returned if we pass in an empty object, find takes in a 2nd parameter that mongo calls the projection, list of fields from those planet documents that you'd like to include in the results
}

//parse();//returns an event emitter, only knows about streams not files

async function savePlanet(planet){
    try {
        await planets.updateOne({
            keplerName: planet.kepler_name,
        }, {
            keplerName: planet.kepler_name,
        }, {
            upsert:true,
        });
    } catch(err){
        console.error(`Could not save planet ${err}`);
    }
    
}

module.exports = {
    loadPlanetsData,
    getAllPlanets,
};
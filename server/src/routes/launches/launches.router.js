const express = require('express');
const { 
    httpGetAllLaunches,
    httpAddNewLaunch,
    httpAbortLaunch,
 } = require('./launches.controller');

const launchesRouter = express.Router();

launchesRouter.get('/', httpGetAllLaunches);
launchesRouter.post('/', httpAddNewLaunch); //as the request handler
launchesRouter.delete('/:id', httpAbortLaunch);

module.exports = launchesRouter;
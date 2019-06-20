const express = require('express');
const db = require('sqlite3');

const seriesRouter = express.Router();

const seriesDB = new db.Database(process.env.TEST_DATABASE || './database.sqlite')

seriesRouter.get('/',(req,res,next)=>{
    if (err){
        next(err);
    } else {
        seriesDB.run('SELECT * FROM seriesDB');
        req.sendStatus(200);
    }

})

modules.exports = seriesRouter;
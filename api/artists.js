const express = require('express');
const sqlite = require('sqlite3');

const artistDB = new sqlite.Database(process.env.TEST_DATABASE || './database.sqlite');

const artistsRouter = express.Router();

module.exports = artistsRouter;

artistsRouter.get('/',(req,res,next)=>{
    artistDB.all('SELECT * FROM Artist WHERE is_currently_employed =1',
    (err,artists)=>{
        if (err) {
            next(err)
        } else {
            res.status(200).json({artists:artists})
        }
    });
});

artistsRouter.param('artistId',(req,res,next,artistId)=>{
    const sql = 'SELECT * FROM Artist WHERE Artist.id = $artistId';
    const values = {$artistId: artistId};
    db.get(sql, values, (error, artist) => {
    });
})
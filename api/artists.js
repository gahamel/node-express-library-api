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
    artistDB.get(sql, values, (error, artist) => {
        if (error) {
            res.send(error)
        } else if (artist) {
            req.artist = artist; // req.artist vaut le nom de l'artiste dans la requete
            next();
        } else {
            res.sendStatus(404); // combination of res.status(404) and res.send
        }
    });
});

artistsRouter.get(':artistId',(req,res,next)=>{
    res.status(200).json({artist:req.artist})
})

artistsRouter.post('/',(req,res,next)=>{
    const name = req.body.artist.name;
    const dateOfBirth = req.body.dateOfBirth.name;
    const biography = req.body.biography.name;
    if (!name || !dateOfBirth || !biography){
        res.sendStatus(404);
    }
    const isCurrentlyEmployed = req.body.artist.isCurrentlyEmployed === 0 ? 0 : 1;
    
    const sql = `INSERT INTO Artist (name, date_of_birth, biography, is_currently_employed)
    VALUES ($name,$date_of_birth, biography, $is_currently_employed)`;
    const values = {$name:name,
    $date_of_birth:date_of_birth,
    $biography:biography,
    $is_currently_employed:is_currently_employed};

    artistDB.run(sql,values,function(error){
        db.get(`SELECT * FROM Artist WHERE Artist.id = ${this.lastID}`,
        (error, artist) => {
        res.status(201).json({artist: artist});
        });
    });
})


artistsRouter.put('/:artistId',(req,res,next)=>{
    const name = req.body.artist.name,
    dateOfBirth = req.body.artist.dateOfBirth,
    biography = req.body.artist.biography,
    isCurrentlyEmployed = req.body.artist.isCurrentlyEmployed === 0 ? 0 : 1;
    if (!name || !dateOfBirth || !biography) {
        res.sendStatus(400);
    }
    const sql = 'UPDATE Artist SET name = $name, date_of_birth = $dateOfBirth, ' +
    'biography = $biography, is_currently_employed = $isCurrentlyEmployed ' +
    'WHERE Artist.id = $artistId';
    const values = {
        $name: name,
        $dateOfBirth: dateOfBirth,
        $biography: biography,
        $isCurrentlyEmployed: isCurrentlyEmployed,
        $artistId: req.params.artistId
    };
    artistDB.run(sql,values, (error)=>{
        if (error){
            next(error);
        } else {
            artistDB.get(`SELECT * FROM Artist WHERE Artist.id = ${req.params.artistId}`,
            (error, artist) => {
                res.status(200).json({artist:artist});
            });
        }
      });
    });


    artistsRouter.delete('/:artistId', (req, res, next) => {
        const sql = 'UPDATE Artist SET is_currently_employed = 0 WHERE Artist.id = $artistId';
        const values = {$artistId: req.params.artistId};
      
        db.run(sql, values, (error) => {
          if (error) {
            next(error);
          } else {
            db.get(`SELECT * FROM Artist WHERE Artist.id = ${req.params.artistId}`,
              (error, artist) => {
                res.status(200).json({artist: artist});
              });
          }
        });
      });

      module.exports = artistsRouter;
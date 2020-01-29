const express = require('express');
const SaveImageRouter = express.Router();
const jsonParser = express.json();
const SaveImageService = require('./save-image-service');

SaveImageRouter
    .route('/:user_id')
    .get((req, res, next) => {
        const db = req.app.get('db');
        const { user_id } = req.params;
        return SaveImageService.getSavedImages(db, user_id)
            .then((favs) => {
                if(!favs){
                    return res
                        .status(400)
                        .json({
                            error: {
                                message: `Could not fetch favourites`
                            }
                        })
                }

                return res.json(favs);
            })
            .catch(next);
    })

SaveImageRouter
    .route('/')
    .post(jsonParser, (req, res, next) => {
        const db = req.app.get('db');
        const newFav = {
            user_id: req.body.user_id,
            image_id: req.body.image_id,
        }

        return SaveImageService.insertSavedImage(db, newFav)
            .then((addedFav) => {
                if(!addedFav){
                    return res
                        .status(400)
                        .json({
                            error: {
                                message: `Could not add a favourite image`
                            }
                        })
                }

                return res.status(201).json(addedFav);
            })
            .catch(next);
    })


    

module.exports = SaveImageRouter;
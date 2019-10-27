const express = require('express')
const ImagesService = require('./images-service')

const imagesRouter = express.Router()

imagesRouter
    .route('/')
    .get((req,res,next)=>{
        ImagesService.getAllImages(
            req.app.get('db')
        )
        .then(images => {
            res.json(images.map(ImagesService.serializeImage))
        })
        .catch(next)
    })
imagesRouter
.route('/:image_id')
.all(checkImageExists)
.get((req,res) => {
    res.json(ImagesService.serializeImage(res.image))
})
imagesRouter
.route('/:image_id/comments/')
.all(checkImageExists)
.get((req,res,next)=>{
    ImagesService.getCommentsForImage(
        req.app.get('db'),
        req.params.image_id
    )
    .then(comments => {
        res.json(comments.map(ImagesService.serializeImageComment))
    })
    .catch(next)
})

async function checkImageExists(req, res, next) {
    try {
      const image = await ImagesService.getById(
        req.app.get('db'),
        req.params.image_id
      )
  
      if (!image)
        return res.status(404).json({
          error: `Image doesn't exist`
        })
  
      res.image = image;
      next()
    } catch (error) {
      next(error)
    }
  }
  
  module.exports = imagesRouter;
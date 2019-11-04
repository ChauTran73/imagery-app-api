const express = require('express')
const ImagesService = require('./images-service')
const jsonBodyParser = express.json()
const imagesRouter = express.Router()
const path = require('path')

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
.route('/')
.post(jsonBodyParser, (req, res, next) => {
    const { title, description, image_url } = req.body
    const newImg = { title, description, image_url }
    if(!title){
        return res.status(400).json({
            error: `Missing title in request body`
          })
    }
    if(!image_url){
        return res.status(400).json({
            error: `Missing image_url in request body`
          })
    }
    ImagesService.postImage(req.app.get('db'), newImg)
    .then(image => {
        res
          .status(201)
          .location(path.posix.join(req.originalUrl, `/${image.id}`))
          .json(ImagesService.serializeImage(image))
      })
      .catch(next)
    
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
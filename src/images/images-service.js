const xss = require('xss')

const ImagesService = {
    getAllImages(db){
        return db
        .from('imagery_images AS img')
      .select(
        'img.id',
        'img.title',
        'img.description',
        'img.image_url',
        'img.date_created',
        db.raw(
          `count(DISTINCT comm) AS number_of_comments`
        ),
        db.raw(
          `json_strip_nulls(
            json_build_object(
              'id', usr.id,
              'email', usr.email,
              'full_name', usr.full_name,
              'user_name', usr.user_name,
              'date_created', usr.date_created,
              'date_modified', usr.date_modified
            )
          ) AS "author"`
        ),
      )
      .leftJoin(
        'imagery_comments AS comm',
        'img.id',
        'comm.image_id',
      )
      .leftJoin(
        'imagery_users AS usr',
        'img.author_id',
        'usr.id',
      )
      .groupBy('img.id', 'usr.id')
    

    },
    getById(db, id) { //get a single image based on image id
        return ImagesService.getAllImages(db)
            .where('img.id', id)
            .first()
    },
    getCommentsForImage(db, image_id) { //get all comments on an image
        return db
            .from('imagery_comments AS comm')
            .select(
                'comm.id',
                'comm.text',
                'comm.date_created',
                db.raw(
                    `json_strip_nulls(
                    row_to_json(
                        (SELECT tmp FROM (
                            SELECT
                            usr.id,
                  usr.email,
                  usr.full_name,
                  usr.date_created,
                  usr.date_modified
              ) tmp)
            )
          ) AS "user"`
                )
            )
            .where('comm.image_id', image_id)
            .leftJoin(
                'imagery_users AS usr',
                'comm.user_id',
                'usr.id',
        )
            .groupBy('comm.id', 'usr.id')
    },
    postImage(db, newImg){ //create a new image
      return db
      .insert(newImg)
      .into('imagery_images')
        .returning('*')
        .then(([image]) => image)
        .then(image =>
          ImagesService.getById(db, image.id)
        )
    },
    deleteImage(db, id){
      return db
            .from('imagery_images')
            .where({ id })
            .delete()
    },
    serializeImage(image) {
        const { author } = image
        return {
            id: image.id,
            title: xss(image.title),
            description: xss(image.description),
            url: xss(image.image_url),
            date_created: new Date(image.date_created),
            number_of_comments: Number(image.number_of_comments) || 0,
            author: {
                id: author.id,
                full_name: author.full_name,
                user_name: author.user_name,
                email: author.email,
                date_created: new Date(author.date_created),
                date_modified: new Date(author.date_modified) || null
            },
        }
    },
    serializeImageComment(comment) {
        const { user } = comment
        return {
          id: comment.id,
          image_id: comment.image_id,
          text: xss(comment.text),
          date_created: new Date(comment.date_created),
          user: {
            id: user.id,
            email: user.email,
            full_name: user.full_name,
            date_created: new Date(user.date_created),
            date_modified: new Date(user.date_modified) || null
          },
        }
      },

}
module.exports = ImagesService;

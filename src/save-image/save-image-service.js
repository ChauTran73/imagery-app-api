const SaveImageService = {
    getSavedImages(db, user_id){
        return db('saved_images as si')
            .select(
                'image.id',
                'image.title',
                'image.description',
                'image.author',
                'image.image_url'
            )
            .where('si.user_id', user_id);
    },
    insertSavedImage(db, newFav){
        return db('saved_images')
            .insert(newFav)
            .returning('*')
            .then(rows => rows[0]);
    },
}

module.exports = SaveImageService;
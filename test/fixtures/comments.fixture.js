function makeCommentsArray() {
    return [
        {
            "id": 1,
            "text": "wow amazing!!!",
            "date_created": "2019-12-02T16:35:16.339Z",
            "user": {
                "id": 1,
                "email": "testuser@gmail.com",
                "full_name": "Chau Tran",
                "date_created": "2019-12-02T16:26:46.269Z",
                "date_modified": null
            }
        },
        {
            "id": 2,
            "text": "wowwww amazing!!!",
            "date_created": "2019-12-02T16:35:16.339Z",
            "user": {
                "id": 4,
                "email": "test7393@gmail.com",
                "full_name": "Chau",
                "date_created": "2019-12-02T16:26:46.269Z",
                "date_modified": null
            }
        },
      
    ]
}

module.exports = {
    makeCommentsArray,
}
const { expect } = require('chai')
const knex = require('knex')
const app = require('../src/app')
const { TEST_DATABASE_URL } = require('../src/config')
const { makeImagesArray } = require('./fixtures/images.fixture')


describe('Images Endpoints', function () {
    let db;

    before('make knex instance', () => {
        db = knex({
            client: 'pg',
            connection: TEST_DATABASE_URL
        })
        app.set('db', db)
    })

    after('disconnect from db', () => db.destroy())

    beforeEach('clean the table', () => {db('imagery_images').truncate()})

    afterEach('cleanup', () => db('imagery_images').truncate())

    describe(`GET /images`, () => {
        context(`Given no images`, () => {
            it(`responds with 200 and an empty list`, () => {
                return supertest(app)
                    .get('/api/images')
                    .expect(200, [])
            })
            it(`responds with 404`, () => {
                const imageId = 12345
                return supertest(app)
                    .get(`/api/${imageId}`)
                    .expect(404, { error: { message: `Image does not exist` } })
            })
        })
        context(`Given there are images in the database`, () => {
            const testImages = makeImagesArray()

            beforeEach(`insert images`, () => {
                return db.into('imagery_images')
                    .insert(testImages)
            })


            it(`responds with 200 and all of the images`, () => {
                return supertest(app)
                    .get('/api/images')
                    .expect(200, testImages)
            })

            it(`responds with 200 and the image`, () => {
                const imageId = 2
                const expectedImage = testImages[imageId]
                return supertest(app)
                    .get(`/api/images/${imageId}`)
                    .expect(200, expectedImage)
            })
        })
        
    }) // end of GET/images test endpoint

    describe(`POST /images`, () => {
        it(`creates an image, respondiing with 201 and the new image`, () => {
            const newImage = {
                title: 'Test new image',
                url: 'https://source.unsplash.com/DmDYX_ltI48',
                description: 'test new desc',
            }
            return supertest(app)
                .post('/images')
                .send()
                .expect(201)
                .expect(res => {
                    expect(res.body.title).to.eql(newImage.title)
                    expect(res.body.style).to.eql(newImage.url)
                    expect(res.body.content).to.eql(newImage.description)
                    expect(res.body).to.have.property('id')
                })
                .then(postRes =>
                    supertest(app)
                        .get(`/api/images/${postRes.body.id}`)
                        .expect(postRes.body)
                )
        })
    })
})
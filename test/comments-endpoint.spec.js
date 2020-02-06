const { expect } = require('chai')
const knex = require('knex')
const app = require('../src/app')
const { TEST_DATABASE_URL } = require('../src/config')
const { makeCommentsArray } = require('./fixtures/images.fixture')

describe('Comments Endpoints', function () {
    let db;

    before('make knex instance', () => {
        db = knex({
            client: 'pg',
            connection: TEST_DATABASE_URL
        })
        app.set('db', db)
    })

    after('disconnect from db', () => db.destroy())

    before('clean the table', () => db('imagery_comments').truncate())

    afterEach('cleanup', () => db('imagery_comments').truncate())

    describe(`GET /comments`, () => {
        context(`Given there are comments on an image`, () => {
            it(`get all comments for an image`, () => {
                const image_id = 2
                const expectedComments = testComments[image_id].comments
                return supertest(app)
                    .get(`/api/${image_id}/comments`)
                    .expect(200, expectedComments)
            })
        })
       
        context(`Given there are no comments in the db`, () => {
            it(`responds with 200 and an empty list of comments`, () => {
                const image_id = 1
                return supertest(app)
                    .get(`/api/${image_id}/comments`)
                    .expect(200, [])
            })
        })
    })

    describe(`POST /comments`, () => {
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
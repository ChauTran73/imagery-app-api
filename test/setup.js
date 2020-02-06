const { expect } = require('chai')
const supertest = require('supertest')
require('dotenv').config()
process.env.NODE_ENV = 'test'

global.expect = expect
global.supertest = supertest
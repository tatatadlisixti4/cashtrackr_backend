import request from 'supertest'
import {server, connectDB, disconnectDB} from '../../server'

describe('Test', () => {
    beforeAll(async () => { 
        await connectDB()
    }, 10000)

    afterAll (async () => {
        await disconnectDB()
    })

    it('should return a 200 status code from the homepage url', async () => {
        const app = server()
        const response = await request(app).get('/')
        expect(response.statusCode).toBe(200)
        expect(response.text).toBe('Todo bien...')
    })
})
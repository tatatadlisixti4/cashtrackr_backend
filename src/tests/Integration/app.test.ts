import request from 'supertest'
import {server, connectDB, disconnectDB} from '../../server'
import {AuthController} from '../../controllers/AuthController'
const app = server()

describe('Authentication - Create Account', () => {
    beforeAll(async () => { 
        await connectDB()
    }, 12000)

    afterAll (async () => {
        await disconnectDB()
    })
    
    it('should dispĺay validation errors when form is empty', async () => {
        const response = await request(app)
            .post('/api/auth/create-account')
            .send({})
        const createAccountMock = jest.spyOn(AuthController, 'createAccount')
        expect(response.status).toBe(400)
        expect(response.body).toHaveProperty('errors')
        expect(response.body.errors).toHaveLength(3)
        expect(response.status).not.toBe(201)
        expect(createAccountMock).not.toHaveBeenCalled()
    })
})
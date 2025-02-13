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
    
    it('should display validation errors when form is empty', async () => {
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

    it('should return 400 status code when the email is invalid', async () => {
        const response = await request(app)
            .post('/api/auth/create-account')
            .send({
                "name": "Thadli",
                "password": "123456789",
                "email": "notemail"
            })
        const createAccountMock = jest.spyOn(AuthController, 'createAccount')
        expect(response.status).toBe(400)
        expect(response.body).toHaveProperty('errors')
        expect(response.body.errors[0]['msg']).toBe('E-mail no válido')
        expect(response.body.errors).toHaveLength(1)
        expect(response.status).not.toBe(201)
        expect(createAccountMock).not.toHaveBeenCalled()
    })

    it('should return 400 status code when the password is less than 8 characters', async () => {
        const response = await request(app)
            .post('/api/auth/create-account')
            .send({
                "name": "Thadli",
                "password": "1234567",
                "email": "test@test.com"
            })
            
        const createAccountMock = jest.spyOn(AuthController, 'createAccount')
        expect(response.status).toBe(400)
        expect(response.body).toHaveProperty('errors')
        expect(response.body.errors[0]['msg']).toBe('El password es muy corto, son mínimo 8 caracteres')
        expect(response.body.errors).toHaveLength(1)
        expect(response.status).not.toBe(201)
        expect(createAccountMock).not.toHaveBeenCalled()
    })

    it('should return 201 status code and create an user in de database', async () => {
        const mockUserData = {
            "name": "Maria",
            "password": "12345678",
            "email": "test2@test.com"
        }
        const response = await request(app)
            .post('/api/auth/create-account')
            .send(mockUserData)
        expect(response.status).toBe(201)
        expect(response.text).toBe('Usuario creado con éxito')
        expect(response.body).not.toHaveProperty('errors')
        expect(response.status).not.toBe(400)
    })
})
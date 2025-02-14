import request from 'supertest'
import {server, connectDB, disconnectDB} from '../../server'
import {AuthController} from '../../controllers/AuthController'
const app = server()

beforeAll(async () => { 
    await connectDB()
})

afterAll (async () => {
    await disconnectDB()
})

describe('Authentication - Create account', () => {
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

    it('should return 201 status code and create an user in the database', async () => {
        const mockUserData = {
            "name": "Thadli",
            "password": "12345678",
            "email": "test@test.com"
        }
        const response = await request(app)
            .post('/api/auth/create-account')
            .send(mockUserData)
        expect(response.status).toBe(201)
        expect(response.body).toBe('Usuario creado con éxito')
        expect(response.body).not.toHaveProperty('errors')
        expect(response.status).not.toBe(400)
    })

    it('should return 409 conflict when a user is already registered', async () => {
        const mockUserData = {
            "name": "Thadli",
            "password": "12345678",
            "email": "test@test.com"
        }
        const response = await request(app)
            .post('/api/auth/create-account')
            .send(mockUserData)

        expect(response.status).toBe(409)
        expect(response.body).toHaveProperty('error', 'El usuario ya existe')
        expect(response.status).not.toBe(400)
        expect(response.status).not.toBe(201)
        expect(response.body).not.toHaveProperty('errors')
    })
})

describe('Authentication - Account confirmation with token', () => {
    it('should display error if token is empty or is not valid', async () => {
        const response = await request(app)
            .post('/api/auth/confirm-account')
            .send({
                token: "notToken"
            })
        expect(response.status).toBe(400)
        expect(response.body).toHaveProperty('errors')
        expect(response.body.errors).toHaveLength(1)
        expect(response.body.errors[0]['msg']).toBe('Token no válido')
    })

    it('should display error if token doesnt have an user valid', async () => {
        const response = await request(app)
            .post('/api/auth/confirm-account')
            .send({
                token: "123456"
            })
        expect(response.body).toHaveProperty('error')
        expect(response.status).toBe(401)
        expect(response.body.error).toBe('Token no válido')
        expect(response.status).not.toBe(200)
    })

    it('should confirm account with a valid token', async () => {
        const token = globalThis.confirmationToken
        const response = await request(app)
        .post('/api/auth/confirm-account')
        .send({token})

        expect(response.status).toBe(200)
        expect(response.body).toBe('Cuenta confirmada correctamente')
        expect(response.status).not.toBe(401)
    })
})     

describe('Authentication - Login', () => {
    it('should display validation errors when the form is empty', async () => {
        const response = await request(app)
            .post('/api/auth/login')
            .send({})
        const next = jest.fn()
        const LoginMock = jest.spyOn(AuthController, 'login')

        expect(response.status).toBe(400)
        expect(response.body).toHaveProperty('errors')
        expect(response.body.errors).toHaveLength(2)
        expect(next).not.toHaveBeenCalled()
        expect(LoginMock).not.toHaveBeenCalled()
    })
})
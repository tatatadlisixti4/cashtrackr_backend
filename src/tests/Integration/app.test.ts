import request from 'supertest'
import {server, connectDB, disconnectDB} from '../../server'
import {AuthController} from '../../controllers/AuthController'
import User from '../../models/User'
import * as authPassword from '../../utils/auth'
import * as jwt from '../../utils/jwt'

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
        expect(response.body.errors).not.toHaveLength(1)
    })
    
    it('should return 400 bad request when the email is invalid', async () => {
        const response = await request(app)
            .post('/api/auth/login')
            .send({
                "email": "notEmail",
                "password": "12345678"
            })
            
        const next = jest.fn()
        const LoginMock = jest.spyOn(AuthController, 'login')

        expect(response.status).toBe(400)
        expect(response.body).toHaveProperty('errors')
        expect(response.body.errors).toHaveLength(1)
        expect(response.body.errors[0].msg).toBe('Email no válido')
        expect(next).not.toHaveBeenCalled()
        expect(LoginMock).not.toHaveBeenCalled()
        expect(response.body.errors).not.toHaveLength(2)
    })
    
    it('should return 404 error if the user is not found', async () => {
        const response = await request(app)
            .post('/api/auth/login')
            .send({
                "email": "user_not_found@test.com",
                "password": "12345678"
            })
        
        expect(response.status).toBe(404)
        expect(response.body).toHaveProperty('error')
        expect(response.body.error).toBe('Usuario no existe')
        expect(response.status).not.toBe(200)
    })

    it('should return 403 error if the user account is not confirmed', async () => {
        const findUserMock = jest.spyOn(User, 'findOne');
        (findUserMock as jest.Mock).mockResolvedValue({
            id: 1,
            confirmed: false,
            email: "user_not_confirmed@test.com",
            password: "12345678"
        });

        const response = await request(app)
            .post('/api/auth/login')
            .send({
                "email": "user_not_confirmed@test.com",
                "password": "12345678"
            })
        
        expect(response.status).toBe(403)
        expect(response.body).toHaveProperty('error')
        expect(response.body.error).toBe('La cuenta no ha sido confirmada')
        expect(response.status).not.toBe(404)
        expect(response.status).not.toBe(200)

        findUserMock.mockRestore()
    })

    it('should return 403 error if the user account is not confirmed method 2', async () => {
        const userData = {
            name: "Test",
            email: "user_not_confirmed@test.com",
            password: "12345678"
        }
        await request(app).post('/api/auth/create-account').send(userData)

        const response = await request(app)
            .post('/api/auth/login')
            .send({
                "email": userData.email,
                "password": userData.password
            })
        
        expect(response.status).toBe(403)
        expect(response.body).toHaveProperty('error')
        expect(response.body.error).toBe('La cuenta no ha sido confirmada')
        expect(response.status).not.toBe(404)
        expect(response.status).not.toBe(200)
    })

    it('should return 401 error if user the password is invalid', async () => {
        const findUserMock = jest.spyOn(User, 'findOne');
        (findUserMock as jest.Mock).mockResolvedValue({
            id: 1,
            confirmed: true,
            email: "test@test.com",
            password: "hashedPassword"
        });
        const checkPasswordMock = jest.spyOn(authPassword, 'checkPassword'); 
        (checkPasswordMock as jest.Mock).mockResolvedValue(false);

        const response = await request(app)
            .post('/api/auth/login')
            .send({
                "email": "test@test.com",
                "password": "wrongPassword"
            })
        
        expect(findUserMock).toHaveBeenCalledTimes(1)
        expect(checkPasswordMock).toHaveBeenCalledTimes(1)
        expect(response.status).toBe(401)
        expect(response.body).toHaveProperty('error')
        expect(response.body.error).toBe('Password incorrecto')
        expect(response.status).not.toBe(404)
        expect(response.status).not.toBe(403)
        expect(response.status).not.toBe(200)

        findUserMock.mockRestore()
        checkPasswordMock.mockRestore()
    })

    it('should return 200 statuscode after create the jwt', async () => {
        const findUserMock = jest.spyOn(User, 'findOne');
        (findUserMock as jest.Mock).mockResolvedValue({
            id: 1,
            confirmed: true,
            email: "test@test.com",
            password: "hashedPassword"
        });
        const checkPasswordMock = jest.spyOn(authPassword, 'checkPassword'); 
        (checkPasswordMock as jest.Mock).mockResolvedValue(true);
        const jwtMock = jest.spyOn(jwt, 'generateJWT');
        (jwtMock as jest.Mock).mockReturnValue('jwt_token')

        const response = await request(app)
            .post('/api/auth/login')
            .send({
                "email": "test@test.com",
                "password": "correctPassword"
            })

        expect(response.status).toBe(200)
        expect(response.body).toBe('jwt_token')
        expect(checkPasswordMock).toHaveBeenCalledTimes(1)
        expect(checkPasswordMock).toHaveBeenCalledWith('correctPassword', 'hashedPassword')
        expect(jwtMock).toHaveBeenCalledTimes(1)
        expect(jwtMock).toHaveBeenCalledWith(1)

        findUserMock.mockRestore()
        checkPasswordMock.mockRestore()
        jwtMock.mockRestore()
    })
})

describe('GET /api/budgets', () => {
    let jwt: string
    beforeEach(async () => {
        const response = await request(app)
            .post('/api/auth/login')
            .send({
                email: "test@test.com",
                password: "12345678"
            })
            jwt =  response.body
        expect(response.status).toBe(200)
    })
    
    it('should reject unauthenticated acess to budgets without a jwt', async () => {
        const response = await request(app)
            .get('/api/budgets')
            
        expect(response.status).toBe(401)
        expect(response.body).toHaveProperty('error', 'No autorizado')
    })
    
    it('should allow authenticated access to budgets with a valid jwt', async () => {
        const response = await request(app)
            .get('/api/budgets')
            .auth(jwt, {type: 'bearer'})

        expect(response.body).toHaveLength(0)
        expect(response.status).not.toBe(401)
        expect(response.body).not.toHaveProperty('error', 'No autorizado')
    })

    it('should reject unauthenticated acess to budgets without a valid jwt', async () => {
        const response = await request(app)
            .get('/api/budgets')
            .auth('not_valid_token', {type: 'bearer'})
            
        expect(response.status).toBe(500)
        expect(response.body).toHaveProperty('error', 'Token no valido')
    })
})
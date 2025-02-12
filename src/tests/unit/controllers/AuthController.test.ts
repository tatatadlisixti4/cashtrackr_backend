import {createRequest, createResponse} from "node-mocks-http"
import {AuthController} from "../../../controllers/AuthController"
import User from "../../../models/User"
import {hashPassword} from "../../../utils/auth"
import {generateToken} from "../../../utils/token"
import {AuthEmail} from "../../../emails/AuthEmail"

jest.mock('../../../models/User')
jest.mock('../../../utils/auth')
jest.mock('../../../utils/token')

describe('AuthController.createAccount', () => {
    beforeEach(() => {
        jest.resetAllMocks();
        //(User.findOne as jest.Mock).mockReset()
    })
    it('should return a 409 status and an error message if the email is already  registered', async () => {
        (User.findOne as jest.Mock).mockResolvedValue(true)
        const req = createRequest({
            method: 'POST',
            url: '/api/auth/create-account', 
            body: {
                email: 'test@test.com',
                password: 123456789
            }
        })
        const res = createResponse()
        await AuthController.createAccount(req, res)
        const data = res._getJSONData()
        expect(res.statusCode).toBe(409)
        expect(data).toHaveProperty('error', 'El usuario ya existe')
        expect(User.findOne).toHaveBeenCalled()
        expect(User.findOne).toHaveBeenCalledTimes(1)
        expect(User.findOne).toHaveBeenCalledWith({where: {email: req.body.email}})
    })

    it('should register a new user and return a success message', async () => {
        (hashPassword as jest.Mock).mockResolvedValue('123456789');
        (generateToken as jest.Mock).mockReturnValue('123456');
        const req = createRequest({
            method: 'POST',
            url: '/api/auth/create-account', 
            body: {
                email: 'test@test.com',
                password: '123456789',
                name: 'Thadli Guerra'
            }
        })
        const res = createResponse()
        const mockUser = {
            ...req.body,
            password: await hashPassword(req.body.password),
            token: generateToken()
        };
        (User.findOne as jest.Mock).mockResolvedValue(null);
        (User.create as jest.Mock).mockResolvedValue(mockUser);
        jest.spyOn(AuthEmail, 'sendConfirmationEmail').mockImplementation(() => Promise.resolve())
        await AuthController.createAccount(req, res)

        expect(User.create).toHaveBeenCalledTimes(1)
        expect(User.create).toHaveBeenCalledWith(mockUser) 
        expect(mockUser.password).toBe('123456789') 
        expect(mockUser.token).toBe('123456') 
        expect(AuthEmail.sendConfirmationEmail).toHaveBeenCalledWith({
            name: req.body.name,
            email: req.body.email,
            token: mockUser.token
        })
        expect(AuthEmail.sendConfirmationEmail).toHaveBeenCalledTimes(1)
        expect(res.statusCode).toBe(201)
    })
})

describe('AuthController.login', () => {
    beforeEach(() => {
        jest.resetAllMocks()
    })
    it('should return 404 if user is not found', async () => {
        (User.findOne as jest.Mock).mockResolvedValue(null)

        const req = createRequest({
            method: 'POST',
            url: '/api/auth/login', 
            body: {
                email: 'test@test.com',
                password: '123456789'
            }
        })
        const res = createResponse()
        await AuthController.login(req, res)
        const data = res._getJSONData()
        expect(res.statusCode).toBe(404)
        expect(data).toHaveProperty('error', 'Usuario no existe')
    })

    it('should return 403 if user account is not confirmed', async () => {
        (User.findOne as jest.Mock).mockResolvedValue({
            id: 1,
            email: 'test@test.com',
            password: '123456789',
            confirmed: false
        })

        const req = createRequest({
            method: 'POST',
            url: '/api/auth/login', 
            body: {
                email: 'test@test.com',
                password: '123456789'
            }
        })
        const res = createResponse()
        await AuthController.login(req, res)
        const data = res._getJSONData()
        expect(res.statusCode).toBe(403)
        expect(data).toHaveProperty('error', 'La cuenta no ha sido confirmada')
    })
})
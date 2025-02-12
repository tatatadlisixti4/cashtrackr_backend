import {createRequest, createResponse} from "node-mocks-http"
import {AuthController} from "../../../controllers/AuthController"
import User from "../../../models/User"

jest.mock('../../../models/User')

describe('AuthController.createAccount', () => {
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
        expect(User.create).not.toHaveBeenCalled()
    })
})
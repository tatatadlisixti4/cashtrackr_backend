import {createRequest, createResponse} from 'node-mocks-http'
import {hasAccess, validateBudgetExists} from '../../../middleware/budget'
import Budget from '../../../models/Budget'
import {budgets} from '../../mocks/budgets'

jest.mock('../../../models/Budget', () => ({
    findByPk: jest.fn()
}))

describe('Budget Middleware - validateBudgetExists', () => {
    it('should handle non-existent budget', async () => {
        (Budget.findByPk as jest.Mock).mockResolvedValue(null)
        const req = createRequest({
            params: {
                budgetId: 1
            }
        })
        const res = createResponse()
        const next = jest.fn()
        await validateBudgetExists(req, res, next)
        const data = res._getJSONData()
        expect(res.statusCode).toBe(404)
        expect(data).toEqual({error: 'Presupuesto no existe'})
        expect(next).not.toHaveBeenCalled()
    })

    it('should handle internal server error', async () => {
        (Budget.findByPk as jest.Mock).mockRejectedValue(new Error)
        const req = createRequest({
            params: {
                budgetId: 1
            }
        })
        const res = createResponse()
        const next = jest.fn()
        await validateBudgetExists(req, res, next)
        const data = res._getJSONData()
        expect(res.statusCode).toBe(500)
        expect(data).toEqual({error: 'Hubo un error'})
        expect(next).not.toHaveBeenCalled()
    })

    it('should procees to next middleware if budget exists', async () => {
        (Budget.findByPk as jest.Mock).mockResolvedValue(budgets[0])
        const req = createRequest({
            params: {
                budgetId: 1
            }
        })
        const res = createResponse()
        const next = jest.fn()
        await validateBudgetExists(req, res, next)
        expect(res.statusCode).toBe(200)
        expect(req.budget).toEqual(budgets[0])
        expect(next).toHaveBeenCalled()
    })
})

describe('Budget Middleware - hasAccess', () => {
    it('should call next() if user has access to budget', () => {
        const req = createRequest({
            budget: budgets[0],
            user: {id: 1}
        })
        const res = createResponse()
        const next = jest.fn()

        hasAccess(req, res, next)
        expect(next).toHaveBeenCalled()
        expect(next).toHaveBeenCalledTimes(1)
    })

    it('should return 401 error if userId isnt the same as budget.userId', () => {
        const req = createRequest({
            budget: {userId: 1},
            user: {id: 2}
        })
        const res = createResponse()
        const next = jest.fn()
        hasAccess(req, res, next)
        expect(res.statusCode).toBe(401)
        expect(res._getJSONData()).toEqual({error: 'Acción no válida para este usuario'})
        expect(next).not.toHaveBeenCalled()
    })
}) 
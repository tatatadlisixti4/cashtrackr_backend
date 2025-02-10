import {createRequest, createResponse} from 'node-mocks-http'
import {budgets} from "../mocks/budgets"
import {BudgetController} from '../../controllers/BudgetController'
import Budget from '../../models/Budget'

jest.mock('../../models/Budget', () => ({
    findAll: jest.fn()
}))

describe('BudgetController.getAll', () => {
    it('should retrive 2 budgets for user with ID 1', async () => {
        const req = createRequest({
            user: {id: 1}
        })
        const res = createResponse()
        const updatedBudgets = budgets.filter(budget =>  budget.userId === req.user.id)
        ;(Budget.findAll as jest.Mock).mockResolvedValue(updatedBudgets)

        await BudgetController.getAll(req, res)
        const data = res._getJSONData()
        expect(data).toHaveLength(2)
        expect(res.statusCode).toBe(200)
        expect(res.statusCode).not.toBe(404)
    })
})
import {createRequest, createResponse} from 'node-mocks-http'
import Expense from '../../../models/Expense'
import {ExpensesController} from '../../../controllers/ExpenseController'
import {expenses} from '../../mocks/expenses'

jest.mock('../../../models/Expense', () => ({
    create: jest.fn()
}))
describe('ExpensesController.create', () => {
    it('should create a new expense', async () => {
        (Expense.create as jest.Mock).mockResolvedValue(true)
        const req = createRequest({
            method: 'POST',
            url: '/api/budgets/:budgetId/expenses',
            body: {name: 'New Expense', amount: 500},
            budget: {id: 1}
        })
        const res = createResponse()
        await ExpensesController.create(req, res)
        const data = res._getJSONData()
        expect(res.statusCode).toBe(201)
        expect(data).toBe('Gasto agregado correctamente')
        expect(Expense.create).toHaveBeenCalledWith({
            ...req.body,
            budgetId: req.budget.id
        })
        
    })
    it('should handle expense creation error', async () => {
        (Expense.create as jest.Mock).mockRejectedValue(new Error)
        const req = createRequest({
            method: 'POST',
            url: '/api/budgets/:budgetId/expenses',
            body: {name: 'New Expense', amount: 500},
            budget: {id: 1}
        })
        const res = createResponse()
        await ExpensesController.create(req, res)
        const data = res._getJSONData()
        expect(res.statusCode).toBe(500)
        expect(data).toEqual({error: 'Hubo un error'})
        expect(Expense.create).toHaveBeenCalledWith({
            ...req.body,
            budgetId: req.budget.id
        })
    })
})

describe('ExpenseController.getById', () => {
    it('should return expense with ID 1', async () => {
        const req = createRequest({
            method: 'POST',
            url: '/api/budgets/:budgetId/expenses/:expenseId',
            expense: expenses[0]
        })
        const res = createResponse()
        await ExpensesController.getById(req, res)
        const data = res._getJSONData()
        expect(res.statusCode).toBe(200)
        expect(data).toEqual(expenses[0])
    })
})
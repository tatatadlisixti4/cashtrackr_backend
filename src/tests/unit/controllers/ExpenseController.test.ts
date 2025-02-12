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

describe('ExpenseController.updateById', () => {
    it('should update expense with ID 1', async () => {
        const mockExpense = {
            ...expenses[0],
            update: jest.fn().mockResolvedValue(true)
        }
        const req = createRequest({
            method: 'PUT',
            url: '/api/budgets/:budgetId/expenses/:expenseId',
            expense: mockExpense,
            body: {name: 'Updated Expense', amount: 500},
        })
        const res = createResponse()
        await ExpensesController.updateById(req, res)
        const data = res._getJSONData()
        expect(res.statusCode).toBe(200)
        expect(data).toBe('Gasto actualizado correctamente')
        expect(mockExpense.update).toHaveBeenCalled()
        expect(mockExpense.update).toHaveBeenCalledTimes(1)
        expect(mockExpense.update).toHaveBeenCalledWith(req.body)
    })
})

describe('ExpenseController.deleteById', () => {
    it('should delete expense with ID 1 and return a success status code', async () => {
        const mockExpense = {
            ...expenses[0],
            destroy: jest.fn().mockResolvedValue(true)
        }
        const req = createRequest({
            method: 'DELETE',
            url: '/api/budgets/:budgetId/expenses/:expenseId',
            expense: mockExpense
        })
        const res = createResponse()
        await ExpensesController.deleteById(req, res)
        const data = res._getJSONData()
        expect(res.statusCode).toBe(200)
        expect(data).toBe('Gasto eliminado correctamente')
        expect(mockExpense.destroy).toHaveBeenCalled()
        expect(mockExpense.destroy).toHaveBeenCalledTimes(1)
    })
})
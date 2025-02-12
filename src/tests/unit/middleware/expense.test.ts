import {createRequest, createResponse} from "node-mocks-http"
import {validateExpenseExists} from "../../../middleware/expense"
import Expense from "../../../models/Expense"
import {expenses} from "../../mocks/expenses"
import { budgets } from "../../mocks/budgets"
import { hasAccess } from "../../../middleware/budget"

jest.mock('../../../models/Expense', () => ({
    findByPk: jest.fn() 
}))

describe('Expenses Middleware - validateExpenseExists', () => {
    beforeEach(() => {
        (Expense.findByPk as jest.Mock).mockImplementation(id => {
            const expense = expenses.filter(e => e.id === id)[0] ?? null
            return Promise.resolve(expense)
        })
    })
    it('should handle a non-existent expense', async () => {
        const req = createRequest({
            params: {expenseId: 4}
        })
        const res = createResponse()
        const next = jest.fn()
        await validateExpenseExists(req, res, next)
        const data = res._getJSONData()

        expect(res.statusCode).toBe(404)
        expect(data).toEqual({error: 'Gasto no existe'})
        expect(Expense.findByPk).toHaveBeenCalled()
        expect(Expense.findByPk).toHaveBeenCalledTimes(1)
        expect(Expense.findByPk).toHaveBeenCalledWith(req.params.expenseId)
        expect(next).not.toHaveBeenCalled()
    })

    it('should call next middleware if expense exists', async () => {
        const req = createRequest({
            params: {expenseId: 1}
        })
        const res = createResponse()
        const next = jest.fn()
        await validateExpenseExists(req, res, next)

        expect(res.statusCode).toBe(200)
        expect(next).toHaveBeenCalled()
        expect(next).toHaveBeenCalledTimes(1)
        expect(req.expense).toEqual(expenses[0])
    })

    it('should handle internal server error', async () => {
        (Expense.findByPk as jest.Mock).mockRejectedValue(new Error)
        const req = createRequest({
            params: {expenseId: 1}
        })
        const res = createResponse()
        const next = jest.fn()
        await validateExpenseExists(req, res, next)
        const data = res._getJSONData()
        expect(next).not.toHaveBeenCalled()
        expect(res.statusCode).toBe(500)
        expect(data).toEqual({error: 'Hubo un error'})
    })

    it('should prevent unauthorized users from adding expenses', async () => {
        const req = createRequest({
            method: 'POST',
            url: '/api/budgets/:budgetId/expenses',
            budget: budgets[0],
            user: {id: 20},
            body: {name: 'Expense Test', amoun: 777}
        })
        const res = createResponse()
        const next = jest.fn()
        hasAccess(req, res, next)
        const data = res._getJSONData()
        expect(res.statusCode).toBe(401)
        expect(data).toEqual({error: 'Acción no válida para este usuario'})
        expect(next).not.toHaveBeenCalled()
    })
})
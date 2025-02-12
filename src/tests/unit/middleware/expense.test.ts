import {createRequest, createResponse} from "node-mocks-http"
import {validateExpenseExists} from "../../../middleware/expense"
import Expense from "../../../models/Expense"
import {expenses} from "../../mocks/expenses"

jest.mock('../../../models/Expense', () => ({
    findByPk: jest.fn() 
}))

describe('Expenses Middleware - validateExpenseExists', () => {
    it('should handle a non-existent expense', async () => {
        //(Expense.findByPk as jest.Mock).mockResolvedValue(null)
        (Expense.findByPk as jest.Mock).mockImplementation(id => {
            const expense = expenses.filter(e => e.id === id)[0] ?? null
            return Promise.resolve(expense)
        })
        const req = createRequest({
            params: {expenseId: 1}
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
})
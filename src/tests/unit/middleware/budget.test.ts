import {createRequest, createResponse} from 'node-mocks-http'
import {validateBudgetExists} from '../../../middleware/budget'
import Budget from '../../../models/Budget'

jest.mock('../../../models/Budget', () => ({
    findByPk: jest.fn()
}))


describe('budget - validateBudgetExists', () => {
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
})
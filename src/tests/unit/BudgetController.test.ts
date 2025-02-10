import {createRequest, createResponse} from 'node-mocks-http'
import {budgets} from "../mocks/budgets"
import {BudgetController} from '../../controllers/BudgetController'

describe('BudgetController.getAll', () => {
    it('should retrive 3 budgets', async () => {
        const req = createRequest({
            method: 'GET',
            url: '/api/budgets',
            user: {id: 1}
        })
        const res = createResponse() 
        await BudgetController.getAll(req, res)
        console.log(res._getJSONData)
        //console.log(res._getData) // Para estraer los datos de respuestas .send
    })
})
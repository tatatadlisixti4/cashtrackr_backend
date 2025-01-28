import {Router} from 'express'
import {body, param} from 'express-validator'
import {BudgetController} from '../controllers/BudgetController'
import {ExpensesController} from '../controllers/ExpenseController'
import {handleInputErrors} from '../middleware/validation'
import {validateBudgetExists, validateBudgetId, validateBudgetInput} from '../middleware/budget'

const router = Router()

/** Routes for budget */
router.param('budgetId', validateBudgetId)
router.param('budgetId', validateBudgetExists)
router.get('/', BudgetController.getAll)
router.post('/', 
    validateBudgetInput,
    handleInputErrors,
    BudgetController.create
)
router.get('/:budgetId', BudgetController.getById)
router.put('/:budgetId',
    validateBudgetInput,  
    handleInputErrors,
    BudgetController.updateById
)
router.delete('/:budgetId', BudgetController.deleteById)

/** Router for expenses */
router.get('/:budgetId/expenses', ExpensesController.getAll)
router.post('/:budgetId/expenses', ExpensesController.create)
router.get('/:budgetId/expenses/:expenseId', ExpensesController.getById)
router.put('/:budgetId/expenses/:expenseId', ExpensesController.updateById)
router.delete('/:budgetId/expenses/:expenseId', ExpensesController.deleteById)

export default router
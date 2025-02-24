import {Router} from 'express'
import {BudgetController} from '../controllers/BudgetController'
import {ExpensesController} from '../controllers/ExpenseController'
import {handleInputErrors} from '../middleware/validation'
import {hasAccess, validateBudgetExists, validateBudgetId, validateBudgetInput} from '../middleware/budget'
import {validateExpenseExists, validateExpenseId, validateExpenseInput} from '../middleware/expense'
import {authenticate} from '../middleware/auth'

const router = Router()
router.use(authenticate) // req.user

router.param('budgetId', validateBudgetId)
router.param('budgetId', validateBudgetExists) // req.budget
router.param('budgetId', hasAccess)

router.param('expenseId', validateExpenseId)
router.param('expenseId', validateExpenseExists)

/** Routes for budget */
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
router.post('/:budgetId/expenses', 
    validateExpenseInput,
    handleInputErrors,
    ExpensesController.create
)

router.get('/:budgetId/expenses/:expenseId', ExpensesController.getById)

router.put('/:budgetId/expenses/:expenseId', 
    validateExpenseInput,
    handleInputErrors,
    ExpensesController.updateById
)

router.delete('/:budgetId/expenses/:expenseId', ExpensesController.deleteById)

export default router
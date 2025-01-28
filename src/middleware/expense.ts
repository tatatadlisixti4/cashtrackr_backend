import type {Request, Response, NextFunction} from 'express'
import {validationResult, param, body} from 'express-validator'

export const validateExpenseInput = async (req: Request, res: Response, next: NextFunction) => {
    await body('name')
        .notEmpty().withMessage('El nombre del gasto no puede ir vacío')
        .run(req)
    await body('amount')
        .notEmpty().withMessage('La cantidad del gasto no puede ir vacía')
        .isNumeric().withMessage('Cantidad no válida')
        .custom(value =>  value > 0).withMessage('El gasto deber ser mayor a 0')
        .run(req) 
    next()
}

import type {Request, Response, NextFunction} from 'express'
import {validationResult, param} from 'express-validator'

export const validateBudgetId = async (req: Request, res: Response, next: NextFunction) => {
    await param('id')
        .isInt().withMessage('ID no válido')
        .custom(value =>  value > 0).withMessage('ID no válido')
        .run(req)
    let errors = validationResult(req)
    if (!errors.isEmpty()) {
        res.status(400).json({errors: errors.array()})
        return 
    }
    next()
}
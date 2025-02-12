import type {Request, Response} from 'express'
import Expense from '../models/Expense'

export class ExpensesController {
    static create = async (req: Request, res: Response) => {
        try {
            const expense = await Expense.create({
                ...req.body,
                budgetId: req.budget.id
            })
            res.status(201).json('Gasto agregado correctamente')
        } catch (error) {
            res.status(500).json({error: 'Hubo un error'})
        }
    }

    static getById = async (req: Request, res: Response) => {
        res.json(req.expense)
    }

    static updateById = async (req: Request, res: Response) => {
        const {expense} = req
        await expense.update(req.body)
        res.json('Gasto actualizado correctamente')
    }

    static deleteById = async (req: Request, res: Response) => {
        const {expense} = req
        await expense.destroy()
        res.json('Gasto eliminado correctamente')
    }
}
import type {Request, Response} from 'express'
import Budget from '../models/Budget'
import Expense from '../models/Expense'

export class BudgetController {
    static getAll = async (req: Request, res: Response) => {
        try {
            const budgets = await Budget.findAll({
                order: [
                    ['createdAt', 'DESC']
                ],
                where: {
                    userId : req.user.id
                }
            })
            res.json(budgets)
        } catch (error) {
            console.log(error)
            res.status(500).json({error: 'Hubo uin error'})
        }
    }

    static create = async (req: Request, res: Response) => {
        try {
            const budget = new Budget(req.body)
            budget.userId = req.user.id
            await budget.save()
            res.status(200).json('Presupuesto creado correctamente')
        } catch (error) {
            res.status(500).json({error: 'Hubo un errorsinho'})
        }
    }

    static getById = async (req: Request, res: Response) => {
        const budget = await Budget.findByPk(req.budget.id, {
            include: [Expense]
        })
        res.json(budget)
    }

    static updateById = async (req: Request, res: Response) => {
        const {budget} = req
        await budget.update(req.body)
        res.json('Presupuesto actualizado correctamente')
    }

    static deleteById = async (req: Request, res: Response) => {
        const {budget} = req
        await budget.destroy()
        res.json('Presupuesto eliminado correctamente')
    }
}
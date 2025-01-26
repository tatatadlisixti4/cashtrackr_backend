import type {Request, Response} from 'express'
import Budget from '../models/Budget'

export class BudgetController {
    static getAll = async (req: Request, res: Response) => {
        try {
            const budgets = await Budget.findAll({
                order: [
                    ['createdAt', 'DESC']
                ],
                // TODO: Filtrar por el usuario
            })
            res.json(budgets)
        } catch (error) {
            res.status(500).json({error: 'Hubo uin error'})
        }
    }

    static create = async (req: Request, res: Response) => {
        try {
            const budget = new Budget(req.body)
            await budget.save()
            res.status(200).json('Presupuesto creado correctamente')
        } catch (error) {
            res.status(500).json({error: 'Hubo un errorsinho'})
        }
    }

    static getById = async (req: Request, res: Response) => {
        res.json(req.budget)
    }

    static updateById = async (req: Request, res: Response) => {
        try {
            const {id} = req.params
            const budget = await Budget.findByPk(id)
            if(!budget) {
                const error = new Error('Presupuesto no existe')
                res.status(404).json({error: error.message})
                return
            }
            await budget.update(req.body)
            res.json('Presupuesto actualizado correctamente')
        } catch (error) {
            res.status(500).json({error: 'Hubo un error'})
        }
    }

    static deleteById = async (req: Request, res: Response) => {
        const {id} = req.params
        const budget = await Budget.findByPk(id)
        if(!budget) {
            const error = new Error('Presupuesto no existe')
            res.status(404).json({error: error.message})
            return
        }
        await budget.destroy()
        res.json('Presupuesto eliminado correctamente')
    }
}
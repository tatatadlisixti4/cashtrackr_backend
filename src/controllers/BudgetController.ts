import type {Request, Response} from 'express'
import Budget from '../models/Budget'

export class BudgetController {
    static getAll = async (req: Request, res: Response) => {
        console.log('oliwis getall get')
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
        console.log('oliwis create post')
        try {
            const budget = new Budget(req.body)
            await budget.save()
            res.status(200).json('Presupuesto creado correctamente')
        } catch (error) {
            // console.log(error)
            res.status(500).json({error: 'Hubo un errorsinho'})
        }
    }

    static getById = async (req: Request, res: Response) => {
        console.log('oliwis id getbyid get')
        const {id} = req.params
        console.log(id)
    }

    static updateById = async (req: Request, res: Response) => {
        console.log('oliwis id updatebyid put')
        const {id} = req.params
        console.log(id)
    }

    static deleteById = async (req: Request, res: Response) => {
        console.log('oliwis id deletebyid delete')
        const {id} = req.params
        console.log(id)
    }
}
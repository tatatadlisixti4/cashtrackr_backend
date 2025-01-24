import type {Request, Response} from 'express'

export class BudgetController {
    static getAll = async  (req: Request, res: Response) => {
        console.log('oliwis')
    }

    static create = async  (req: Request, res: Response) => {
        console.log('oliwis post')
    }

    static getById = async  (req: Request, res: Response) => {
        console.log('oliwis id')
        const {id} = req.params
        console.log(id)
    }

    static updateById = async  (req: Request, res: Response) => {
        console.log('oliwis id put')
        const {id} = req.params
        console.log(id)
    }

    static deleteById = async  (req: Request, res: Response) => {
        console.log('oliwis id delete')
        const {id} = req.params
        console.log(id)
    }
}
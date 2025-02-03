import type {Request, Response} from 'express'
import User from '../models/User'
import {hashPassword} from '../utils/auth'
import {generateToken} from '../utils/token'
import {AuthEmail} from '../emails/AuthEmail'

export class AuthController {
    static createAccount = async (req: Request, res: Response) => {
        const {email, password} = req.body
        const userExist = await User.findOne({where: {email}})
        
        if(userExist) {
            const error = new Error('El usuario ya existe')
            res.status(409).json({error: error.message})
            return
        }

        try {
            const user = new User(req.body)
            user.password = await hashPassword(password)
            user.token = generateToken()
            await user.save()
            await AuthEmail.sendConfirmationEmail({
                name: user.name,
                email: user.email,
                token: user.token
            })
            res.json('Usuario creado con éxito')
        } catch (error) {
            res.status(500).json({error: 'Hubo un error'})
        }
    }

    static confirmAccount = async (req: Request, res: Response) => {
        console.log('Desde confirmaccount')
    }
}


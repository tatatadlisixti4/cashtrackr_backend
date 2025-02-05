import type {Request, Response} from 'express'
import User from '../models/User'
import {checkPassword, hashPassword} from '../utils/auth'
import {generateToken} from '../utils/token'
import {AuthEmail} from '../emails/AuthEmail'
import {generateJWT} from '../utils/jwt'

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
        const {token} = req.body
        const user = await User.findOne({where: {token}})
        if(!user) {
            const error = new Error('Token no válido')
            res.status(401).json({error: error.message})
            return
        }
        user.confirmed = true 
        user.token = null
        await user.save()
        res.json("Cuenta confirmada correctamente")
    }

    static login = async (req: Request, res: Response) => {
        const {email, password} = req.body
        const user = await User.findOne({where: {email}})
        if(!user) {
            const error = new Error('Usuario no existe')
            res.status(409).json({error: error.message})
            return
        }
        if(!user.confirmed) {
            const error = new Error('La cuenta no ha sido confirmada')
            res.status(403).json({error: error.message})
            return
        }
        const isPasswordCorrect =  await checkPassword(password, user.password)
        if(!isPasswordCorrect) {
            const error = new Error('Password incorrecto')
            res.status(404).json({error: error.message})
            return
        }
        const token = generateJWT(user.id)
        res.json(token)
    }

    static forgotPassword = async (req: Request, res: Response) => {
        const {email} = req.body
        const user = await User.findOne({where: {email}})
        if(!user) {
            const error = new Error('Usuario no encontrado')
            res.status(404).json({error: error.message})
            return
        }
        user.token = generateToken()
        await user.save()
        await AuthEmail.sendPasswordResetToken({
            name: user.name, 
            email: user.email, 
            token: user.token
        })
        res.json('Revisa tu email y sigue las instrucciones')
    }

    static validateToken = async (req: Request, res: Response) => {
        const {token} = req.body
        const isTokenCorrect = await User.findOne({where: {token}})
        if(!isTokenCorrect) {
            const error = new Error('Token no válido')
            res.status(404).json({'error': error.message})
        }
        res.json('Token válido')
    }
}


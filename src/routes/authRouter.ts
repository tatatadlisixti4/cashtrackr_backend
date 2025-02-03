import {Router} from 'express'
import {body} from 'express-validator'
import {AuthController} from '../controllers/AuthController'
import {handleInputErrors} from '../middleware/validation'

const router = Router()

router.post('/create-account', 
    body('name')
        .notEmpty().withMessage('EL nombre no puede ir vacío'),
    body('password')
        .isLength({min: 8}).withMessage('El apssword es muy corto, son mínimo 8 caracteres'),
    body('email')
        .isEmail().withMessage('E-mail no válido'),
        handleInputErrors,
    AuthController.createAccount
)

router.post('/confirm-account', 
    body('token')
        .notEmpty().withMessage('El token no puede ir vacío')
        .isLength({min: 6, max: 6}).withMessage('Token no valido'),
        handleInputErrors,
    AuthController.confirmAccount
)
export default router
import {Router} from 'express'
import {body, param} from 'express-validator'
import {AuthController} from '../controllers/AuthController'
import {handleInputErrors} from '../middleware/validation'
import {limiter} from '../config/limiter'
import {authenticate} from '../middleware/auth'

const router = Router()

router.use(limiter)

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
        .isLength({min: 6, max: 6}).withMessage('Token no válido'),
        handleInputErrors,
    AuthController.confirmAccount
)

router.post('/login', 
    body('email')
        .isEmail().withMessage('Email no válido'),
    body('password')
        .notEmpty().withMessage('El password es obligatorio'),
    handleInputErrors,
    AuthController.login  
)

router.post('/forgot-password', 
    body('email')
        .isEmail().withMessage('Email no válido'),
    handleInputErrors,
    AuthController.forgotPassword
)

router.post('/validate-token', 
    body('token')
        .notEmpty().withMessage('El token no puede ir vacío')
        .isLength({min: 6, max:6}).withMessage('Token no válido'),
    handleInputErrors,
    AuthController.validateToken
)

router.post('/reset-password/:token',
    param('token')
        .notEmpty().withMessage('El token no puede ir vacío')
        .isLength({min: 6, max: 6}).withMessage('Token no válido'),
    body('password')
        .isLength({min: 8}).withMessage('El password es muy corto, son mínimo 8 caracteres'),
    handleInputErrors,
    AuthController.resetPasswordWithToken
)

router.get('/user', 
    authenticate,
    AuthController.user
)

router.post('/update-password', 
    authenticate, 
    body('current_password')
        .notEmpty().withMessage('El password no puede ir vacío'),
    body('password')
        .isLength({min: 8}).withMessage('El password es muy corto, son mínimo 8 caracteres'),
    handleInputErrors,
    AuthController.updateCurrentUserPassword
)

export default router
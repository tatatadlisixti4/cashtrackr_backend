import express from 'express' 
import colors from 'colors'
import morgan from 'morgan'
import {db} from './config/db'
import budgetRouter from './routes/budgetRouter'
import authRouter from './routes/authRouter'
import {limiter} from './config/limiter'

/** Creación y configuración del servidor */
export function server() {
    const app = express()

    // Middlewares
    app.use(morgan('dev'))
    app.use(express.json())
    app.use(limiter)

    // Rutas
    app.use('/api/budgets', budgetRouter)
    app.use('/api/auth', authRouter)

    // Ruta para el integration testing
    app.get('/', (req, res) => {
        res.send('Todo bien...')
    })

    console.log(process.env.NODE_ENV)
    // return app
}

/** Conexión DB e inicio del servidor */
export async function connectDB() {
    try {
        await db.authenticate()
        await db.sync()
        console.log(colors.blue.bold('Conexión exitosa a la BD'))
        
    } catch (error) {
        console.log(colors.red.bold('Falló la conexión a la BD'))
        process.exit(1)
    }
}

export async function disconnectDB() {
    await db.close()
}

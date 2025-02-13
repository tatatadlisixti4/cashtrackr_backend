import colors from 'colors'
import {server, connectDB} from './server'
/** Conexión a la DB */
connectDB()

/** Inicio del servidor */
const app = server()
const port = process.env.PORT || 4000
app.listen(port, () => {
    console.log( colors.cyan.bold( `REST API en el puerto ${port}`))
})

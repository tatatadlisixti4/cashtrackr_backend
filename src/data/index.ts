import {db} from "../config/db"
const clearData = async () => {
    try {
        await db.sync({force: true})
        console.log('Datos eliminados correctamente')
        process.exit(0) 
    } catch (error) { // Error en la operación no en al conexión
        process.exit(1) 
    } finally {
        await db.close()
        process.exit(0);
    }
}

if(process.argv[2] === '--clear') {
    clearData()
}
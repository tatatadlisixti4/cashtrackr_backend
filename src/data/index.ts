import {db} from "../config/db"
const clearData = async () => {
    try {
        await db.sync({force: true})
        console.log('Datos eliminados correctamente')
        process.exit(0) 
    } catch (error) {
        process.exit(1) 
    }
}
if(process.argv[2] === '--clear') {
    clearData()
}
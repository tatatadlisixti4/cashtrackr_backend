import {Sequelize} from 'sequelize-typescript'
import dotenv from 'dotenv'
dotenv.config()

let db: Sequelize

if(process.env.NODE_ENV === 'production') {
    db = new Sequelize(process.env.DATABASE_URL, {
        models: [__dirname + '/../models/**/*'],
        logging: false,
        dialectOptions: {
            ssl: {
                require: false
            }
        }
    })
} else {
    console.log('a');
    
    db = new Sequelize({
        username: process.env.DATABASE_USERNAME,
        password: process.env.DATABASE_PASSWORD,
        database: process.env.DATABASE_NAME,
        host: process.env.DATABASE_HOST,
        port: Number(process.env.DATABASE_PORT),
        models: [__dirname + '/../models/**/*'],
        logging: false,
        dialect: 'postgres',
        dialectOptions: {
            ssl: {
                require: true,
                rejectUnauthorized: false
            }
        }
    })
}

export default db


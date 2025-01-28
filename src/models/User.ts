import {Table, Column, Model, DataType, HasMany, Default, Unique, AllowNull} from 'sequelize-typescript'

@Table({
    tableName: 'user'
})

class User extends Model {
    @AllowNull(false)
    @Column({
        type: DataType.STRING(50)
    })
    declare name: string

    @AllowNull
    @Column({
        type: DataType.STRING(60)
    })
    declare password: string 

    @Unique(true)
    @AllowNull
    @Column({
        type: DataType.STRING(50)
    })
    declare email: string 

    @Column({
        type: DataType.STRING(6)
    })
    declare token: string 

    @Default(false)
    @Column({
        type: DataType.BOOLEAN
    })
    declare confirmed: string 
}
import { Column, DataType, Model, Table } from "sequelize-typescript";

interface UserCreationAttrs {
  username: string;
}

@Table({ tableName: 'users' })
export class User extends Model<User, UserCreationAttrs> {

  @Column({ type: DataType.INTEGER, unique: true, autoIncrement: true, primaryKey: true })
  id: number;

  @Column({ type: DataType.STRING, unique: true, allowNull: false })
  userName: string;

  @Column({ type: DataType.BOOLEAN, defaultValue: false })
  banned: boolean;
}

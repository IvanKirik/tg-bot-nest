import { Column, DataType, Model, Table } from "sequelize-typescript";

export type userType = 'admin' | 'user';
interface UserCreationAttrs {
  username: string;
  role: string;
}



@Table({ tableName: 'users' })
export class User extends Model<User, UserCreationAttrs> {

  @Column({ type: DataType.INTEGER, unique: true, autoIncrement: true, primaryKey: true })
  id: number;

  @Column({ type: DataType.STRING, allowNull: false, defaultValue: 'gpt-3.5-turbo' })
  chatModel: string;

  @Column({ type: DataType.STRING, unique: true, allowNull: false })
  userName: string;

  @Column({ type: DataType.BOOLEAN, defaultValue: false })
  banned: boolean;

  @Column({ type: DataType.STRING, allowNull: false })
  role: string;
}

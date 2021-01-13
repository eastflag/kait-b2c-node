import {Column, Entity, ManyToOne, PrimaryGeneratedColumn} from "typeorm";

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({length: 100})
  email: string;

  @Column({length: 100})
  password: string;
}
import {Column, Entity, OneToMany, PrimaryGeneratedColumn} from "typeorm";
import {Answer} from "./Answer";

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({length: 100})
  email: string;

  @Column({length: 100})
  password: string;

  @OneToMany(type => Answer, answer => answer.user)
  answers: Answer[];
}
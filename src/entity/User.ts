import {Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn} from "typeorm";
import {Question} from "./Question";
import {Answer} from "./Answer";

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({length: 100})
  email: string;

  @Column({length: 100})
  password: string;

  @OneToMany(type => Answer, answer => answer.category)
  answers: Answer[];
}
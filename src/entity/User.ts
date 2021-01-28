import {Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, Unique, UpdateDateColumn} from "typeorm";
import {Answer} from "./Answer";

@Entity()
@Unique(['email'])
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({length: 100})
  email: string;

  @Column({length: 100})
  password: string;

  @CreateDateColumn()
  created: Date;

  @UpdateDateColumn()
  updated: Date;

  @OneToMany(type => Answer, answer => answer.user)
  answers: Answer[];
}
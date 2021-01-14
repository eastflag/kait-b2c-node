import {
  CreateDateColumn,
  Entity,
  UpdateDateColumn,
  Column,
  PrimaryGeneratedColumn, ManyToOne
} from "typeorm";
import {User} from "./User";

@Entity()
export class Answer {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({length: 500})
  answer: string;

  @Column()
  question_id: number;

  @Column()
  score: boolean;

  @CreateDateColumn()
  created: Date;

  @UpdateDateColumn()
  updated: Date;

  @ManyToOne(type => User, user => user.answers, {onDelete: 'CASCADE', onUpdate: "CASCADE"})
  user: User;
}
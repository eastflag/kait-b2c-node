import {
  CreateDateColumn,
  Entity,
  UpdateDateColumn,
  Column,
  PrimaryGeneratedColumn, ManyToOne, Unique
} from "typeorm";
import {User} from "./User";

@Entity()
@Unique(['questionId', 'user'])
export class Answer {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({length: 500})
  answer: string;

  @Column()
  questionId: number;

  @Column()
  score: boolean;

  @CreateDateColumn()
  created: Date;

  @UpdateDateColumn()
  updated: Date;

  @ManyToOne(type => User, user => user.answers, {onDelete: 'CASCADE', onUpdate: "CASCADE"})
  user: User;
}
import {
  CreateDateColumn,
  Entity,
  UpdateDateColumn,
  PrimaryColumn,
  Column,
  OneToMany,
  PrimaryGeneratedColumn
} from "typeorm";
import {User} from "./User";
import {Question} from "./Question";

@Entity()
export class Category {
  @PrimaryGeneratedColumn()
  id: number;

  // 교재
  @Column({length: 100})
  textbook: string;

  // 학년과 학기
  @Column({length: 100})
  semester: string;

  // 단원
  @Column({length: 100, nullable: true})
  chapter: string;

  @CreateDateColumn()
  created: Date;

  @UpdateDateColumn()
  updated: Date;

  @OneToMany(type => Question, question => question.category)
  questions: Question[];
}
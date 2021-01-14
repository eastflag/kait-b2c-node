import {Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn} from "typeorm";
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

  // 페이지
  @Column()
  page_number: number;

  @CreateDateColumn()
  created: Date;

  @UpdateDateColumn()
  updated: Date;

  @OneToMany(type => Question, question => question.category)
  questions: Question[];
}
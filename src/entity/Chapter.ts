import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn
} from "typeorm";
import {Question} from "./Question";
import {Textbook} from "./Textbook";

@Entity()
export class Chapter {
  @PrimaryGeneratedColumn()
  id: number;

  // 단원 코드
  @Column({length: 100, nullable: true})
  code: string;

  // 단원명
  @Column({length: 100, nullable: true})
  name: string;

  @CreateDateColumn()
  created: Date;

  @UpdateDateColumn()
  updated: Date;

  @ManyToOne(type => Textbook, textbook => textbook.chapters)
  textbook: Textbook;

  @OneToMany(type => Question, question => question.chapter)
  questions: Question[];
}
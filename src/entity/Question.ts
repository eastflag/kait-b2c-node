import {Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn} from "typeorm";
import {Category} from "./Category";

@Entity()
export class Question {
  @PrimaryGeneratedColumn()
  id: number;

  // 정답 보기
  @Column({length: 100})
  example: string;

  // 라텍스 수식: 빈칸은 골뱅이
  @Column({length: 100})
  equation: string;

  @Column({length: 500, nullable: true})
  answer: string;

  @CreateDateColumn()
  created: Date;

  @UpdateDateColumn()
  updated: Date;

  @ManyToOne(type => Category, category => category.questions, {onDelete: 'CASCADE', onUpdate: "CASCADE"})
  category: Category;
}
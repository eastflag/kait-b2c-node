import {Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn} from "typeorm";
import {Chapter} from "./Chapter";

@Entity()
export class Question {
  @PrimaryGeneratedColumn()
  id: number;

  // 페이지
  @Column()
  page_number: number;

  // 항목명
  @Column({length: 20})
  name: string;

  // 정답 보기
  @Column({length: 100, default: ' '})
  examples: string;

  // 라텍스 수식: 빈칸은 골뱅이
  @Column({length: 500, default: ' '})
  equations: string;

  @Column({length: 100, nullable: true, default: ' '})
  answers: string;

  @CreateDateColumn()
  created: Date;

  @UpdateDateColumn()
  updated: Date;

  @ManyToOne(type => Chapter, chapter => chapter.questions, {onDelete: 'CASCADE', onUpdate: "CASCADE"})
  chapter: Chapter;
}
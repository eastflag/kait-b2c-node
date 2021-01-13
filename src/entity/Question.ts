import {CreateDateColumn, Entity, UpdateDateColumn, PrimaryColumn, Column, OneToMany} from "typeorm";
import {User} from "./User";

@Entity()
export class Question {
  @PrimaryColumn({length: 100})
  id: string;

  // 정답 보기
  @Column({length: 100})
  example: string;

  // 라텍스 수식: 빈칸은 골뱅이
  @Column({length: 100})
  equation: string;

  @Column({length: 500, nullable: true})
  answer: string;
}
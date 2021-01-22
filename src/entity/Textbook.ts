import {Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn} from "typeorm";
import {Chapter} from "./Chapter";

@Entity()
export class Textbook {
  @PrimaryGeneratedColumn()
  id: number;

  // 교재 코드
  @Column({length: 100})
  code: string;

  // 교재명
  @Column({length: 100})
  name: string;

  // 교재 이미지 주소
  @Column({length: 1024})
  image_url: string;

  // 학년과 학기
  @Column({length: 100})
  semester: string;

  @CreateDateColumn()
  created: Date;

  @UpdateDateColumn()
  updated: Date;

  @OneToMany(type => Chapter, chapter => chapter.textbook)
  chapters: Chapter[];
}
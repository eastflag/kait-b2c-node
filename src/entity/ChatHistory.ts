import {
  CreateDateColumn,
  Entity,
  Column,
  PrimaryGeneratedColumn,
} from "typeorm";

// 채팅 메시지 히스토리
@Entity("chat_history")
export class ChatHistory {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  questionId: number;

  @Column()
  userId: number;

  @Column()
  userName: string;

  @Column()
  roleName: string;

  @Column()
  msg: string;

  @Column()
  time: Date;
}
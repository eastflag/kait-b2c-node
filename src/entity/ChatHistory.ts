import {
  CreateDateColumn,
  Entity,
  Column,
  PrimaryGeneratedColumn,
} from "typeorm";

@Entity("chat_history")
export class ChatHistory {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  questionId: number;

  @Column()
  userId: number;

  @Column()
  message: string;

  @CreateDateColumn()
  created: Date;
}
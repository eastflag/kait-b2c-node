import {
  CreateDateColumn,
  Entity,
  UpdateDateColumn,
  Column,
  PrimaryGeneratedColumn, ManyToOne, Unique
} from "typeorm";
import {User} from "./User";

@Entity("channel_h")
export class ChannelHistory {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  userId: number;

  @Column()
  questionId: number;

  @Column({length: 100})
  type: string;

  @CreateDateColumn()
  created: Date;
}
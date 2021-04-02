import {Column, Entity, PrimaryGeneratedColumn,} from "typeorm";

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

  // text, image
  @Column({default: 'text'})
  type: string;

  @Column()
  msg: string;

  @Column()
  time: Date;

  // 선생님이 학생메시지에 대해서 답변을 안하고 완료 처리하기 위한 필드
  @Column({nullable: true})
  isClear: boolean;
}
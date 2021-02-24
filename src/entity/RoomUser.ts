import {Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, Unique, UpdateDateColumn} from "typeorm";

@Entity("room_user")
@Unique(['questionId', 'userId'])
export class RoomUser {
  @PrimaryGeneratedColumn()
  id: number;

  // 문항 정보 (방)
  @Column()
  questionId: number;

  @Column()
  questionName: string;

  // 참여자 정보
  @Column()
  userId: number;

  // 방 입장시 true, 나가기 버튼시 퇴장 처리
  @Column()
  isJoined: boolean;

  // 방을 떠날때 채팅 히스토리 마지막 아이디를 저장. 향후 읾음 확인을 위해서.
  @Column({nullable: true})
  chatHistoryId: number;

  // 읽음 여뷰
  @Column({nullable: true})
  isRead: boolean;

  // 방 참여 일자
  @CreateDateColumn()
  created: Date;

  @UpdateDateColumn()
  updated: Date;
}
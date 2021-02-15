import {Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn} from "typeorm";

@Entity("room_user")
export class RoomUser {
  @PrimaryGeneratedColumn()
  id: number;

  // 문항 정보
  @Column()
  questionId: number;

  // 참여자 정보
  @Column()
  userId: number;

  // 현재 방 조인 여부
  @Column()
  isJoined: boolean;

  // 방 참여 일자
  @CreateDateColumn()
  created: Date;

  @UpdateDateColumn()
  updated: Date;
}
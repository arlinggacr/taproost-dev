import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { UserRole } from "../entity";

@Entity({
  name: "users",
})
export class User {
  @PrimaryGeneratedColumn({
    name: "user_id",
  })
  userId: number;

  @Column({ length: 50 })
  name: string;

  @Column({ length: 50, nullable: true })
  email: string;

  @Column({
    length: 50,
    nullable: true,
  })
  username: string;

  @Column({
    nullable: true,
  })
  password: string;

  @Column({
    name: "otp_code",
    nullable: true,
  })
  otpCode?: string;

  @Column({
    name: "otp_expired_at",
    type: "timestamp",
    nullable: true,
  })
  otpExpiredAt?: Date;

  @Column({
    name: "is_verified",
    default: false,
  })
  isVerified: boolean;

  // one to many data
  @OneToMany(() => UserRole, (userRole) => userRole.user, {
    cascade: true,
  })
  userRole: UserRole[];

  @CreateDateColumn({
    name: "created_at",
    default: () => "CURRENT_TIMESTAMP",
  })
  createdAt: Date;

  @UpdateDateColumn({
    name: "updated_at",
    default: () => "CURRENT_TIMESTAMP",
    onUpdate: "CURRENT_TIMESTAMP",
  })
  updatedAt: Date;

  @DeleteDateColumn({
    name: "deleted_at",
  })
  deletedAt: Date;
}

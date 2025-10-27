import {
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { Role } from "../entity";
import { User } from "./user.entity";

@Entity({
  name: "user_roles",
})
export class UserRole {
  @PrimaryGeneratedColumn({
    name: "user_role_id",
  })
  userRoleId: number;

  @ManyToOne(() => User, (user) => user.userRole)
  @JoinColumn({
    name: "user_id",
  })
  user: User;

  @ManyToOne(() => Role, (role) => role.userRole)
  @JoinColumn({
    name: "role_id",
  })
  role: Role;

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

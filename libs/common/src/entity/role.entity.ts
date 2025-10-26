import { UserRole } from "@app/common/entity";
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";

export enum RoleEnum {
  SUPER_ADMIN = "SUPER_ADMIN",
  ADMIN = "ADMIN",
  USER = "USER",
}

@Entity({
  name: "roles",
})
export class Role {
  @PrimaryGeneratedColumn({
    name: "role_id",
  })
  roleId: number;

  @Column({
    name: "name",
  })
  name: string;

  @Column({
    name: "description",
    nullable: true,
  })
  description: string;

  @OneToMany(() => UserRole, (userRole) => userRole.role)
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

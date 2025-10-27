/* eslint-disable @typescript-eslint/no-unused-vars */
import { Injectable, Logger } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import * as bcrypt from "bcrypt";
import { Repository } from "typeorm";
import {
  Role,
  RoleEnum,
  User,
  UserRole,
} from "../../../../libs/common/src/entity/index";

@Injectable()
export class AuthRepository {
  private logger = new Logger(AuthRepository.name);

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Role)
    private readonly roleRepository: Repository<Role>,
    @InjectRepository(UserRole)
    private readonly userRoleRepository: Repository<UserRole>
  ) {}

  async findByUsernameOrEmail(
    username: string,
    email: string
  ): Promise<User | null> {
    return this.userRepository.findOne({
      select: ["userId", "name", "email", "username"],
      where: [{ email }, { username }],
      relations: ["userRole", "userRole.role"],
    });
  }

  async createUser(
    name: string,
    email: string,
    username: string,
    password: string,
    roles: RoleEnum[] = [RoleEnum.USER]
  ): Promise<User> {
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = this.userRepository.create({
      name,
      email,
      username,
      password: hashedPassword,
    });

    const savedUser = await this.userRepository.save(user);

    // Assign roles
    const roleEntities = await this.roleRepository.find({
      where: roles.map((role) => ({ name: role })),
    });

    const userRoles = roleEntities.map((role) =>
      this.userRoleRepository.create({
        user: savedUser,
        role,
      })
    );

    await this.userRoleRepository.save(userRoles);

    return this.userRepository.findOne({
      where: { userId: savedUser.userId },
      relations: ["userRole", "userRole.role"],
    });
  }

  async validateUser(email: string, password: string): Promise<User | null> {
    const user = await this.userRepository.findOne({
      where: [{ email }, { email: email }],
      select: ["userId", "name", "email", "username", "password"],
      relations: ["userRole", "userRole.role"],
    });

    if (user && (await bcrypt.compare(password, user.password))) {
      const { password, ...result } = user;
      return result as User;
    }
    return null;
  }

  async saveOtp(
    email: string,
    otpCode: string,
    expiresAt: Date
  ): Promise<void> {
    await this.userRepository.update(
      { email },
      { otpCode, otpExpiredAt: expiresAt }
    );
  }

  async verifyOtp(email: string, otp: string): Promise<boolean> {
    const user = await this.userRepository.findOne({ where: { email } });
    if (!user || user.otpCode !== otp || new Date() > user.otpExpiredAt)
      return false;

    await this.userRepository.update(
      { email },
      { isVerified: true, otpCode: null, otpExpiredAt: null }
    );
    return true;
  }

  async resendOtp(
    email: string,
    otpCode: string,
    expiresAt: Date
  ): Promise<void> {
    await this.userRepository.update(
      { email },
      { otpCode, otpExpiredAt: expiresAt }
    );
  }
}

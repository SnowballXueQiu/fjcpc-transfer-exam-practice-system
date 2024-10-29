// src/user/user.service

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../database/entities/user.entity';
import { UserSetting } from '../database/entities/user_setting.entity';
import { CryptoUtil } from '../common/crypto.util';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(UserSetting)
    private readonly userSettingRepository: Repository<UserSetting>,
    private readonly cryptoUtil: CryptoUtil,
  ) {}

  // 生成随机 Key
  private generateRandomKey(): string {
    return Array.from({ length: 8 }, () =>
      Math.floor(Math.random() * 16).toString(16),
    ).join('');
  }

  // 查找用户，仅根据身份证号查找
  async findByIdNumber(id_number: string): Promise<User | null> {
    const users = await this.userRepository.find();

    for (const user of users) {
      const [encryptedData, key] = user.id_number.split('$');
      const decryptedIdNumber = this.cryptoUtil.aesDecrypt(encryptedData, key);
      if (decryptedIdNumber === id_number) {
        return user;
      }
    }
    return null;
  }

  // 检查用户的密码是否正确
  async checkPassword(id_number: string, password: string): Promise<boolean> {
    const user = await this.findByIdNumber(id_number);

    if (!user) {
      return false;
    }

    const encryptedPassword = this.cryptoUtil.hashEncrypt(password);

    return user.password === encryptedPassword;
  }

  // 新增用户
  async createUser(
    id_number: string,
    name: string,
    password: string,
    school: string,
    profession: string,
    main_subject?: number,
  ): Promise<User> {
    const regDate = new Date();

    const key = this.generateRandomKey();

    const encryptedIdNumber = `${this.cryptoUtil.aesEncrypt(id_number, key)}$${key}`;
    const encryptedName = `${this.cryptoUtil.aesEncrypt(name, key)}$${key}`;
    const encryptedPassword = this.cryptoUtil.hashEncrypt(password);

    const newUser = this.userRepository.create({
      uuid: crypto.randomUUID(),
      id_number: encryptedIdNumber,
      name: encryptedName,
      password: encryptedPassword,
      school,
      profession,
      permission: 0,
      profession_main_subject: main_subject ?? -1,
      last_login: new Date(),
      reg_date: regDate,
    });

    return this.userRepository.save(newUser);
  }

  // 通过 UUID 查找用户
  async findUserByUuid(uuid: string): Promise<User | null> {
    return this.userRepository.findOne({ where: { uuid } });
  }

  // 更新用户权限级别
  async updateUserPermission(
    uuid: string,
    permissionLevel: number,
  ): Promise<User> {
    const user = await this.userRepository.findOne({ where: { uuid } });
    if (!user) {
      throw new Error('用户不存在');
    }

    user.permission = permissionLevel;
    return this.userRepository.save(user);
  }

  // 检查用户权限是否足够
  async checkUserPermission(
    uuid: string,
    requiredPermission: number,
  ): Promise<boolean> {
    const user = await this.findUserByUuid(uuid);
    if (!user) {
      throw new Error('用户不存在');
    }

    return user.permission >= requiredPermission;
  }

  // 返回用户设置模板
  async userSettingTemplate(uuid: string) {
    const user = await this.userRepository.findOne({
      where: { uuid: uuid },
    });

    const userMainProfessionSubject: number = user.profession_main_subject;

    return {
      user_main_profession_subject: userMainProfessionSubject, // 专业课科目
      auto_sync_data: true, // 自动同步数据
      auto_save_progress: true, // 自动更新进度
      auto_star_question: true, // 自动保存错题
      show_user_stat: true, // 允许向其他人展示做题进度
    };
  }
}

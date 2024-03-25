import { ApiProperty } from "@nestjs/swagger";
import { UserRole, UserStatus } from "../../constants";

export class UserDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  email: string; // email

  @ApiProperty()
  firstName: string;

  @ApiProperty()
  lastName: string;

  @ApiProperty()
  address?: string;

  @ApiProperty()
  city?: string;

  @ApiProperty()
  zipCode?: string;

  @ApiProperty()
  country?: string;

  @ApiProperty()
  phone?: string;

  @ApiProperty()
  description?: string;

  @ApiProperty({ description: "AWS S3 Key" })
  profileImage?: string;

  @ApiProperty({ type: () => UserRole })
  role: UserRole; // 帳號角色

  @ApiProperty({ type: () => UserStatus })
  status: UserStatus; // 帳號狀態

  @ApiProperty()
  hostPermission: number; // 帳號角色

  @ApiProperty()
  refreshToken: string;

  providerId?: string;

  provider?: string;

  @ApiProperty()
  createDate: Date;

  @ApiProperty()
  updateDate: Date;
}

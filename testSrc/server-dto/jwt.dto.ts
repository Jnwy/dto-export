import { ApiProperty } from "@nestjs/swagger";
import { UserDto } from "../user/user.dto";

export class JwtDto {
  @ApiProperty()
  access_token: string;

  @ApiProperty()
  expiresIn: number;

  @ApiProperty()
  refreshExpiresIn: number;

  @ApiProperty()
  refresh_token: string;

  @ApiProperty()
  status: number;

  @ApiProperty()
  success: boolean;

  @ApiProperty({ type: UserDto })
  userInfo: UserDto;
}

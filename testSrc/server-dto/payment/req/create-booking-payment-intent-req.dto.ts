import { ApiProperty } from "@nestjs/swagger";
import {
  ArrayNotEmpty,
  IsArray,
  IsDate,
  IsNumber,
  IsObject,
  IsOptional,
  IsString,
  ValidateNested,
} from "class-validator";

import { Type } from "class-transformer";
import { BookingTimeSectionDto } from "../../booking/booking-time-section.dto";

export class CreateBookingPaymentIntentReqDto {
  @ApiProperty()
  @IsString()
  poolId: string;

  @ApiProperty()
  @IsString()
  @ApiProperty()
  @IsString()
  poolSessionId: string;

  @ApiProperty({ type: [BookingTimeSectionDto] }) // 確保 Swagger 文檔顯示正確
  @IsArray()
  @ArrayNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => BookingTimeSectionDto)
  @IsOptional()
  bookingTimeSections: BookingTimeSectionDto[];

  @ApiProperty()
  @IsNumber()
  adultCount: number;

  @ApiProperty()
  @IsNumber()
  childrenCount: number;

  @ApiProperty()
  @IsNumber()
  infantCount: number;

  @ApiProperty()
  @IsNumber()
  petCount: number;

  @ApiProperty()
  @IsArray()
  amenityIds: string[];
}

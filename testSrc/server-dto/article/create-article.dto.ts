import { ApiProperty } from "@nestjs/swagger";
import { MediaDto } from "../media/media.dto";
import { IsOptional } from "class-validator";
import { ArticleDto } from "./article.dto";
import { PartialType } from "@nestjs/mapped-types";

export class CreateArticleDto extends PartialType(ArticleDto) {
  @ApiProperty({ type: String, example: "test" })
  @IsOptional()
  title: string;

  @ApiProperty({ type: String, example: "test" })
  @IsOptional()
  description?: string;

  @ApiProperty({ type: Number, example: 100 })
  @IsOptional()
  quote?: number;

  @ApiProperty({ type: [MediaDto], example: [] })
  @IsOptional()
  photos: MediaDto[];
}

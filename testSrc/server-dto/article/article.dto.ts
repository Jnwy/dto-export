import { ArticleStatus } from "../../constants";
import { MediaDto } from "../../dto";

export class ArticleDto {
  id: string;
  photos: MediaDto[];
  title: string;
  description?: string;
  sequence: number;
  quote?: number;
  createDate: Date;
  updateDate: Date;
}

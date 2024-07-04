import { PickType } from "@nestjs/mapped-types";
import { CreateDiscountDto } from "../create-discount.dto";

export class CreateDiscountReqDto extends PickType(CreateDiscountDto, [
  "code",
  "type",
  "value",
  "startDate",
  "endDate",
  "description",
] as const) {
  // Properties
  // Constructor
  // Methods
}

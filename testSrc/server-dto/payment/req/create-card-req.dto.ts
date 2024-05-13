import { Stripe } from "stripe";

export class CreateCardReqDto {
  userId: string;
  cardName: string;
  cardNumber: string;
  expMonth: number;
  expYear: number;
  cardCvc: string;
  type: Stripe.PaymentMethodCreateParams.Type;
}

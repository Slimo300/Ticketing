import { PaymentCreatedEvent, Publisher, Subjects } from "@ticketinglib/common";

export class PaymentCreatedPublisher extends Publisher<PaymentCreatedEvent> {
    subject: Subjects.PaymentCreated = Subjects.PaymentCreated;
}
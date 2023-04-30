import { Publisher, OrderCancelledEvent, Subjects } from "@ticketinglib/common";

export class OrderCancelledPublisher extends Publisher<OrderCancelledEvent> {
    subject: Subjects.OrderCancelled = Subjects.OrderCancelled;
}
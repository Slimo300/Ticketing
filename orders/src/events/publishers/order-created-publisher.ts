import { Publisher, OrderCreatedEvent, Subjects } from "@ticketinglib/common";

export class OrderCreatedPublisher extends Publisher<OrderCreatedEvent> {
    subject: Subjects.OrderCreated = Subjects.OrderCreated;
}
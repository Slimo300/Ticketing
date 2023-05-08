import { Publisher, Subjects, TicketUpdatedEvent } from "@ticketinglib/common";

export class TicketUpdatedPublisher extends Publisher<TicketUpdatedEvent> {
    subject: Subjects.TicketUpdated = Subjects.TicketUpdated;    
}
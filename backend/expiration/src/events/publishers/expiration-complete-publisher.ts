import { ExpirationCompleteEvent, Publisher, Subjects } from "@ticketinglib/common";

export class ExpirationCompletePublisher extends Publisher<ExpirationCompleteEvent> {
    subject: Subjects.ExpirationComplete = Subjects.ExpirationComplete;
}


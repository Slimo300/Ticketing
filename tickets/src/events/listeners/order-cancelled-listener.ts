import { OrderCancelledEvent, Subjects, Listener } from "@ticketinglib/common";
import { queueGroupName } from "./queue-group-name";
import { Message } from "node-nats-streaming";
import { Ticket } from "../../models/Ticket";
import { TicketUpdatedPublisher } from "../publishers/ticket-updated-publisher";

export class OrderCancelledListener extends Listener<OrderCancelledEvent> {
    subject: Subjects.OrderCancelled = Subjects.OrderCancelled;
    queueGroupName = queueGroupName;

    async onMessage(data: OrderCancelledEvent["data"], msg: Message) {
                // Find the ticket that the order is reserving
                const ticket = await Ticket.findById(data.ticket.id);
        
                // If no ticket, throw error
                if(!ticket) {
                    throw new Error("Ticket not found");
                }
        
                // Mark the ticket as being reserved
                ticket.set({orderId: undefined});
                await ticket.save();

                await new TicketUpdatedPublisher(this.client).publish({
                    id: ticket.id,
                    orderId: ticket.orderId,
                    version: ticket.version,
                    price: ticket.price,
                    title: ticket.title,
                    userId: ticket.userId
                });

                msg.ack();
    }
}
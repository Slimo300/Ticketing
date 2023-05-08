import { natsWrapper } from "../../../nats-wrapper";
import { ExpirationCompleteListener } from "../expiration-complete-listener";
import { Order, OrderStatus } from "../../../models/Order";
import { Ticket } from "../../../models/Ticket";
import mongoose from "mongoose";
import { ExpirationCompleteEvent } from "@ticketinglib/common";

const setup = async () => {
    const listener = new ExpirationCompleteListener(natsWrapper.client);

    const ticket = Ticket.build({
        id: new mongoose.Types.ObjectId().toHexString(),
        title: "concert",
        price: 20
    });

    await ticket.save();

    const order = Order.build({
        status: OrderStatus.Created,
        userId: "someid",
        expiresAt: new Date(),
        ticket
    });

    await order.save();

    const data: ExpirationCompleteEvent["data"] = {
        orderId: order.id,
    }

    // @ts-ignore
    const msg: Message = {
        ack: jest.fn(),
    }

    return {listener, order, ticket, data, msg};

}

it("updates the order status to cancelled", async () => {
    const { listener, order, data, msg} = await setup();
    await listener.onMessage(data, msg);

    const updatedOrder = await Order.findById(order.id);
    expect(updatedOrder!.status).toEqual(OrderStatus.Cancelled);
});

it("emits an OrderCancelled event", async () => {
    const { listener, order, data, msg} = await setup();
    await listener.onMessage(data, msg);

    const eventData = JSON.parse((natsWrapper.client.publish as jest.Mock).mock.calls[0][1]);
    expect(eventData.id).toEqual(order.id);
});

it("ack the message", async () => {
    const { listener, data, msg} = await setup();
    await listener.onMessage(data, msg);

    expect(msg.ack).toHaveBeenCalled();
});
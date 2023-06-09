import request from "supertest";

import {app} from "../../app";
import { Ticket } from "../../models/Ticket";
import {Order, OrderStatus } from "../../models/Order";

import { natsWrapper } from "../../nats-wrapper";
import mongoose from "mongoose";

it("marks an order as cancelled", async () => {
    // create a ticket
    const ticket = Ticket.build({
        title: "concert",
        price: 20,
        id: new mongoose.Types.ObjectId().toHexString()
    })
    await ticket.save();

    const user = global.signup();
    // make a request to create an order
    const {body: order} = await request(app)
        .post("/api/orders")
        .set("Cookie", user)
        .send({ticketId: ticket.id})
        .expect(201);

    // make a request to cancel the order
    await request(app)
        .patch(`/api/orders/${order.id}`)
        .set("Cookie", user)
        .send()
        .expect(200);

    // expect to see it cancelled
    const updatedOrder = await Order.findById(order.id);

    expect(updatedOrder!.status).toEqual(OrderStatus.Cancelled);
});

it("emits order on cancelled event", async () => {
    const ticket = Ticket.build({
        title: "concert",
        price: 20,
        id: new mongoose.Types.ObjectId().toHexString()
    });
    await ticket.save();

    const user = global.signup();

    const {body: order} = await request(app)
        .post("/api/orders")
        .set("Cookie", user)
        .send({ ticketId: ticket.id})
        .expect(201);

    await request(app)
        .patch(`/api/orders/${order.id}`)
        .set("Cookie", user)
        .send()
        .expect(200)

    expect(natsWrapper.client.publish).toHaveBeenCalledTimes(2);
});
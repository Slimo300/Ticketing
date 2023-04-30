import express, {Request, Response} from "express";

import { Order } from "../models/Order";
import { NotAuthorizedError, NotFoundError, OrderStatus, requireAuth } from "@ticketinglib/common";
import { OrderCancelledPublisher } from "../events/publishers/order-cancelled-publisher";
import { natsWrapper } from "../nats-wrapper";

const router = express.Router();

router.patch("/api/orders/:orderId", requireAuth, async (req: Request, res: Response) => {
    
    // finds an order
    const order = await Order.findById(req.params.orderId).populate("ticket");
    if (!order) {
        throw new NotFoundError();
    }

    // checks if user is the owner
    if (order.userId !== req.currentUser!.id) {
        throw new NotAuthorizedError();
    }

    order.status = OrderStatus.Cancelled;
    await order.save();

    new OrderCancelledPublisher(natsWrapper.client).publish({
        id: order.id,
        ticket: {
            id: order.ticket.id
        }
    })

    res.status(200).send(order);

})

export {router as deleteOrderRouter};
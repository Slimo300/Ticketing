import { OrderCreatedListener } from "./events/listeners/order-created-listener";
import { natsWrapper } from "./nats-wrapper";

const start = async () => {
    if (!process.env.REDIS_HOST) {
        throw new Error("REDIS_HOST not defined")
    }
    if (!process.env.NATS_CLIENT_ID) {
        throw new Error("NATS_CLIENT_ID not defined");
    }
    if (!process.env.NATS_CLUSTER_ID) {
        throw new Error("NATS_CLUSTER_ID not defined");
    }
    if (!process.env.NATS_URL) {
        throw new Error("NATS_URL not defined");
    }

    try {
        await natsWrapper.connect(
            process.env.NATS_CLUSTER_ID, 
            process.env.NATS_CLIENT_ID, 
            process.env.NATS_URL)

        natsWrapper.client.on("close", () => {
            console.log("NATS connection closed!");
            process.exit();
        })

        process.on("SIGINT", () => natsWrapper.client.close());
        process.on("SIGTERM", () => natsWrapper.client.close());

        new OrderCreatedListener(natsWrapper.client).listen();

    } catch(err) {
        console.log(err);
    }

}

start();
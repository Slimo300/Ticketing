import { Ticket } from "../Ticket";

it("implements optimistic concurrency control", async () => {
    // Create an instance of a ticket
    const ticket = Ticket.build({
        title: "concert",
        price: 5,
        userId: "123"
    });

    // Save the ticket
    await ticket.save();

    // fetch the ticket twice
    const firstInstance = await Ticket.findById(ticket.id);
    const secondInstance = await Ticket.findById(ticket.id);

    // make two separate changes to tickets
    firstInstance!.set({price: 10});
    secondInstance!.set({price: 15});

    // save the first ticket
    await firstInstance!.save();

    // save the second ticket and expect an error

    try {
        await secondInstance!.save();
    } catch(err) {
        return;
    }

    throw new Error("Should not reach this point");

});

it("increments the version number on multiple saves", async () => {
        const ticket = Ticket.build({
            title: "concert",
            price: 5,
            userId: "123"
        });
    
        await ticket.save();
        expect(ticket.version).toEqual(0);
        await ticket.save();
        expect(ticket.version).toEqual(1);
        await ticket.save();
        expect(ticket.version).toEqual(2);

})
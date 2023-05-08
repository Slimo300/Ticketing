import request from "supertest";

import { app } from "../../app";

it("returns a 200 on successful signin", async () => {
    await request(app)
        .post("/api/users/signup")
        .send({
            email: "test@test.com",
            password: "password"
        })
        .expect(201);

    await request(app)
        .post("/api/users/signin")
        .send({
            email: "test@test.com",
            password: "password"
        })
        .expect(200);
});

it("returns a 400 on validation error", async () => {
    await global.signup();

    await request(app)
        .post("/api/users/signin")
        .send({
            email: "testtest.com",
            password: "password"
        })
        .expect(400);

    await request(app)
        .post("/api/users/signin")
        .send({
            email: "test@test.com",
            password: ""
        })
        .expect(400);
});

it("fails when a email that does not exist is supplied",async () => {
    await request(app)
        .post("/api/users/signin")
        .send({
            email: "test@test.com",
            password: "password"
        })
        .expect(400);
})


it("fails when incorrect password is supplied",async () => {
    await global.signup();

    await request(app)
        .post("/api/users/signin")
        .send({
            email: "test@test.com",
            password: "passworf"
        })
        .expect(400);

})

it("fails when incorrect password is supplied",async () => {
    await global.signup();

    let response = await request(app)
        .post("/api/users/signin")
        .send({
            email: "test@test.com",
            password: "password"
        })
        .expect(200);

    expect(response.get("Set-Cookie")).toBeDefined();

})

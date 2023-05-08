import request from "supertest";

import { app } from "../../app";

it("responds with details about the current user", async () => {
    const cookie = await global.signup();

    const response = await request(app)
        .get("/api/users/currentuser")
        .set("Cookie", cookie)
        .send()
        .expect(200);

    expect(response.body.email).toEqual("test@test.com");
});

it("responds with undefined if not authenticated", async () => {
    const cookie = await global.signup();

    const response = await request(app)
        .get("/api/users/currentuser")
        .send()
        .expect(200);

    expect(response.body.email).toEqual(undefined);
});
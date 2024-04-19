import { it, describe, expect } from "vitest";
import request from "supertest";
import { app } from "../app";

// je décris sur quel endpoint je tape
describe("GET /trips/98434ac3-1d75-41a0-aecb-07cf425b5a72", () => {
  // on décrit ensuite ce qu'on teste
  it("responds with the correct JSON data", async () => {
    const response = await request(app)
        .get("/v1/trips/98434ac3-1d75-41a0-aecb-07cf425b5a72")
        .expect("Content-Type", "application/json; charset=utf-8")
        
        expect('id' in response.body,'id is in the response').toEqual(true)
        expect('prompt' in response.body,'prompt is in the response').toEqual(true)
        expect('output' in response.body,'output is in the response').toEqual(true)


  });
});

// je décris sur quel endpoint je tape
describe("GET /v1/trips/12345", () => {
    // on décrit ensuite ce qu'on teste
    it("returns a 404 if product does not exist", () => {
      return request(app)
        .get("/v1/trips/12345")
        .expect("Content-Type", "application/json; charset=utf-8")
        .expect(404);
    });
  });
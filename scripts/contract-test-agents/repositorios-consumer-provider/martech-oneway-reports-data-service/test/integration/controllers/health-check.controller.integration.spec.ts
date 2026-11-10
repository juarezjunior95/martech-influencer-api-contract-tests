import { Test, TestingModule } from "@nestjs/testing";
import { INestApplication, HttpStatus } from "@nestjs/common";
import request from "supertest";
import { AppModule } from "../../../src/app.module";

/**
 * Integration tests for HealthController
 * Tests the health check endpoints with real NestJS application context
 */
describe("HealthController (Integration)", () => {
  let app: INestApplication;
  let moduleFixture: TestingModule;

  beforeAll(async () => {
    moduleFixture = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    if (app) {
      await app.close();
    }
  });

  describe("GET /actuator/health/liveness", () => {
    it("should return status UP when application is alive", async () => {
      const response = await request(app.getHttpServer())
        .get("/actuator/health/liveness")
        .expect(HttpStatus.OK);

      expect(response.body).toHaveProperty("status");
      expect(response.body.status).toBe("ok");
      expect(response.body).toHaveProperty("info");
      expect(response.body).toHaveProperty("details");
    });

    it("should return valid health check structure", async () => {
      const response = await request(app.getHttpServer())
        .get("/actuator/health/liveness")
        .expect(HttpStatus.OK);

      expect(response.body).toMatchObject({
        status: expect.any(String),
        info: expect.any(Object),
        error: expect.any(Object),
        details: expect.any(Object),
      });
    });

    it("should respond quickly (performance check)", async () => {
      const startTime = Date.now();

      await request(app.getHttpServer())
        .get("/actuator/health/liveness")
        .expect(HttpStatus.OK);

      const duration = Date.now() - startTime;
      expect(duration).toBeLessThan(1000); // Should respond within 1 second
    });
  });

  describe("GET /actuator/health/readiness", () => {
    it("should return status UP when application is ready", async () => {
      const response = await request(app.getHttpServer())
        .get("/actuator/health/readiness")
        .expect(HttpStatus.OK);

      expect(response.body).toHaveProperty("status");
      expect(response.body.status).toBe("ok");
    });

    it("should include readiness indicator", async () => {
      const response = await request(app.getHttpServer())
        .get("/actuator/health/readiness")
        .expect(HttpStatus.OK);

      expect(response.body.details).toHaveProperty("readiness");
      expect(response.body.details.readiness).toMatchObject({
        status: "up",
      });
    });

    it("should return valid JSON response", async () => {
      const response = await request(app.getHttpServer())
        .get("/actuator/health/readiness")
        .set("Accept", "application/json")
        .expect(HttpStatus.OK)
        .expect("Content-Type", /json/);

      expect(response.body).toBeDefined();
      expect(typeof response.body).toBe("object");
    });

    it("should handle multiple concurrent requests", async () => {
      const requests = Array(3)
        .fill(null)
        .map(() =>
          request(app.getHttpServer())
            .get("/actuator/health/readiness")
            .expect(HttpStatus.OK),
        );

      const responses = await Promise.all(requests);

      responses.forEach((response) => {
        expect(response.body.status).toBe("ok");
      });
    });
  });

  describe("Health endpoints availability", () => {
    it("should handle invalid health routes with 404", async () => {
      await request(app.getHttpServer())
        .get("/actuator/health/invalid")
        .expect(HttpStatus.NOT_FOUND);
    });

    it("should not allow POST requests on liveness", async () => {
      await request(app.getHttpServer())
        .post("/actuator/health/liveness")
        .expect(HttpStatus.NOT_FOUND);
    });

    it("should not allow POST requests on readiness", async () => {
      await request(app.getHttpServer())
        .post("/actuator/health/readiness")
        .expect(HttpStatus.NOT_FOUND);
    });
  });
});

import { Test, TestingModule } from "@nestjs/testing";
import { RedisClient } from "@infrastructure/services/redis.client";
import { Logger } from "@nestjs/common";

// Mock Redis client
const mockRedisClient = {
  status: "ready",
  set: jest.fn(),
  get: jest.fn(),
  del: jest.fn(),
  sadd: jest.fn(),
  smembers: jest.fn(),
};

describe("RedisClient", () => {
  let service: RedisClient;
  let module: TestingModule;

  beforeEach(async () => {
    jest.clearAllMocks();
    mockRedisClient.status = "ready";

    module = await Test.createTestingModule({
      providers: [
        RedisClient,
        {
          provide: "REDIS_CLIENT",
          useValue: mockRedisClient,
        },
      ],
    }).compile();

    service = module.get<RedisClient>(RedisClient);
    jest.spyOn(Logger.prototype, "error").mockImplementation(() => undefined);
  });

  afterEach(async () => {
    jest.clearAllMocks();
    await module.close();
  });

  describe("constructor", () => {
    it("should be defined", () => {
      expect(service).toBeDefined();
    });

    it("should inject REDIS_CLIENT", () => {
      expect(service).toBeInstanceOf(RedisClient);
    });
  });

  describe("isOffline", () => {
    it("should return false when status is ready", () => {
      mockRedisClient.status = "ready";
      const result = service.isOffline();
      expect(result).toBe(false);
    });

    it("should return false when status is connect", () => {
      mockRedisClient.status = "connect";
      const result = service.isOffline();
      expect(result).toBe(false);
    });

    it("should return true when status is offline", () => {
      mockRedisClient.status = "offline";
      const result = service.isOffline();
      expect(result).toBe(true);
    });

    it("should return true when status is end", () => {
      mockRedisClient.status = "end";
      const result = service.isOffline();
      expect(result).toBe(true);
    });

    it("should return true when status is reconnecting", () => {
      mockRedisClient.status = "reconnecting";
      const result = service.isOffline();
      expect(result).toBe(true);
    });

    it("should return true when status is connecting", () => {
      mockRedisClient.status = "connecting";
      const result = service.isOffline();
      expect(result).toBe(true);
    });
  });

  describe("set", () => {
    it("should set a key-value pair with default TTL", async () => {
      mockRedisClient.set.mockResolvedValue("OK");

      const result = await service.set("testKey", "testValue");

      expect(mockRedisClient.set).toHaveBeenCalledWith(
        "testKey",
        "testValue",
        "EX",
        2592000,
      );
      expect(result).toBe("OK");
    });

    it("should set a key-value pair with custom TTL", async () => {
      mockRedisClient.set.mockResolvedValue("OK");

      const result = await service.set("testKey", "testValue", 7200);

      expect(mockRedisClient.set).toHaveBeenCalledWith(
        "testKey",
        "testValue",
        "EX",
        7200,
      );
      expect(result).toBe("OK");
    });

    it("should set a key-value pair with tags", async () => {
      mockRedisClient.set.mockResolvedValue("OK");
      mockRedisClient.sadd.mockResolvedValue(1);

      const result = await service.set("testKey", "testValue", 3600, [
        "tag1",
        "tag2",
      ]);

      expect(mockRedisClient.set).toHaveBeenCalledWith(
        "testKey",
        "testValue",
        "EX",
        3600,
      );
      expect(mockRedisClient.sadd).toHaveBeenCalledTimes(2);
      expect(mockRedisClient.sadd).toHaveBeenCalledWith("tag1", "testKey");
      expect(mockRedisClient.sadd).toHaveBeenCalledWith("tag2", "testKey");
      expect(result).toBe("OK");
    });

    it("should set a key-value pair without tags when empty array provided", async () => {
      mockRedisClient.set.mockResolvedValue("OK");

      const result = await service.set("testKey", "testValue", 3600, []);

      expect(mockRedisClient.set).toHaveBeenCalledWith(
        "testKey",
        "testValue",
        "EX",
        3600,
      );
      expect(mockRedisClient.sadd).not.toHaveBeenCalled();
      expect(result).toBe("OK");
    });

    it("should throw error when set fails", async () => {
      const error = new Error("Redis set error");
      mockRedisClient.set.mockRejectedValue(error);

      await expect(service.set("testKey", "testValue")).rejects.toThrow(
        "Redis set error",
      );
    });

    it("should throw error when sadd fails", async () => {
      mockRedisClient.set.mockResolvedValue("OK");
      const error = new Error("Redis sadd error");
      mockRedisClient.sadd.mockRejectedValue(error);

      await expect(
        service.set("testKey", "testValue", 3600, ["tag1"]),
      ).rejects.toThrow("Redis sadd error");
    });

    it("should handle empty string key", async () => {
      mockRedisClient.set.mockResolvedValue("OK");

      const result = await service.set("", "testValue");

      expect(mockRedisClient.set).toHaveBeenCalledWith(
        "",
        "testValue",
        "EX",
        2592000,
      );
      expect(result).toBe("OK");
    });

    it("should handle empty string value", async () => {
      mockRedisClient.set.mockResolvedValue("OK");

      const result = await service.set("testKey", "");

      expect(mockRedisClient.set).toHaveBeenCalledWith(
        "testKey",
        "",
        "EX",
        2592000,
      );
      expect(result).toBe("OK");
    });

    it("should handle TTL of 0", async () => {
      mockRedisClient.set.mockResolvedValue("OK");

      const result = await service.set("testKey", "testValue", 0);

      expect(mockRedisClient.set).toHaveBeenCalledWith(
        "testKey",
        "testValue",
        "EX",
        0,
      );
      expect(result).toBe("OK");
    });

    it("should handle special characters in key", async () => {
      mockRedisClient.set.mockResolvedValue("OK");

      const result = await service.set("test:key:123", "testValue");

      expect(mockRedisClient.set).toHaveBeenCalledWith(
        "test:key:123",
        "testValue",
        "EX",
        2592000,
      );
      expect(result).toBe("OK");
    });

    it("should handle multiple tags in order", async () => {
      mockRedisClient.set.mockResolvedValue("OK");
      mockRedisClient.sadd.mockResolvedValue(1);

      await service.set("testKey", "testValue", 3600, ["tag1", "tag2", "tag3"]);

      expect(mockRedisClient.sadd).toHaveBeenCalledTimes(3);
      const calls = mockRedisClient.sadd.mock.calls;
      expect(calls[0][0]).toBe("tag1");
      expect(calls[1][0]).toBe("tag2");
      expect(calls[2][0]).toBe("tag3");
    });
  });

  describe("get", () => {
    it("should get a value by key", async () => {
      mockRedisClient.get.mockResolvedValue("testValue");

      const result = await service.get("testKey");

      expect(mockRedisClient.get).toHaveBeenCalledWith("testKey");
      expect(result).toBe("testValue");
    });

    it("should return null if key does not exist", async () => {
      mockRedisClient.get.mockResolvedValue(null);

      const result = await service.get("nonexistentKey");

      expect(mockRedisClient.get).toHaveBeenCalledWith("nonexistentKey");
      expect(result).toBeNull();
    });

    it("should throw error when get fails", async () => {
      const error = new Error("Redis get error");
      mockRedisClient.get.mockRejectedValue(error);

      await expect(service.get("testKey")).rejects.toThrow("Redis get error");
    });

    it("should handle empty string key", async () => {
      mockRedisClient.get.mockResolvedValue("testValue");

      const result = await service.get("");

      expect(mockRedisClient.get).toHaveBeenCalledWith("");
      expect(result).toBe("testValue");
    });

    it("should handle special characters in key", async () => {
      mockRedisClient.get.mockResolvedValue("testValue");

      const result = await service.get("test:key:123");

      expect(mockRedisClient.get).toHaveBeenCalledWith("test:key:123");
      expect(result).toBe("testValue");
    });

    it("should return empty string value", async () => {
      mockRedisClient.get.mockResolvedValue("");

      const result = await service.get("testKey");

      expect(result).toBe("");
    });
  });

  describe("delete", () => {
    it("should delete a key", async () => {
      mockRedisClient.del.mockResolvedValue(1);

      const result = await service.delete("testKey");

      expect(mockRedisClient.del).toHaveBeenCalledWith("testKey");
      expect(result).toBe(1);
    });

    it("should return 0 if key does not exist", async () => {
      mockRedisClient.del.mockResolvedValue(0);

      const result = await service.delete("nonexistentKey");

      expect(mockRedisClient.del).toHaveBeenCalledWith("nonexistentKey");
      expect(result).toBe(0);
    });

    it("should throw error when delete fails", async () => {
      const error = new Error("Redis delete error");
      mockRedisClient.del.mockRejectedValue(error);

      await expect(service.delete("testKey")).rejects.toThrow(
        "Redis delete error",
      );
    });

    it("should handle empty string key", async () => {
      mockRedisClient.del.mockResolvedValue(0);

      const result = await service.delete("");

      expect(mockRedisClient.del).toHaveBeenCalledWith("");
      expect(result).toBe(0);
    });

    it("should handle special characters in key", async () => {
      mockRedisClient.del.mockResolvedValue(1);

      const result = await service.delete("test:key:123");

      expect(mockRedisClient.del).toHaveBeenCalledWith("test:key:123");
      expect(result).toBe(1);
    });
  });

  describe("invalidateByTags", () => {
    it("should invalidate single tag with single cache key", async () => {
      mockRedisClient.smembers.mockResolvedValue(["key1"]);
      mockRedisClient.del.mockResolvedValue(1);

      const result = await service.invalidateByTags(["tag1"]);

      expect(mockRedisClient.smembers).toHaveBeenCalledWith("tag1");
      expect(mockRedisClient.del).toHaveBeenCalledTimes(2); // key1 + tag1
      expect(result).toBe(1);
    });

    it("should invalidate single tag with multiple cache keys", async () => {
      mockRedisClient.smembers.mockResolvedValue(["key1", "key2", "key3"]);
      mockRedisClient.del.mockResolvedValue(1);

      const result = await service.invalidateByTags(["tag1"]);

      expect(mockRedisClient.smembers).toHaveBeenCalledWith("tag1");
      expect(mockRedisClient.del).toHaveBeenCalledTimes(4); // 3 keys + 1 tag
      expect(mockRedisClient.del).toHaveBeenCalledWith("key1");
      expect(mockRedisClient.del).toHaveBeenCalledWith("key2");
      expect(mockRedisClient.del).toHaveBeenCalledWith("key3");
      expect(mockRedisClient.del).toHaveBeenCalledWith("tag1");
      expect(result).toBe(3);
    });

    it("should invalidate multiple tags", async () => {
      mockRedisClient.smembers.mockResolvedValueOnce(["key1", "key2"]);
      mockRedisClient.smembers.mockResolvedValueOnce(["key3"]);
      mockRedisClient.del.mockResolvedValue(1);

      const result = await service.invalidateByTags(["tag1", "tag2"]);

      expect(mockRedisClient.smembers).toHaveBeenCalledTimes(2);
      expect(mockRedisClient.smembers).toHaveBeenCalledWith("tag1");
      expect(mockRedisClient.smembers).toHaveBeenCalledWith("tag2");
      expect(mockRedisClient.del).toHaveBeenCalledTimes(5); // 2 + 1 keys + 2 tags
      expect(result).toBe(3);
    });

    it("should handle tag with no cache keys", async () => {
      mockRedisClient.smembers.mockResolvedValue([]);
      mockRedisClient.del.mockResolvedValue(1);

      const result = await service.invalidateByTags(["tag1"]);

      expect(mockRedisClient.smembers).toHaveBeenCalledWith("tag1");
      // When no cache keys exist, tag deletion is skipped
      expect(mockRedisClient.del).not.toHaveBeenCalled();
      expect(result).toBe(0);
    });

    it("should handle empty tags array", async () => {
      const result = await service.invalidateByTags([]);

      expect(mockRedisClient.smembers).not.toHaveBeenCalled();
      expect(mockRedisClient.del).not.toHaveBeenCalled();
      expect(result).toBe(0);
    });

    it("should throw error when smembers fails", async () => {
      const error = new Error("Redis smembers error");
      mockRedisClient.smembers.mockRejectedValue(error);

      await expect(service.invalidateByTags(["tag1"])).rejects.toThrow(
        "Redis smembers error",
      );
    });

    it("should throw error when del fails", async () => {
      mockRedisClient.smembers.mockResolvedValue(["key1"]);
      const error = new Error("Redis del error");
      mockRedisClient.del.mockRejectedValue(error);

      await expect(service.invalidateByTags(["tag1"])).rejects.toThrow(
        "Redis del error",
      );
    });

    it("should handle many tags with mixed cache key counts", async () => {
      mockRedisClient.smembers.mockResolvedValueOnce(["key1", "key2"]);
      mockRedisClient.smembers.mockResolvedValueOnce([]);
      mockRedisClient.smembers.mockResolvedValueOnce(["key3", "key4", "key5"]);
      mockRedisClient.del.mockResolvedValue(1);

      const result = await service.invalidateByTags(["tag1", "tag2", "tag3"]);

      expect(mockRedisClient.smembers).toHaveBeenCalledTimes(3);
      // tag1: 2 keys + 1 tag, tag2: skipped (empty), tag3: 3 keys + 1 tag = 7 dels
      expect(mockRedisClient.del).toHaveBeenCalledTimes(7);
      expect(result).toBe(5);
    });

    it("should handle special characters in tags", async () => {
      mockRedisClient.smembers.mockResolvedValue(["key1"]);
      mockRedisClient.del.mockResolvedValue(1);

      const result = await service.invalidateByTags(["cache:tag:1", "user:2"]);

      expect(mockRedisClient.smembers).toHaveBeenCalledWith("cache:tag:1");
      expect(mockRedisClient.smembers).toHaveBeenCalledWith("user:2");
      expect(result).toBe(2);
    });

    it("should handle large number of cache keys per tag", async () => {
      const manyKeys = Array.from({ length: 100 }, (_, i) => `key${i}`);
      mockRedisClient.smembers.mockResolvedValue(manyKeys);
      mockRedisClient.del.mockResolvedValue(1);

      const result = await service.invalidateByTags(["tag1"]);

      expect(mockRedisClient.del).toHaveBeenCalledTimes(101); // 100 keys + 1 tag
      expect(result).toBe(100);
    });

    it("should process tags sequentially", async () => {
      const callOrder: string[] = [];
      mockRedisClient.smembers.mockImplementation((tag) => {
        callOrder.push(`smembers:${tag}`);
        return Promise.resolve(["key1"]);
      });
      mockRedisClient.del.mockImplementation((key) => {
        callOrder.push(`del:${key}`);
        return Promise.resolve(1);
      });

      await service.invalidateByTags(["tag1", "tag2"]);

      expect(callOrder[0]).toBe("smembers:tag1");
      expect(callOrder).toContain("del:tag1");
      expect(callOrder).toContain("smembers:tag2");
      expect(callOrder).toContain("del:tag2");
    });
  });

  describe("integration scenarios", () => {
    it("should handle complete cache workflow: set, get, delete", async () => {
      mockRedisClient.set.mockResolvedValue("OK");
      mockRedisClient.get.mockResolvedValue("testValue");
      mockRedisClient.del.mockResolvedValue(1);

      await service.set("key1", "value1");
      const value = await service.get("key1");
      const deleted = await service.delete("key1");

      expect(value).toBe("testValue");
      expect(deleted).toBe(1);
    });

    it("should handle cache workflow with tags and invalidation", async () => {
      mockRedisClient.set.mockResolvedValue("OK");
      mockRedisClient.sadd.mockResolvedValue(1);
      mockRedisClient.smembers.mockResolvedValue(["key1", "key2"]);
      mockRedisClient.del.mockResolvedValue(1);

      await service.set("key1", "value1", 3600, ["userCache"]);
      await service.set("key2", "value2", 3600, ["userCache"]);
      const invalidated = await service.invalidateByTags(["userCache"]);

      expect(invalidated).toBe(2);
    });

    it("should maintain separate operations for different keys", async () => {
      mockRedisClient.set.mockResolvedValue("OK");
      mockRedisClient.get.mockResolvedValueOnce("value1");
      mockRedisClient.get.mockResolvedValueOnce("value2");

      await service.set("key1", "value1");
      await service.set("key2", "value2");
      const val1 = await service.get("key1");
      const val2 = await service.get("key2");

      expect(val1).toBe("value1");
      expect(val2).toBe("value2");
    });
  });
});

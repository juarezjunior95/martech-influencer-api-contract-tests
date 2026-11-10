import { Test, TestingModule } from "@nestjs/testing";
import { PresetCacheRepository } from "@infrastructure/repositories/preset-cache.repository";
import { Preset } from "@domain/entities/preset.entity";
import { UserEntity } from "@domain/entities/user.entity";

describe("PresetCacheRepository", () => {
  let repo: PresetCacheRepository;
  let redisClient: {
    isOffline: jest.Mock;
    get: jest.Mock;
    set: jest.Mock;
  };

  const buildPreset = (
    overrides: {
      filters?: {
        namespace?: string;
        name: string;
        value: string;
      }[];
    } = {},
  ) =>
    Preset.create({
      name: "brands",
      config: {
        version: "1.0.0",
        preset: {
          brands: {
            filters: [],
          },
        },
        cache: { enabled: true, tags: ["filters"] },
      },
      filters: overrides.filters,
    });

  beforeEach(async () => {
    redisClient = {
      isOffline: jest.fn().mockReturnValue(false),
      get: jest.fn(),
      set: jest.fn().mockResolvedValue("OK"),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PresetCacheRepository,
        { provide: "RedisClient", useValue: redisClient },
      ],
    }).compile();

    repo = module.get(PresetCacheRepository);
  });

  const getKey = () => redisClient.set.mock.calls[0]?.[0] as string | undefined;

  it("includes user scope in the cache key when a user is provided", async () => {
    const preset = buildPreset();
    const user = UserEntity.create({
      scopes: ["OneWayReports.admin"],
      country: "BRA",
      supportedCountries: ["BRA", "ARG"],
    });

    await repo.setPreset(preset, user, { name: preset.getName(), data: {} });
    const key = getKey();

    expect(key).toMatch(/^preset:/);
    expect(key).toContain("user:");
  });

  it("omits the user scope when no user is provided", async () => {
    const preset = buildPreset();
    await repo.setPreset(preset, null, { name: preset.getName(), data: {} });
    expect(getKey()).not.toContain("user:");
  });

  it("produces different keys for different users", async () => {
    const preset = buildPreset();
    const userA = UserEntity.create({
      scopes: ["OneWayReports.admin"],
      country: "BRA",
      supportedCountries: ["BRA", "ARG"],
    });
    const userB = UserEntity.create({
      scopes: ["OneWayReports.reader"],
      country: "ARG",
      supportedCountries: ["BRA", "ARG"],
    });

    await repo.setPreset(preset, userA, { name: preset.getName(), data: {} });
    const keyA = getKey();
    redisClient.set.mockClear();

    await repo.setPreset(preset, userB, { name: preset.getName(), data: {} });
    const keyB = getKey();

    expect(keyA).not.toEqual(keyB);
  });

  it("produces different keys for CountryViewer users with different supported countries", async () => {
    const preset = buildPreset();
    const scope = "OneWayReports.CountryViewer.Read";
    const userA = UserEntity.create({
      scopes: [scope],
      country: "BRA",
      supportedCountries: ["USA", "DEU"],
    });
    const userB = UserEntity.create({
      scopes: [scope],
      country: "BRA",
      supportedCountries: ["GBR", "FRA"],
    });

    await repo.setPreset(preset, userA, { name: preset.getName(), data: {} });
    const keyA = getKey();
    redisClient.set.mockClear();

    await repo.setPreset(preset, userB, { name: preset.getName(), data: {} });
    const keyB = getKey();

    expect(keyA).not.toEqual(keyB);
  });

  it("produces different keys for the same name under different namespaces", async () => {
    const presetA = buildPreset({
      filters: [{ namespace: "brand", name: "include_global", value: "false" }],
    });
    const presetB = buildPreset({
      filters: [{ namespace: "years", name: "include_global", value: "false" }],
    });

    await repo.setPreset(presetA, null, { name: presetA.getName(), data: {} });
    const keyA = getKey();
    redisClient.set.mockClear();

    await repo.setPreset(presetB, null, { name: presetB.getName(), data: {} });
    const keyB = getKey();

    expect(keyA).toBeDefined();
    expect(keyB).toBeDefined();
    expect(keyA).not.toEqual(keyB);
  });

  it("returns null when Redis is offline", async () => {
    redisClient.isOffline.mockReturnValue(true);
    const preset = buildPreset();
    const result = await repo.getPreset(preset, null);
    expect(result).toBeNull();
    expect(redisClient.get).not.toHaveBeenCalled();
  });
});

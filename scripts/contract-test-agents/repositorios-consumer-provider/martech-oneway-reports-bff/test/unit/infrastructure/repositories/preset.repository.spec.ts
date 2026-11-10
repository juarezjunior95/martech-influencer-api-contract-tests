import { of } from "rxjs";
import { AxiosResponse } from "axios";
import { PresetRepository } from "@infrastructure/repositories/preset.repository";
import { DataServiceClient } from "@infrastructure/services/data-service.client";

describe("PresetRepository", () => {
  let repo: PresetRepository;
  let client: jest.Mocked<Pick<DataServiceClient, "get">>;

  beforeEach(() => {
    client = {
      get: jest.fn().mockReturnValue(
        of({
          data: { name: "brands", data: { brand: {} } },
        } as AxiosResponse),
      ),
    };
    repo = new PresetRepository(client as unknown as DataServiceClient);
  });

  it("serializes filters as `<namespace>[<name>]=<value>` query params", async () => {
    await repo.getPreset("brands", [
      { namespace: "brand", name: "include_global", value: "false" },
      { namespace: "brand", name: "countries", value: "BRA,ARG" },
      { namespace: "years", name: "no_default", value: "true" },
    ]);

    expect(client.get).toHaveBeenCalledWith("/presets/brands", {
      "brand[include_global]": "false",
      "brand[countries]": "BRA,ARG",
      "years[no_default]": "true",
    });
  });

  it("defaults missing namespace to `filter` for backward compat", async () => {
    await repo.getPreset("brands", [{ name: "country", value: "BRA" }]);

    expect(client.get).toHaveBeenCalledWith("/presets/brands", {
      "filter[country]": "BRA",
    });
  });

  it("forwards an empty params object when no filters are provided", async () => {
    await repo.getPreset("brands");
    expect(client.get).toHaveBeenCalledWith("/presets/brands", {});
  });
});

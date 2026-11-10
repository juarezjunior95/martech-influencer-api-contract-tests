import { DataRepository } from "@infrastructure/repositories/datasource.repository";
import { of, throwError } from "rxjs";

describe("DataRepository", () => {
  let repo: DataRepository;
  const mockDataServiceClient: any = { get: jest.fn() };

  beforeEach(() => {
    jest.clearAllMocks();
    repo = new DataRepository(mockDataServiceClient as any);
  });

  it("should return data when service responds", async () => {
    const payload = { data: { name: "ds", items: [1] } };
    mockDataServiceClient.get.mockReturnValue(of(payload));

    const res = await repo.getData("ds");
    expect(res).toEqual(payload.data);
    expect(mockDataServiceClient.get).toHaveBeenCalledWith(
      "/datasources/ds",
      {},
    );
  });

  it("should convert filters to query params", async () => {
    const payload = { data: { name: "ds" } };
    mockDataServiceClient.get.mockReturnValue(of(payload));

    const filters = [{ name: "country", value: "BR" }];
    const res = await repo.getData("ds", filters as any);

    expect(res).toEqual(payload.data);
    expect(mockDataServiceClient.get).toHaveBeenCalledWith("/datasources/ds", {
      "filter[country]": "BR",
    });
  });

  it("should throw and log when dataService errors", async () => {
    const err = new Error("fail");
    mockDataServiceClient.get.mockReturnValue(throwError(() => err));

    await expect(repo.getData("ds")).rejects.toThrow(err);
  });
});

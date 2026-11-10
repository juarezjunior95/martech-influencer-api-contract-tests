export type ImagesScenario =
  | "brand-corona"
  | "brand-michelob"
  | "brand-unknown"
  | "brand-family-all"
  | "brand-alias"
  | "country-ar"
  | "country-br"
  | "country-alias"
  | "country-unknown";

export interface BrandImageFixture {
  url: string;
  matched: string[];
  image_variants: Record<string, string>;
}

export interface CountryImageFixture {
  url: string;
  matched: string[];
}

export interface ImagesScenarioFixture {
  brand?: BrandImageFixture;
  country?: CountryImageFixture;
}

export const IMAGES_FIXTURES: Record<ImagesScenario, ImagesScenarioFixture> = {
  "brand-corona": {
    brand: {
      url: "https://cdn.example.com/brands/corona/square.png",
      matched: ["corona", "corona extra"],
      image_variants: {
        square: "https://cdn.example.com/brands/corona/square.png",
        table: "https://cdn.example.com/brands/corona/table.png",
      },
    },
  },

  "brand-michelob": {
    brand: {
      url: "https://cdn.example.com/brands/michelob_ultra/table.png",
      matched: ["michelob ultra"],
      image_variants: {
        square: "https://cdn.example.com/brands/michelob_ultra/square.png",
        table: "https://cdn.example.com/brands/michelob_ultra/table.png",
      },
    },
  },

  "brand-unknown": {
    brand: {
      url: "https://cdn.example.com/brands/placeholder/square.png",
      matched: [],
      image_variants: {},
    },
  },

  "brand-family-all": {
    brand: {
      url: "https://cdn.example.com/brands/all/square.png",
      matched: ["stella artois"],
      image_variants: {
        square: "https://cdn.example.com/brands/all/square.png",
        table: "https://cdn.example.com/brands/all/table.png",
      },
    },
  },

  "brand-alias": {
    brand: {
      url: "https://cdn.example.com/brands/corona/square.png",
      matched: ["corona"],
      image_variants: {
        square: "https://cdn.example.com/brands/corona/square.png",
        table: "https://cdn.example.com/brands/corona/table.png",
      },
    },
  },

  "country-ar": {
    country: {
      url: "https://cdn.example.com/countries/waving/AR.png",
      matched: ["AR", "ARG", "Argentina"],
    },
  },

  "country-br": {
    country: {
      url: "https://cdn.example.com/countries/rounded_flags/BR.png",
      matched: ["BR", "BRA", "Brazil"],
    },
  },

  "country-alias": {
    country: {
      url: "https://cdn.example.com/countries/rounded_flags/BR.png",
      matched: ["BR", "BRA", "Brazil"],
    },
  },

  "country-unknown": {
    country: {
      url: "https://cdn.example.com/countries/placeholder/icon.png",
      matched: [],
    },
  },
};

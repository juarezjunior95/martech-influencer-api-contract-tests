import type { AudienceTargetingBrandsSource } from "@domain/config/presets/audience-targeting-brands/audience-targeting-brands.types";

export const AUDIENCE_TARGETING_BRANDS_BY_COUNTRY: AudienceTargetingBrandsSource =
  {
    ARG: [
      {
        value: "Andes Origen",
        label: "Andes Origen",
        is_sub_brand: false,
        competitor: [
          { value: "Imperial", label: "Imperial", is_sub_brand: false },
        ],
      },
      {
        value: "Brahma",
        label: "Brahma",
        is_sub_brand: false,
        competitor: [
          { value: "Amstel", label: "Amstel", is_sub_brand: false },
          { value: "Schneider", label: "Schneider", is_sub_brand: false },
        ],
      },
      {
        value: "Corona",
        label: "Corona",
        is_sub_brand: false,
        competitor: [
          { value: "Heineken", label: "Heineken", is_sub_brand: false },
        ],
      },
      {
        value: "Quilmes",
        label: "Quilmes",
        is_sub_brand: false,
        competitor: [
          { value: "Schneider", label: "Schneider", is_sub_brand: false },
        ],
      },
      {
        value: "Stella Artois",
        label: "Stella Artois",
        is_sub_brand: false,
        competitor: [
          { value: "Heineken", label: "Heineken", is_sub_brand: false },
        ],
      },
    ],
    BRA: [
      {
        value: "Brahma",
        label: "Brahma",
        is_sub_brand: false,
        competitor: [{ value: "Amstel", label: "Amstel", is_sub_brand: false }],
      },
      {
        value: "Budweiser",
        label: "Budweiser",
        is_sub_brand: false,
        competitor: [{ value: "Amstel", label: "Amstel", is_sub_brand: false }],
      },
      {
        value: "Corona",
        label: "Corona",
        is_sub_brand: false,
        competitor: [{ value: "Heineken", label: "Heineken" }],
      },
      {
        value: "Original",
        label: "Original",
        is_sub_brand: false,
        competitor: [{ value: "Heineken", label: "Heineken" }],
      },
      {
        value: "Spaten",
        label: "Spaten",
        is_sub_brand: false,
        competitor: [
          { value: "Heineken", label: "Heineken", is_sub_brand: false },
        ],
      },
    ],
    CAN: [
      {
        value: "Bud Light",
        label: "Bud Light",
        is_sub_brand: false,
        competitor: [
          { value: "Coors Light", label: "Coors Light", is_sub_brand: false },
        ],
      },
      {
        value: "Busch",
        label: "Busch",
        is_sub_brand: false,
        competitor: [
          {
            value: "Pabst Blue Ribbon",
            label: "Pabst Blue Ribbon",
            is_sub_brand: true,
          },
        ],
      },
      {
        value: "Corona",
        label: "Corona",
        is_sub_brand: false,
        competitor: [
          { value: "Heineken", label: "Heineken", is_sub_brand: false },
        ],
      },
      {
        value: "Michelob Ultra",
        label: "Michelob Ultra",
        is_sub_brand: false,
        competitor: [{ value: "Coors Light", label: "Coors Light" }],
      },
    ],
    CHN: [
      {
        value: "Blue Girl",
        label: "Blue Girl",
        is_sub_brand: false,
        competitor: [
          { value: "Heineken", label: "Heineken", is_sub_brand: false },
        ],
      },
      {
        value: "Budweiser",
        label: "Budweiser",
        is_sub_brand: false,
        competitor: [
          { value: "Heineken", label: "Heineken", is_sub_brand: false },
        ],
      },
      {
        value: "Corona",
        label: "Corona",
        is_sub_brand: false,
        competitor: [
          { value: "Heineken", label: "Heineken", is_sub_brand: false },
        ],
      },
      {
        value: "Harbin Ice",
        label: "Harbin Ice",
        is_sub_brand: true,
        competitor: [
          { value: "Snow YCTY", label: "Snow YCTY", is_sub_brand: true },
        ],
      },
    ],
    COL: [
      {
        value: "Aguila",
        label: "Aguila",
        is_sub_brand: false,
        competitor: [{ value: "Andina", label: "Andina", is_sub_brand: false }],
      },
      {
        value: "Aguila Light",
        label: "Aguila Light",
        is_sub_brand: true,
        competitor: [{ value: "Andina", label: "Andina", is_sub_brand: false }],
      },
      {
        value: "Club Colombia",
        label: "Club Colombia",
        is_sub_brand: false,
        competitor: [
          { value: "Heineken", label: "Heineken", is_sub_brand: false },
        ],
      },
      {
        value: "Corona",
        label: "Corona",
        is_sub_brand: false,
        competitor: [
          { value: "Heineken", label: "Heineken", is_sub_brand: false },
        ],
      },
      {
        value: "Costena Bacana",
        label: "Costena Bacana",
        is_sub_brand: true,
        competitor: [{ value: "Andina", label: "Andina", is_sub_brand: false }],
      },
    ],
    ECU: [
      {
        value: "Club Premium",
        label: "Club Premium",
        is_sub_brand: true,
        competitor: [
          { value: "Heineken", label: "Heineken", is_sub_brand: false },
        ],
      },
      {
        value: "Pilsener",
        label: "Pilsener",
        is_sub_brand: false,
        competitor: [{ value: "Amstel", label: "Amstel", is_sub_brand: false }],
      },
    ],
    GBR: [
      {
        value: "Budweiser",
        label: "Budweiser",
        is_sub_brand: false,
        competitor: [
          { value: "Heineken", label: "Heineken", is_sub_brand: false },
        ],
      },
      {
        value: "Corona",
        label: "Corona",
        is_sub_brand: false,
        competitor: [
          { value: "Guinness", label: "Guinness", is_sub_brand: false },
          { value: "Heineken", label: "Heineken", is_sub_brand: false },
        ],
      },
      {
        value: "Stella Artois",
        label: "Stella Artois",
        is_sub_brand: false,
        competitor: [
          { value: "Guinness", label: "Guinness", is_sub_brand: false },
          { value: "Heineken", label: "Heineken", is_sub_brand: false },
          { value: "Peroni", label: "Peroni", is_sub_brand: false },
        ],
      },
    ],
    KOR: [
      {
        value: "Cass Fresh",
        label: "Cass Fresh",
        is_sub_brand: true,
        competitor: [{ value: "Terra", label: "Terra", is_sub_brand: false }],
      },
      {
        value: "Cass Light",
        label: "Cass Light",
        is_sub_brand: true,
        competitor: [
          {
            value: "Terra Light",
            label: "Terra Light",
            is_sub_brand: true,
          },
        ],
      },
    ],
    MEX: [
      {
        value: "Corona",
        label: "Corona",
        is_sub_brand: false,
        competitor: [{ value: "Tecate", label: "Tecate", is_sub_brand: false }],
      },
      {
        value: "Corona Light",
        label: "Corona Light",
        is_sub_brand: true,
        competitor: [
          { value: "Tecate Light", label: "Tecate Light", is_sub_brand: true },
        ],
      },
      {
        value: "Modelo",
        label: "Modelo",
        is_sub_brand: false,
        competitor: [
          { value: "Dos Equis", label: "Dos Equis", is_sub_brand: false },
        ],
      },
      {
        value: "Victoria",
        label: "Victoria",
        is_sub_brand: false,
        competitor: [{ value: "Indio", label: "Indio", is_sub_brand: false }],
      },
    ],
    PER: [
      {
        value: "Corona",
        label: "Corona",
        is_sub_brand: false,
        competitor: [
          { value: "Heineken", label: "Heineken", is_sub_brand: false },
        ],
      },
      {
        value: "Cristal",
        label: "Cristal",
        is_sub_brand: false,
        competitor: [
          { value: "Tres Cruces", label: "Tres Cruces", is_sub_brand: false },
        ],
      },
      {
        value: "Cusquena",
        label: "Cusqueña",
        is_sub_brand: false,
        competitor: [
          { value: "Heineken", label: "Heineken", is_sub_brand: false },
        ],
      },
      {
        value: "Pilsen Callao",
        label: "Pilsen Callao",
        is_sub_brand: false,
        competitor: [
          { value: "Tres Cruces", label: "Tres Cruces", is_sub_brand: false },
        ],
      },
    ],
    ZAF: [
      {
        value: "Brutal Fruit",
        label: "Brutal Fruit",
        is_sub_brand: false,
        competitor: [
          { value: "Bernini", label: "Bernini", is_sub_brand: false },
        ],
      },
      {
        value: "Carling Black Label",
        label: "Carling Black Label",
        is_sub_brand: false,
        competitor: [
          { value: "Amstel Lager", label: "Amstel Lager", is_sub_brand: true },
        ],
      },
      {
        value: "Corona",
        label: "Corona",
        is_sub_brand: false,
        competitor: [
          { value: "Heineken", label: "Heineken", is_sub_brand: false },
        ],
      },
      {
        value: "Flying Fish",
        label: "Flying Fish",
        is_sub_brand: false,
        competitor: [
          {
            value: "Savanna Dry",
            label: "Savanna Dry",
            is_sub_brand: true,
          },
        ],
      },
    ],
  };

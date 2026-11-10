import { BrandAvatarItemProps } from '../Components/BrandAvatarItem/interface';
import { BrandAvatarListProps } from '../Components/BrandAvatarList/interface';

const BRAND_BASE_URL =
  'https://theloop20.test-abinbev.acsitefactory.com/sites/g/files/wnfebl11871/files/styles/content_brand_square_image/public';
const FLAG_BASE_URL =
  'https://theloop20.test-abinbev.acsitefactory.com/sites/g/files/wnfebl11871/files/2025-03/';
const COUNTRY_FLAG_BASE_URL =
  'https://theloop20.test-abinbev.acsitefactory.com/modules/custom/abinbev_loop_components/assets/img/rounded_flags/';

const CountryAvatarItems: BrandAvatarItemProps[] = [
  {
    mainBrand: {
      src: `${COUNTRY_FLAG_BASE_URL}ABI.png`,
      alt: 'ABI Flag',
    },
    title: 'Global',
    description: 'Description',
  },
  {
    mainBrand: {
      src: `${COUNTRY_FLAG_BASE_URL}USA.png`,
      alt: 'USA Flag',
    },
    title: 'United States',
    description: 'Description',
  },
  {
    mainBrand: {
      src: `${COUNTRY_FLAG_BASE_URL}BRA.png`,
      alt: 'Brazil Flag',
    },
    title: 'Brazil',
    description: 'Description',
  },
  {
    mainBrand: {
      src: `${COUNTRY_FLAG_BASE_URL}MEX.png`,
      alt: 'Mexico Flag',
    },
    title: 'Mexico',
    description: 'Description',
  },
  {
    mainBrand: {
      src: `${COUNTRY_FLAG_BASE_URL}ARG.png`,
      alt: 'Argentina Flag',
    },
    title: 'Argentina',
    description: 'Description',
  },
  {
    mainBrand: {
      src: `${COUNTRY_FLAG_BASE_URL}CAN.png`,
      alt: 'Canada Flag',
    },
    title: 'Canada',
    description: 'Description',
  },
  {
    mainBrand: {
      src: `${COUNTRY_FLAG_BASE_URL}NGA.png`,
      alt: 'Nigeria Flag',
    },
    title: 'Nigeria',
    description: 'Description',
  },
];

const BrandAvatarItems: BrandAvatarItemProps[] = [
  {
    mainBrand: {
      src: `${BRAND_BASE_URL}/2025-01/Michelob.png?itok=W4LaFdAJ`,
      alt: 'Brand 1',
    },
    badgeFlag: {
      src: `${FLAG_BASE_URL}USA.png`,
      alt: 'Flag 1',
    },
    title: 'Label',
    description: 'Label',
  },
  {
    mainBrand: {
      src: `${BRAND_BASE_URL}/2025-01/Stella%20Artois.png?itok=7x8ZUc0g`,
      alt: 'Brand 2',
    },
    badgeFlag: {
      src: `${FLAG_BASE_URL}BRA.png`,
      alt: 'Flag 2',
    },
    title: 'Label',
    description: 'Label',
  },
  {
    mainBrand: {
      src: `${BRAND_BASE_URL}/2025-01/Skol_0.png?itok=_iYu5vji`,
      alt: 'Brand 2',
    },
    badgeFlag: {
      src: `${FLAG_BASE_URL}BRA.png`,
      alt: 'Flag 2',
    },
    title: 'Label',
    description: 'Label',
  },
  {
    mainBrand: {
      src: `${BRAND_BASE_URL}/2025-01/Corona_0.png?itok=K8xR1dPc`,
      alt: 'Brand 2',
    },
    badgeFlag: {
      src: `${FLAG_BASE_URL}MEX.png`,
      alt: 'Flag 2',
    },
    title: 'Label',
    description: 'Label',
  },
  {
    mainBrand: {
      src: `${BRAND_BASE_URL}/2025-02/bud%20light%20square.png?itok=VLwZ8_M_`,
      alt: 'Brand 2',
    },
    badgeFlag: {
      src: `${FLAG_BASE_URL}USA.png`,
      alt: 'Flag 2',
    },
    title: 'Label',
    description: 'Label',
  },
  {
    mainBrand: {
      src: `${BRAND_BASE_URL}/2025-01/Budweiser_0.png?itok=9b6rIGGh`,
      alt: 'Brand 2',
    },
    badgeFlag: {
      src: `${FLAG_BASE_URL}USA.png`,
      alt: 'Flag 2',
    },
    title: 'Label',
    description: 'Label',
  },
];

export const CountryAvatarItemsMock: BrandAvatarListProps = {
  data: CountryAvatarItems,
  length: CountryAvatarItems.length,
};

export const BrandAvatarItemsMock: BrandAvatarListProps = {
  data: BrandAvatarItems,
  length: BrandAvatarItems.length,
};

export const BrandAvatarItemsNoBrandMock: BrandAvatarListProps = {
  data: BrandAvatarItems.map((item) => ({
    badgeFlag: item.badgeFlag,
    title: item.title,
    description: item.description,
  })),
  length: BrandAvatarItems.length,
};

export const BrandAvatarItemsNoDescriptionMock: BrandAvatarListProps = {
  data: BrandAvatarItems.map((item) => ({
    badgeFlag: item.badgeFlag,
    title: item.title,
    description: '',
  })),
  length: BrandAvatarItems.length,
};

export const BrandAvatarItemsWithImageNoDescriptionMock: BrandAvatarListProps =
  {
    data: BrandAvatarItems.map((item) => ({
      mainBrand: item.mainBrand,
      badgeFlag: item.badgeFlag,
      title: item.title,
      description: '',
    })),
    length: BrandAvatarItems.length,
  };

export const BrandAvatarItemsNoFlagMock: BrandAvatarListProps = {
  data: BrandAvatarItems.map((item) => ({
    mainBrand: item.mainBrand,
    title: item.title,
    description: '',
  })),
  length: BrandAvatarItems.length,
};

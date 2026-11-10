import { pageSections } from './sections';

export interface GlobalMoves {
  [key: string]: {
    key: string;
    title: string;
    coverSection: string;
    section: string;
    volumeCountriesBreakdown: string;
    brand: string;
    footnotes: string;
    subFilters: {
      bar: { page_type: string };
      waterfall: { page_type: string };
      line: { page_type: string };
    };
  };
}

export const DEFAULT_GLOBAL_MOVES: GlobalMoves = {
  corona: {
    key: 'corona',
    title: 'Corona',
    coverSection: pageSections.coronaCover,
    section: pageSections.coronaSegments,
    volumeCountriesBreakdown: pageSections.coronaVolumeCountriesBreakdown,
    brand: 'Corona',
    footnotes:
      'Countries are ordered by vol. weight; Results are filtered by Lead Premium price segments',
    subFilters: {
      bar: {
        page_type: 'Corona',
      },
      waterfall: {
        page_type: 'Corona',
      },
      line: {
        page_type: 'Corona',
      },
    },
  },
  coronaCero: {
    key: 'corona-cero',
    title: 'Corona Cero',
    coverSection: pageSections.coronaCeroCover,
    section: pageSections.coronaCeroSegments,
    volumeCountriesBreakdown: pageSections.coronaCeroVolumeCountriesBreakdown,
    brand: 'Corona Cero',
    footnotes: 'Countries are ordered by vol. weight',
    subFilters: {
      bar: {
        page_type: 'Corona Cero',
      },
      waterfall: {
        page_type: 'Corona Cero',
      },
      line: {
        page_type: 'Corona Cero',
      },
    },
  },
  budweiser: {
    key: 'budweiser',
    title: 'Budweiser',
    coverSection: pageSections.budweiserCover,
    section: pageSections.budweiserSegments,
    volumeCountriesBreakdown: pageSections.budweiserVolumeCountriesBreakdown,
    brand: 'Budweiser',
    footnotes:
      'Countries are ordered by vol. weight; Results are filtered by Lead Premium price segments',
    subFilters: {
      bar: {
        page_type: 'Budweiser',
      },
      waterfall: {
        page_type: 'Budweiser',
      },
      line: {
        page_type: 'Budweiser',
      },
    },
  },
  stellaArtois: {
    key: 'stella',
    title: 'Stella Artois',
    coverSection: pageSections.stellaArtoisCover,
    section: pageSections.stellaArtoisSegments,
    volumeCountriesBreakdown: pageSections.stellaArtoisVolumeCountriesBreakdown,
    brand: 'Stella Artois',
    footnotes:
      'Countries are ordered by vol. weight; Results are filtered by Lead Premium price segments',
    subFilters: {
      bar: {
        page_type: 'Stella',
      },
      waterfall: {
        page_type: 'Stella',
      },
      line: {
        page_type: 'Stella',
      },
    },
  },
  michelobUltra: {
    key: 'michelob',
    title: 'Michelob Ultra',
    coverSection: pageSections.michelobUltraCover,
    section: pageSections.michelobUltraSegments,
    volumeCountriesBreakdown:
      pageSections.michelobUltraVolumeCountriesBreakdown,
    brand: 'Michelob Ultra',
    footnotes:
      'Countries are ordered by vol. weight; Results are filtered by Lead Premium price segments',
    subFilters: {
      bar: {
        page_type: 'Michelob',
      },
      waterfall: {
        page_type: 'Michelob',
      },
      line: {
        page_type: 'Michelob',
      },
    },
  },
  flyingFish: {
    key: 'flying-fish',
    title: 'Flying Fish',
    coverSection: pageSections.flyingFishCover,
    section: pageSections.flyingFishSegments,
    volumeCountriesBreakdown: pageSections.flyingFishVolumeCountriesBreakdown,
    brand: 'Flying Fish',
    footnotes: 'Countries are ordered by vol. weight',
    subFilters: {
      bar: {
        page_type: 'Flying Fish',
      },
      waterfall: {
        page_type: 'Flying Fish',
      },
      line: {
        page_type: 'Flying Fish',
      },
    },
  },
};

export const VOLUME_GLOBAL_MOVES: GlobalMoves = DEFAULT_GLOBAL_MOVES;

export const NR_GLOBAL_MOVES: GlobalMoves = DEFAULT_GLOBAL_MOVES;

export const CORES_GLOBAL_MOVES: GlobalMoves = DEFAULT_GLOBAL_MOVES;

export const POWER_GLOBAL_MOVES: GlobalMoves = DEFAULT_GLOBAL_MOVES;

export const MARKET_SHARE_GLOBAL_MOVES: GlobalMoves = {
  corona: DEFAULT_GLOBAL_MOVES.corona,
  coronaCero: DEFAULT_GLOBAL_MOVES.coronaCero,
  budweiser: DEFAULT_GLOBAL_MOVES.budweiser,
  stellaArtois: DEFAULT_GLOBAL_MOVES.stellaArtois,
  michelobUltra: DEFAULT_GLOBAL_MOVES.michelobUltra,
};

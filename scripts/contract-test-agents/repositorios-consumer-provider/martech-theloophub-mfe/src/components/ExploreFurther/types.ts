export interface ExploreFurtherProps {
  filterPageName: string;
  dataTestId?: string;
  cards: {
    title: string;
    description: string;
    linkLabel: string;
    linkHref: string;
    abbreviation: string;
    enabled: boolean;
  }[];
}

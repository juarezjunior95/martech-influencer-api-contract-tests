export interface PageInfo {
  index: number;
  name: string;
  element?: HTMLElement;
}

export interface PageIndexes {
  [key: string]: PageInfo;
}

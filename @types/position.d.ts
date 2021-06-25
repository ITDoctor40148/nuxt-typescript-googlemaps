export interface Marker {
  cases: number;
  countryAndTerritory: string;
  countryTerritoryCode: string;
  cumulativeNumberFor14DaysPer100000: number;
  dateReported: Date;
  day: number;
  deaths: number;
  lat: number;
  lng: number;
  month: number;
  year: number;
}

export interface Position {
  lat: number;
  lng: number;
}

export interface Country {
  countryAndTerritory: string;
  countryTerritoryCode: string;
  lat: number;
  lng: number;
}

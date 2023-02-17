interface iMapsData {
  id: string;
  type: string;
  place_type: string[];
  relevance: number;
  properties: {
    foursquare: string;
    landmark: boolean;
    address: string;
    category: string;
  };
  text: string;
  place_name: string;
  center: [number, number];
  geometry: {
    coordinates: [number, number];
    type: string;
  };
  context: {
    id: string;
    text: string;
    wikidata?: string;
    short_code?: string;
  }[];
}

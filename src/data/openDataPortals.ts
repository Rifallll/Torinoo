export interface OpenDataPortal {
  name: string;
  title: string;
  url: string;
  description: string;
  place: string;
  location: [number, number]; // [latitude, longitude]
  country: string;
  status: string;
}

export const openDataPortals: OpenDataPortal[] = [
  {
    name: "ann-arbor-data",
    title: "Ann Arbor, Michigan Open Data",
    url: "http://www.a2gov.org/data/Pages/default.aspx",
    description: "City of Ann Arbor's Open Data Catalog (USA).",
    place: "Ann Arbor, Michigan",
    location: [42.2808, -83.7430],
    country: "US",
    status: "active",
  },
  {
    name: "berlin-open-data",
    title: "Berlin Open Data",
    url: "http://daten.berlin.de/",
    description: "Official open data catalog of the Senate of Berlin, Germany.",
    place: "Berlin, Germany",
    location: [52.5200, 13.4050],
    country: "DE",
    status: "active",
  },
  {
    name: "amsterdam-open-data",
    title: "Amsterdam Open Data",
    url: "http://www.amsterdamopendata.nl/home",
    description: "Portal commissioned by the Amsterdam Economic Board Open Data Exchange (ODE).",
    place: "Amsterdam, Netherlands",
    location: [52.3676, 4.9041],
    country: "NL",
    status: "active",
  },
  {
    name: "london-datastore",
    title: "London Datastore",
    url: "http://data.london.gov.uk",
    description: "Data on London, UK from the GLA and other public sector bodies.",
    place: "Greater London, UK",
    location: [51.5074, -0.1278],
    country: "GB",
    status: "active",
  },
  {
    name: "sydney-open-data",
    title: "Sydney Open Data",
    url: "http://gong.io/", // Using a related URL from the original context
    description: "Open data initiative and platform for Wollongong, Shellharbour, Kiama and the greater Illawarra region (near Sydney, Australia).",
    place: "Sydney, Australia",
    location: [-33.8688, 151.2093],
    country: "AU",
    status: "active",
  },
];
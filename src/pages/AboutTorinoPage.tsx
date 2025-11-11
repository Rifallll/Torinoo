"use client";

import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Info, Building2, Users, MapPin, History, Coffee, Car, Factory, Palette, Globe, Clock, Ruler, Scale, Landmark, Utensils, GraduationCap, DollarSign, Lightbulb, Quote } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

const AboutTorinoPage = () => {
  const generalInfo = [
    { label: "Official Name", value: "City of Torino (Turin)" },
    { label: "Name in Italian", value: "Città di Torino" },
    { label: "Country", value: "Italy" },
    { label: "Region", value: "Piedmont (Piemonte)" },
    { label: "Coordinates", value: "45.0703° N, 7.6869° E" },
    { label: "Area", value: "±130 km²" },
    { label: "Population (2024)", value: "±850,000 inhabitants" },
    { label: "Metropolitan Population", value: "±2 million inhabitants" },
    { label: "Population Density", value: "±6,500 inhabitants/km²" },
    { label: "Time Zone", value: "UTC+1 (CET), UTC+2 (CEST in summer)" },
    { label: "Postal Codes", value: "10100–10156" },
    { label: "Vehicle Code", value: "TO" },
    { label: "Official Language", value: "Italian" },
    { label: "City Nicknames", value: "“La Città dell’Automobile” (The Automotive City), “La Capitale Sabauda” (The Savoy Capital)" },
  ];

  const governmentInfo = [
    { label: "Status", value: "Capital of the Piedmont region, Italy." },
    { label: "Government", value: "Comune di Torino (Municipality of Turin)." },
    { label: "Mayor", value: "dummy: Stefano Lo Russo (2025)" },
    { label: "Administrative Divisions", value: "8 Circoscrizioni (administrative districts)." },
    { label: "City Emblem", value: "Blue shield with a golden bull." },
    { label: "Motto", value: "“Fortitudo mea Taurinensis” (My strength is from Turin)." },
  ];

  const historyData = [
    { period: "1st Century BC", event: "Founded by the Taurini tribe as *Augusta Taurinorum* (Roman colony)." },
    { period: "16th Century", event: "Became the capital of the **Duchy of Savoy**." },
    { period: "1706", event: "Attacked by France, but successfully defended (Battle of Turin)." },
    { period: "1861–1865", event: "**First capital of Italy** after unification." },
    { period: "20th Century", event: "Grew as an automotive industry hub for FIAT, Lancia, Iveco." },
    { period: "2006", event: "Hosted the **Torino 2006 Winter Olympics**." },
    { period: "Present", event: "A city of universities, culture, and green technology innovation." },
  ];

  const geographyClimate = [
    { label: "Location", value: "Located in northwestern Italy, at the foot of the Alps and on the banks of the Po River." },
    { label: "Borders", value: "North: Venaria Reale; South: Moncalieri; East: San Mauro Torinese; West: Collegno" },
    { label: "Elevation", value: "±240 meters above sea level." },
    { label: "Main Rivers", value: "Po, Dora Riparia, Stura di Lanzo." },
    { label: "Climate", value: "Humid continental (cold snowy winters, warm summers)." },
    { label: "Average Temperature", value: "12°C per year." },
    { label: "Annual Rainfall", value: "±850 mm." },
  ];

  const transportationNetwork = [
    { type: "Metro", details: "1 line (Linea 1), 21 stations, ±15 km long." },
    { type: "Tram", details: "±10 main routes in the city center." },
    { type: "Bus", details: "More than 80 active routes." },
    { type: "Train", details: "Main stations: Porta Nuova, Porta Susa." },
    { type: "Airport", details: "Torino-Caselle (code: TRN)." },
    { type: "Bicycle Paths", details: "±220 km of official paths." },
    { type: "Low Emission Zones", details: "12 city center districts." },
  ];

  const mobilityStatistics = [
    { label: "Daily vehicle volume", value: "±320,000" },
    { label: "Electric vehicles", value: "±14% of total vehicles." },
    { label: "Public transport usage", value: "±40% of citizens." },
    { label: "Average travel time", value: "±32 minutes." },
    { label: "Average congestion level", value: "28%." },
  ];

  const economyData = [
    { label: "Main sectors", value: "Automotive, energy, design, tourism, higher education, and information technology." },
    { label: "Major companies", value: "FIAT, Lancia, Iveco, Stellantis Group." },
    { label: "GDP per capita", value: "±€33,000." },
    { label: "Industrial sector employment", value: "±35%." },
    { label: "Startups & innovation", value: "Turin Tech Hub, Smart City Lab." },
    { label: "Main exports", value: "Vehicles, industrial machinery, design products, and chocolate (Ferrero)." },
  ];

  const educationResearch = [
    { label: "Universities", value: "*Università degli Studi di Torino* (founded 1404, ±70,000 students); *Politecnico di Torino* (leading technical university in Italy)." },
    { label: "Key fields", value: "Automotive, AI, renewable energy, architecture, economics." },
    { label: "Research institutions", value: "INRIM (National Institute of Metrological Research), CNR Torino." },
  ];

  const landmarkData = [
    { name: "Mole Antonelliana", description: "Torino's iconic tower, now home to the National Museum of Cinema." },
    { name: "Museo Egizio", description: "The largest Egyptian Museum outside Egypt." },
    { name: "Piazza Castello", description: "The historic main square of the city center." },
    { name: "Palazzo Reale & Palazzo Madama", description: "The Savoy royal palace complex." },
    { name: "Parco del Valentino", description: "A large park on the banks of the Po River." },
    { name: "Basilica di Superga", description: "A church on a hilltop with panoramic city views." },
  ];

  const festivalsEvents = [
    "Torino Film Festival",
    "Torino Jazz Festival",
    "Artissima (contemporary art exhibition)",
    "Cioccolatò (chocolate festival)",
    "Salone dell’Auto",
  ];

  const cuisineData = [
    { item: "Gianduja", description: "Torino's signature chocolate with hazelnut paste." },
    { item: "Bicerin", description: "Traditional drink of espresso, liquid chocolate, and milk cream." },
    { item: "Vitello tonnato", description: "Veal with tuna sauce." },
    { item: "Agnolotti", description: "Piedmontese stuffed pasta." },
    { item: "Barolo & Barbaresco", description: "Red wines typical of the Piedmont region." },
  ];

  const visualGallery = [
    "Mole Antonelliana – city's main icon",
    "Piazza San Carlo",
    "Parco del Valentino",
    "Po River in the evening",
    "Museo Egizio",
    "Torino night view from Superga",
  ];

  const demographicsData = [
    { label: "Population (2024)", value: "±850,000" },
    { label: "Households", value: "±360,000" },
    { label: "Average age", value: "44 years" },
    { label: "Male:Female Ratio", value: "48:52" },
    { label: "Foreign residents", value: "±15% of total population" },
    { label: "Population growth", value: "-0.4% per year" },
  ];

  const smartCityInitiatives = [
    "Smart City Torino – a smart city project focusing on:",
    "Smart transportation & traffic management.",
    "Renewable energy & building efficiency.",
    "Digitalization of public services.",
    "Urban data center & open mobility data.",
    "Smart Road Project: road sensor & autonomous vehicle trials.",
  ];

  const quotesMotto = [
    "“Torino — Where History Drives the Future.”",
    "“A city of elegance, innovation, and timeless heritage.”",
  ];

  const summaryTableData = [
    { indicator: "Population", value: "±850,000" },
    { indicator: "City Area", value: "130 km²" },
    { indicator: "GDP per Capita", value: "€33,000" },
    { indicator: "Metro Line Length", value: "15 km" },
    { indicator: "Average Congestion", value: "28%" },
    { indicator: "Bicycle Paths", value: "220 km" },
    { indicator: "Low Emission Zones", value: "12 districts" },
    { indicator: "Elevation", value: "240 m" },
    { indicator: "Founded", value: "1st Century BC" },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-gray-900 p-4 md:p-6">
      <header className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100 flex items-center">
          <Info className="h-8 w-8 mr-3 text-indigo-600" />
          About the City of Torino
        </h1>
        <Button asChild variant="outline">
          <Link to="/torino-dashboard" className="flex items-center">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Link>
        </Button>
      </header>

      <main className="flex-1 max-w-6xl mx-auto w-full space-y-8">
        {/* Hero Section */}
        <Card className="dark:bg-gray-800 dark:text-gray-200">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-gray-800 dark:text-gray-100">Torino, Jewel of Northern Italy</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <img
              src="https://upload.wikimedia.org/wikipedia/commons/thumb/e/e4/Mole_Antonelliana_Torino.jpg/1280px-Mole_Antonelliana_Torino.jpg"
              alt="Mole Antonelliana, Torino"
              className="w-full h-64 object-cover rounded-md shadow-md"
            />
            <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed">
              Torino is a major city in northern Italy, the capital of the Piedmont region. Located on the western bank of the Po River, the city is surrounded by the Alps to the west and north, offering stunning views. Torino is known as an important cultural and business center, with a rich history and beautiful Baroque architecture.
            </p>
          </CardContent>
        </Card>

        {/* General Information */}
        <Card className="dark:bg-gray-800 dark:text-gray-200">
          <CardHeader>
            <CardTitle className="text-xl font-semibold flex items-center">
              <Globe className="h-5 w-5 mr-2 text-blue-600" /> General Information
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableBody>
                {generalInfo.map((item, index) => (
                  <TableRow key={index}>
                    <TableCell className="font-medium w-1/3">{item.label}</TableCell>
                    <TableCell className="w-2/3">{item.value}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Government & Administration */}
        <Card className="dark:bg-gray-800 dark:text-gray-200">
          <CardHeader>
            <CardTitle className="text-xl font-semibold flex items-center">
              <Building2 className="h-5 w-5 mr-2 text-green-600" /> Government & Administration
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableBody>
                {governmentInfo.map((item, index) => (
                  <TableRow key={index}>
                    <TableCell className="font-medium w-1/3">{item.label}</TableCell>
                    <TableCell className="w-2/3">{item.value}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Brief History */}
        <Card className="dark:bg-gray-800 dark:text-gray-200">
          <CardHeader>
            <CardTitle className="text-xl font-semibold flex items-center">
              <History className="h-5 w-5 mr-2 text-purple-600" /> Brief History
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[150px]">Period</TableHead>
                  <TableHead>Event</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {historyData.map((item, index) => (
                  <TableRow key={index}>
                    <TableCell className="font-medium">{item.period}</TableCell>
                    <TableCell>{item.event}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Geography & Climate */}
        <Card className="dark:bg-gray-800 dark:text-gray-200">
          <CardHeader>
            <CardTitle className="text-xl font-semibold flex items-center">
              <MapPin className="h-5 w-5 mr-2 text-orange-600" /> Geography & Climate
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableBody>
                {geographyClimate.map((item, index) => (
                  <TableRow key={index}>
                    <TableCell className="font-medium w-1/3">{item.label}</TableCell>
                    <TableCell className="w-2/3">{item.value}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Transportation & Mobility */}
        <Card className="dark:bg-gray-800 dark:text-gray-200">
          <CardHeader>
            <CardTitle className="text-xl font-semibold flex items-center">
              <Car className="h-5 w-5 mr-2 text-red-600" /> Transportation & Mobility
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-2">Transportation Network</h3>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-1/3">Type</TableHead>
                    <TableHead>Details</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {transportationNetwork.map((item, index) => (
                    <TableRow key={index}>
                      <TableCell className="font-medium">{item.type}</TableCell>
                      <TableCell>{item.details}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-2">Mobility Statistics</h3>
              <Table>
                <TableBody>
                  {mobilityStatistics.map((item, index) => (
                    <TableRow key={index}>
                      <TableCell className="font-medium w-1/2">{item.label}</TableCell>
                      <TableCell className="w-1/2">{item.value}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        {/* Economy */}
        <Card className="dark:bg-gray-800 dark:text-gray-200">
          <CardHeader>
            <CardTitle className="text-xl font-semibold flex items-center">
              <DollarSign className="h-5 w-5 mr-2 text-yellow-600" /> Economy
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableBody>
                {economyData.map((item, index) => (
                  <TableRow key={index}>
                    <TableCell className="font-medium w-1/3">{item.label}</TableCell>
                    <TableCell className="w-2/3">{item.value}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Education & Research */}
        <Card className="dark:bg-gray-800 dark:text-gray-200">
          <CardHeader>
            <CardTitle className="text-xl font-semibold flex items-center">
              <GraduationCap className="h-5 w-5 mr-2 text-indigo-600" /> Education & Research
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableBody>
                {educationResearch.map((item, index) => (
                  <TableRow key={index}>
                    <TableCell className="font-medium w-1/3">{item.label}</TableCell>
                    <TableCell className="w-2/3">{item.value}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Culture & Tourism */}
        <Card className="dark:bg-gray-800 dark:text-gray-200">
          <CardHeader>
            <CardTitle className="text-xl font-semibold flex items-center">
              <Palette className="h-5 w-5 mr-2 text-pink-600" /> Culture & Tourism
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-2">Main Landmarks</h3>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-1/3">Name</TableHead>
                    <TableHead>Description</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {landmarkData.map((item, index) => (
                    <TableRow key={index}>
                      <TableCell className="font-medium">{item.name}</TableCell>
                      <TableCell>{item.description}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-2">Festivals & Events</h3>
              <ul className="list-disc list-inside pl-4 space-y-1 text-gray-700 dark:text-gray-300">
                {festivalsEvents.map((event, index) => (
                  <li key={index}>{event}</li>
                ))}
              </ul>
            </div>
          </CardContent>
        </Card>

        {/* Torino's Signature Cuisine */}
        <Card className="dark:bg-gray-800 dark:text-gray-200">
          <CardHeader>
            <CardTitle className="text-xl font-semibold flex items-center">
              <Utensils className="h-5 w-5 mr-2 text-brown-600" /> Torino's Signature Cuisine
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-1/3">Food / Drink</TableHead>
                  <TableHead>Description</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {cuisineData.map((item, index) => (
                  <TableRow key={index}>
                    <TableCell className="font-medium">{item.item}</TableCell>
                    <TableCell>{item.description}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Visual Gallery (Placeholder) */}
        <Card className="dark:bg-gray-800 dark:text-gray-200">
          <CardHeader>
            <CardTitle className="text-xl font-semibold flex items-center">
              <Palette className="h-5 w-5 mr-2 text-teal-600" /> Visual Gallery
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-700 dark:text-gray-300 mb-4">
              Here are some visual highlights of Torino. (Image integration would go here)
            </p>
            <ul className="list-disc list-inside pl-4 space-y-1 text-gray-700 dark:text-gray-300">
              {visualGallery.map((item, index) => (
                <li key={index}>{item}</li>
              ))}
            </ul>
          </CardContent>
        </Card>

        {/* Demographics */}
        <Card className="dark:bg-gray-800 dark:text-gray-200">
          <CardHeader>
            <CardTitle className="text-xl font-semibold flex items-center">
              <Users className="h-5 w-5 mr-2 text-cyan-600" /> Demographics
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableBody>
                {demographicsData.map((item, index) => (
                  <TableRow key={index}>
                    <TableCell className="font-medium w-1/2">{item.label}</TableCell>
                    <TableCell className="w-1/2">{item.value}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Smart City Initiatives */}
        <Card className="dark:bg-gray-800 dark:text-gray-200">
          <CardHeader>
            <CardTitle className="text-xl font-semibold flex items-center">
              <Lightbulb className="h-5 w-5 mr-2 text-lime-600" /> Smart City Initiatives
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="list-disc list-inside pl-4 space-y-1 text-gray-700 dark:text-gray-300">
              {smartCityInitiatives.map((item, index) => (
                <li key={index}>{item}</li>
              ))}
            </ul>
          </CardContent>
        </Card>

        {/* Quotes & Motto */}
        <Card className="dark:bg-gray-800 dark:text-gray-200">
          <CardHeader>
            <CardTitle className="text-xl font-semibold flex items-center">
              <Quote className="h-5 w-5 mr-2 text-gray-600" /> Quotes & Motto
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 text-gray-700 dark:text-gray-300 italic">
              {quotesMotto.map((quote, index) => (
                <p key={index}>&ldquo;{quote.replace(/“|”/g, '')}&rdquo;</p>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Summary Table */}
        <Card className="dark:bg-gray-800 dark:text-gray-200">
          <CardHeader>
            <CardTitle className="text-xl font-semibold flex items-center">
              <Info className="h-5 w-5 mr-2 text-blue-600" /> Quick Statistics
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-1/2">Indicator</TableHead>
                  <TableHead className="w-1/2">Value</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {summaryTableData.map((item, index) => (
                  <TableRow key={index}>
                    <TableCell className="font-medium">{item.indicator}</TableCell>
                    <TableCell>{item.value}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default AboutTorinoPage;
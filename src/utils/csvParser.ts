import Papa from 'papaparse';

interface TorinoData {
  latitude: number;
  longitude: number;
  [key: string]: any; // Allow for other properties in the CSV
}

export const fetchAndParseTorinoCSV = async (filePath: string): Promise<TorinoData[]> => {
  try {
    const response = await fetch(filePath);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const csvText = await response.text();

    return new Promise((resolve, reject) => {
      Papa.parse(csvText, {
        header: true, // Assumes the first row is headers
        dynamicTyping: true, // Automatically convert numbers, booleans, etc.
        skipEmptyLines: true,
        complete: (results) => {
          if (results.errors.length) {
            console.error("CSV parsing errors:", results.errors);
            reject(new Error("Error parsing CSV file"));
            return;
          }
          const parsedData: TorinoData[] = results.data.map((row: any) => ({
            latitude: parseFloat(row.latitude),
            longitude: parseFloat(row.longitude),
            ...row, // Keep other data from the row
          })).filter(row => !isNaN(row.latitude) && !isNaN(row.longitude)); // Filter out rows with invalid lat/lng

          resolve(parsedData);
        },
        error: (error: Error) => {
          reject(error);
        }
      });
    });
  } catch (error) {
    console.error("Failed to fetch or parse CSV:", error);
    return [];
  }
};
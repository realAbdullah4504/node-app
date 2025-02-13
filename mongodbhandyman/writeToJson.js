const fs = require('fs');
const csvParser = require('csv-parser');

// Define the interface for Postal Code data
const processCSV = async (csvFilePath) => {
  let data = [];

  // Read CSV file
  await new Promise((resolve, reject) => {
    fs.createReadStream(csvFilePath)
      .pipe(csvParser({ separator: ';', quote: '"' }))
      .on('data', (row) => {
        // Map CSV row to IPostalCode interface fields
        data.push({
          Postal_Code: parseInt(row['codigopostalid']),
          Place_Name: row['poblacion'],
          Latitude: parseFloat(row['lat']),
          Longitude: parseFloat(row['lon']),
          // location: {
          //   coordinates: [
          //     parseFloat(row['lat']),
          //     parseFloat(row['lon'])
          //   ]
          // },
          Admin_Name3: row['provincia'],
          Admin_Code3: parseInt(row['provinciaid']),
        });

      })
      .on('end', () => {
        resolve();
      })
      .on('error', (error) => {
        reject(error);
      });
  });

  return data;
};

const writeJSONToFile = async (data, outputFilePath) => {
  const jsonData = JSON.stringify(data, null, 2); // Convert to JSON with 2-space indentation
  await fs.promises.writeFile(outputFilePath, jsonData, 'utf8');
};

const main = async () => {
  try {
    const data = await processCSV("./postalcode.csv");
    await writeJSONToFile(data, "./output.json");
    console.log('CSV data successfully converted and written to output.json');
  } catch (error) {
    console.error('Error processing CSV file:', error);
  }
};

main();

// const data = require("./output.json");

// console.log(data.slice(0, 2));




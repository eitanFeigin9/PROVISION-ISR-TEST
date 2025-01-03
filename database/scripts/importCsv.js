const fs = require('fs');
const csv = require('csv-parser');
const { PrismaClient } = require('@prisma/client');
require('dotenv').config({ path: '../.env' }); // Ensure .env is loaded

const prisma = new PrismaClient();

async function importCSV() {
  const results = [];
  const filePath = '../‏‏IP2LOCATION-LITE-DB3.CSV';

  fs.createReadStream(filePath)
    .pipe(csv(['ipStart', 'ipEnd', 'countryCode', 'countryName', 'region', 'city']))
    .on('data', (data) => results.push(data))
    .on('end', async () => {
      console.log('CSV parsing completed. Starting database import...');
      for (const record of results) {
        try {
          await prisma.ip_mapping_data.create({
            data: {
              ipStart: BigInt(record.ipStart),
              ipEnd: BigInt(record.ipEnd),
              countryCode: record.countryCode,
              countryName: record.countryName,
              region: record.region,
              city: record.city,
            },
          });
        } catch (error) {
          console.error('Error inserting record:', record, error);
        }
      }
      console.log('Data imported successfully');
      await prisma.$disconnect();
    });
}

importCSV().catch(async (e) => {
  console.error('Error during import:', e);
  await prisma.$disconnect();
});

process.on('uncaughtException', async (err) => {
  console.error('Unhandled exception:', err);
  await prisma.$disconnect();
});
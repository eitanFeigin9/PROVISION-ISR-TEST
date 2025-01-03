import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import { PrismaClient } from "@prisma/client";
import fetch from "node-fetch";

const app = express();
const prisma = new PrismaClient();
const serverPort = 3000;
const internalServerErrorCode = 500;
const pageNotFoundCode = 404;
const requestClientErrorCode = 400;

app.use(bodyParser.json());
app.use(cors());

const convertBigIntToIp = (bigInt) => {
    // Utility function to convert BigInt to IPv4.
    return [
        (Number(bigInt) >>> 24) & 255,
        (Number(bigInt) >>> 16) & 255,
        (Number(bigInt) >>> 8) & 255,
        Number(bigInt) & 255,
    ].join('.');
};

app.use((req, res, next) => {
    const originalJson = res.json.bind(res);
    res.json = (data) => {
        // Transform BigInt to string for JSON.
        const transformed = JSON.parse(
            JSON.stringify(data, (key, value) => (typeof value === "bigint" ? value.toString() : value))
        );
        originalJson(transformed); 
    };
    next(); 
});

app.get("/ips", async (req, res) => {
    //It gets a category and order and sorts the data by the sorting category in the requested order.
    const { sortBy = 'countryName', order = 'ASC' } = req.query; 
    try {
        //Fetch IP data from the database with sorting.
        const ips = await prisma.ip_mapping_data.findMany({
            orderBy: {
                [sortBy]: order.toUpperCase() === 'ASC' ? 'asc' : 'desc', 
            },
        });

        //Convert BigInt IPs to IPv4 format.
        const formattedIps = ips.map(ip => ({
            ...ip,
            ipStart: convertBigIntToIp(BigInt(ip.ipStart)),
            ipEnd: convertBigIntToIp(BigInt(ip.ipEnd)) 
        }));

        res.json(formattedIps); 
    } catch (error) {
        console.error(error); 
        res.status(internalServerErrorCode).json({ error: "Failed to fetch IP data." }); 
    }
});

app.get("/countries", async (req, res) => {
    //Fetch ditinct countries values by sorting
    const { sort = "ASC" } = req.query; 

    if (!["ASC", "DESC"].includes(sort.toUpperCase())) {
        return res.status(requestClientErrorCode).json({ error: "Invalid sort parameter. Use 'ASC' or 'DESC'." });
    }

    try {
        const countries = await prisma.ip_mapping_data.findMany({
            distinct: ['countryName'], 
            orderBy: {
                countryName: sort.toUpperCase() === 'ASC' ? 'asc' : 'desc', 
            },
        });

        res.json(countries); 
    } catch (error) {
        console.error(error); 
        res.status(internalServerErrorCode).json({ error: "Failed to fetch country data." }); 
    }
});

// Route to fetch details for a specific country by name
app.get("/country/:name", async (req, res) => {
    //Return a specific country data (amount of values and a picture) by name.
    const { name } = req.params; // Get the country name.

    try {
        //Count how many different values exist for the given country.
        const count = await prisma.ip_mapping_data.count({
            where: { countryName: name }, 
        });

        //Fetch the flag image for the given country from an external API.
        const flagResponse = await fetch(`https://restcountries.com/v3.1/name/${encodeURIComponent(name)}`);
        if (!flagResponse.ok) {
            return res.status(pageNotFoundCode).json({ error: "Country not found." }); 
        }
        const flagData = await flagResponse.json(); //Parse the flag data.

        res.json({ count, flag: flagData[0]?.flags?.svg });
    } catch (error) {
        console.error(error);
        res.status(internalServerErrorCode).json({ error: "Failed to fetch country details." }); 
    }
});

app.listen(serverPort, () => {
    //Start the server.
    console.log(`Server is running on port ${serverPort}`);
});

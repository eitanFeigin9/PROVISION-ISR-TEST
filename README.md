Overview

The IP Mapping Provision project is a full-stack application designed to handle and visualize IP range data. The project is built with:
Frontend: Angular
Backend: Node.js 
Database: MySQL (managed with Prisma ORM)

Features
Parse and process large CSV files containing IP range data.
Display IP range data on an interactive UI.
Search, filter, and select IP ranges by country, region, or city.
Modular architecture for easy scalability.

Prerequisites
Before running the project, ensure the following are installed on your system:
Node.js (v16 or later)
npm (Node Package Manager)


Project Structure

IP-MAPPING-PROVISION/
├── angular/              # Frontend Angular application
├── backend/              # Backend Node.js application
│   ├── server/           # Server logic
├── database/             # Database files (e.g., schema, migrations, CSVs)
├── run.bat               # Script to run both frontend and backend
├── .gitignore            # Git ignored files
├── package.json          # Project dependencies and scripts


Usage
To run the project, use the run.bat script located in the root folder. This script will:
Start the backend server.
Serve the Angular frontend.

Steps:
Run the script:
./run.bat
Open your browser and navigate to:
http://localhost:4200

License
This project is licensed under the MIT License. See the LICENSE file for details.

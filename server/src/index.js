const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const path = require("path");
const configureApp = require("./settings/config.js");
const seedAdmin  = require("./seeders/seedAdmin.js");

// Set the defaul environment
process.env.NODE_ENV = process.env.NODE_ENV || "development";
console.log(`Current Environment: ${process.env.NODE_ENV}`);

// Load Environment variables from different files based on environment
const envFile = `.env.${process.env.NODE_ENV}`;
console.log(`Loading environment variables from: ${envFile}`);
dotenv.config({ path: path.join(__dirname, "..", envFile) });


const app = express();
const port = parseInt(process.env.PORT) || 3001;


//  Parsing request body
app.use(express.json());
configureApp(app);

async function bootstrap() {
  try {
    const databaseUrl = process.env.DATABASE_URL || process.env.MONGO_URI;
    if (!databaseUrl) {
      throw new Error("Set DATABASE_URL or MONGO_URI in the server environment file.");
    }

    await mongoose.connect(databaseUrl, {
      ...(process.env.DATABASE_NAME && { dbName: process.env.DATABASE_NAME }),
    });
    console.log("Connected to MongoDB");
    await seedAdmin();

    app.listen(port, () => {
      console.log(`App listening on port ${port}`);
    });

  } catch (error) {
    console.error(error);
    /** An exit code of 1 typically indicates that there was an error or abnormal termination of the program, which is often used to signal failure in scenarios where the program encounters critical issues that prevent normal operation. */
    process.exit(1);
  }
}

bootstrap();

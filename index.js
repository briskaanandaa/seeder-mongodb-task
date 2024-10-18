const { readFileSync } = require("fs");
const fs = require("fs");
const mongoose = require("mongoose");
const seed = require("./seed.json");
require("dotenv").config();

async function main() {
  /**--------------- Not allowed to be edited - start - --------------------- */
  const mongoUri = process.env.MONGODB_URI;
  const collection = process.env.MONGODB_COLLECTION;

  const args = process.argv.slice(2);

  const command = args[0];
  /**--------------- Not allowed to be edited - end - --------------------- */

  // Connect to MongoDB
  await mongoose.connect(mongoUri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  // {
  //   "title": "Inception",
  //   "year": 2010,
  //   "genre": ["Action", "Sci-Fi", "Thriller"],
  //   "description": "A thief who steals corporate secrets through the use of dream-sharing technology is given the inverse task of planting an idea into the mind of a CEO.",
  //   "director": "Christopher Nolan",
  //   "cast": ["Leonardo DiCaprio", "Joseph Gordon-Levitt", "Ellen Page", "Tom Hardy"]
  // },

  // Define a schema for the collection
  const schema = new mongoose.Schema(
    {
      title: String,
      year: Number,
      genre: [String],
      description: String,
      direction: String,
      cast: [String],
    },
    { strict: false }
  );
  const MovieModel = mongoose.model(collection, schema);

  switch (command) {
    // Melakukan Cek koneksi DB
    case "check-db-connection":
      await checkConnection();
      break;
    case "reset-db":
      break;
    case "bulk-insert":
      const data = fs.readFileSync("./seed.json");
      const parsed = JSON.parse(data);
      console.log(JSON.parse(data));
      await MovieModel.insertMany(parsed);
      break;
    default:
      throw Error("command not found");
  }

  await mongoose.disconnect();
  return;
}

async function checkConnection() {
  console.log("check db connection started...");
  try {
    await mongoose.connection.db.admin().ping();
    console.log("MongoDB connection is successful!");
  } catch (err) {
    console.error("MongoDB connection failed:", err);
  }
  console.log("check db connection ended...");
}

main();

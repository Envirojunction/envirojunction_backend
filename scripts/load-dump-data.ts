import * as fs from 'fs';
import * as path from 'path';
import * as dotenv from 'dotenv';
import mongoose from 'mongoose';
import * as BSON from 'bson';

// Load environment variables from .env
dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/enviro_prod';
const DUMP_DIR = path.join(__dirname, 'dump', 'enviro_prod');

interface CollectionTask {
  filename: string;
  collectionName: string;
  displayName: string;
}

const TASKS: CollectionTask[] = [
  { filename: 'jobs.bson', collectionName: 'jobs', displayName: '💼 Jobs' },
  { filename: 'tenders.bson', collectionName: 'tenders', displayName: '📜 Tenders' },
  { filename: 'news.bson', collectionName: 'news', displayName: '📰 News' },
];

function readBsonFile(filePath: string): any[] {
  if (!fs.existsSync(filePath)) {
    console.warn(`⚠️  File not found: ${filePath}`);
    return [];
  }

  const buffer = fs.readFileSync(filePath);
  const docs: any[] = [];
  let index = 0;

  while (index < buffer.length) {
    const size = buffer.readInt32LE(index);
    if (size <= 0 || index + size > buffer.length) {
      break;
    }
    const docBuffer = buffer.subarray(index, index + size);
    docs.push(BSON.deserialize(docBuffer));
    index += size;
  }

  return docs;
}

async function loadCollection(
  db: mongoose.mongo.Db,
  task: CollectionTask,
) {
  const filePath = path.join(DUMP_DIR, task.filename);
  console.log(`\n⏳ Reading ${task.displayName} (${task.filename})...`);

  const docs = readBsonFile(filePath);
  if (docs.length === 0) {
    console.log(`ℹ️  No documents found in ${task.filename}`);
    return;
  }

  const collection = db.collection(task.collectionName);

  // Clear existing documents to avoid duplicates
  console.log(`   Clearing existing ${task.collectionName} collection...`);
  await collection.deleteMany({});

  // Insert documents in batches of 500
  const batchSize = 500;
  let inserted = 0;

  for (let i = 0; i < docs.length; i += batchSize) {
    const batch = docs.slice(i, i + batchSize);
    await collection.insertMany(batch, { ordered: false });
    inserted += batch.length;
    process.stdout.write(`   Inserted ${inserted}/${docs.length} items...\r`);
  }

  console.log(`\n✅ Successfully loaded ${inserted} documents into '${task.collectionName}' collection.`);
}

async function main() {
  console.log('╔═══════════════════════════════════════════════════════════╗');
  console.log('║        🌍 ENVIRO JUNCTION - DATA RESTORE SCRIPT 🌍        ║');
  console.log('╚═══════════════════════════════════════════════════════════╝');

  console.log(`\n🔌 Connecting to MongoDB Atlas...`);
  await mongoose.connect(MONGODB_URI);
  console.log(`✅ Connected successfully!`);

  const db = mongoose.connection.db;
  if (!db) {
    throw new Error('Database connection failed');
  }

  for (const task of TASKS) {
    await loadCollection(db, task);
  }

  await mongoose.disconnect();
  console.log(`\n🎉 All data (News, Tenders, Jobs) restored successfully to MongoDB!`);
  console.log(`\nYou can now test your endpoints:`);
  console.log(`  GET http://localhost:3000/news`);
  console.log(`  GET http://localhost:3000/jobs`);
  console.log(`  GET http://localhost:3000/tenders\n`);
}

main().catch((err) => {
  console.error('\n❌ Error restoring data:', err);
  process.exit(1);
});


import { MongoClient, type MongoClientOptions } from 'mongodb';

const uri = process.env.MONGODB_URI;

if (!uri) {
  throw new Error('Missing MONGODB_URI in environment variables.');
}

const options: MongoClientOptions = {
  appName: 'provela-esports',
  maxIdleTimeMS: 5000,
};

declare global {
  // eslint-disable-next-line no-var
  var _mongoClientPromise: Promise<MongoClient> | undefined;
}

let clientPromise: Promise<MongoClient>;

if (process.env.NODE_ENV === 'development') {
  if (!global._mongoClientPromise) {
    const client = new MongoClient(uri, options);
    global._mongoClientPromise = client.connect();
  }
  clientPromise = global._mongoClientPromise;
} else {
  const client = new MongoClient(uri, options);
  clientPromise = client.connect();
}

export default clientPromise;

export function getDatabaseName(): string {
  return process.env.MONGODB_DB_NAME ?? 'provelaDB';
}

export async function getDb() {
  const client = await clientPromise;
  return client.db(getDatabaseName());
}

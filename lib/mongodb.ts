import { MongoClient, type MongoClientOptions } from 'mongodb';

declare global {
  // eslint-disable-next-line no-var
  var _mongoClientPromise: Promise<MongoClient> | undefined;
}

function getUri() {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    throw new Error('Missing MONGODB_URI in environment variables.');
  }
  return uri;
}

const options: MongoClientOptions = {
  appName: 'provela-esports',
  maxIdleTimeMS: 5000,
};

let clientPromise: Promise<MongoClient> | null = null;

function initializeClient(): Promise<MongoClient> {
  if (clientPromise) {
    return clientPromise;
  }

  const uri = getUri();

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

  return clientPromise;
}

export default function getClientPromise(): Promise<MongoClient> {
  return initializeClient();
}

export function getDatabaseName(): string {
  return process.env.MONGODB_DB_NAME ?? 'provelaDB';
}

export async function getDb() {
  const clientPromise = initializeClient();
  const client = await clientPromise;
  return client.db(getDatabaseName());
}

import { NextResponse } from 'next/server';
import clientPromise, { getDatabaseName } from '@/lib/mongodb';

export async function GET() {
  try {
    const client = await clientPromise;
    await client.db('admin').command({ ping: 1 });

    const dbName = getDatabaseName();
    const db = client.db(dbName);
    const collections = await db.listCollections().toArray();

    return NextResponse.json({
      ok: true,
      database: dbName,
      collections: collections.map((collection) => collection.name),
    });
  } catch (error) {
    return NextResponse.json(
      {
        ok: false,
        error: error instanceof Error ? error.message : 'MongoDB connection failed.',
      },
      { status: 500 },
    );
  }
}

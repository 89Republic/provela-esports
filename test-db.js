const { MongoClient } = require('mongodb');

async function testConnection() {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    console.error('❌ MONGODB_URI not set');
    process.exit(1);
  }
  
  const client = new MongoClient(uri, { appName: 'test-connection' });
  try {
    console.log('Connecting to MongoDB...');
    await client.connect();
    console.log('✅ Connected successfully!');
    
    const admin = client.db('admin');
    const result = await admin.command({ ping: 1 });
    console.log('✅ Ping successful:', result);
    
    const db = client.db(process.env.MONGODB_DB_NAME || 'provelaDB');
    const collections = await db.listCollections().toArray();
    console.log('✅ Collections:', collections.map(c => c.name));
    
  } catch (error) {
    console.error('❌ Connection failed:', error.message);
    process.exit(1);
  } finally {
    await client.close();
  }
}

testConnection();

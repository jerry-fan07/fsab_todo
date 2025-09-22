const db = require('./firebase');

async function testDatabaseConnection() {
  try {
    console.log('Testing Firebase connection...');
    
    // Try to write a test document
    const testRef = await db.collection('connection-test').add({
      message: 'Testing database connection',
      timestamp: new Date(),
      status: 'success'
    });
    
    console.log('✅ Successfully connected to Firebase!');
    console.log('Test document ID:', testRef.id);
    
    // Try to read it back
    const doc = await db.collection('connection-test').doc(testRef.id).get();
    console.log('✅ Successfully read document:', doc.data());
    
    // Clean up
    await db.collection('connection-test').doc(testRef.id).delete();
    console.log('✅ Test document cleaned up');
    
  } catch (error) {
    console.error('❌ Connection failed:', error.message);
    
    // More detailed error information
    if (error.code === 7) {
      console.error('Permission denied. Check your Firestore security rules.');
    } else if (error.code === 16) {
      console.error('Authentication failed. Check your service account key.');
    }
  }
}

testDatabaseConnection();
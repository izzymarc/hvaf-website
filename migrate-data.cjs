const admin = require('firebase-admin');
const dotenv = require('dotenv');

dotenv.config();

// Initialize Firebase Admin SDK with service account
const serviceAccount = {
  projectId: process.env.FIREBASE_PROJECT_ID,
  clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
  privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n')
};

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

async function migrateImages() {
  const imagesCollection = db.collection('galleryImages');
  const publicImagesCollection = db.collection('publicGalleryImages');
  
  const querySnapshot = await imagesCollection.get();
  
  for (const doc of querySnapshot.docs) {
    const data = doc.data();
    if (data.isActive) {
      await publicImagesCollection.add({
        ...data,
        order: Date.now(),
        id: doc.id
      });
    }
  }
}

async function migrateVideos() {
  const videosCollection = db.collection('galleryVideos');
  const publicVideosCollection = db.collection('publicGalleryVideos');
  
  const querySnapshot = await videosCollection.get();
  
  for (const doc of querySnapshot.docs) {
    const data = doc.data();
    if (data.isActive) {
      await publicVideosCollection.add({
        ...data,
        order: Date.now(),
        id: doc.id
      });
    }
  }
}

async function runMigrations() {
  try {
    console.log('Starting migrations...');
    
    console.log('Migrating images...');
    await migrateImages();
    
    console.log('Migrating videos...');
    await migrateVideos();
    
    console.log('Migrations completed successfully!');
  } catch (error) {
    console.error('Migration failed:', error);
  }
}

runMigrations();

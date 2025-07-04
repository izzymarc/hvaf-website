import { getFirestore, collection, getDocs, addDoc, doc, updateDoc } from 'firebase/firestore';
import { app } from '@/lib/firebase';
import { GalleryImage, GalleryVideo } from './gallery-data';

const db = getFirestore(app);

export const migrateImages = async () => {
  const imagesCollection = collection(db, 'galleryImages');
  const publicImagesCollection = collection(db, 'publicGalleryImages');
  
  const querySnapshot = await getDocs(imagesCollection);
  
  for (const doc of querySnapshot.docs) {
    const data = doc.data() as GalleryImage;
    if (data.isActive) {
      await addDoc(publicImagesCollection, {
        ...data,
        order: Date.now(), // Use current timestamp for ordering
        id: doc.id // Preserve the original ID
      });
    }
  }
};

export const migrateVideos = async () => {
  const videosCollection = collection(db, 'galleryVideos');
  const publicVideosCollection = collection(db, 'publicGalleryVideos');
  
  const querySnapshot = await getDocs(videosCollection);
  
  for (const doc of querySnapshot.docs) {
    const data = doc.data() as GalleryVideo;
    if (data.isActive) {
      await addDoc(publicVideosCollection, {
        ...data,
        order: Date.now(), // Use current timestamp for ordering
        id: doc.id // Preserve the original ID
      });
    }
  }
};

// Run the migrations
const runMigrations = async () => {
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
};

// Uncomment to run the migrations
// runMigrations();

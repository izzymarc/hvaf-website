import { initializeApp } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';

// Initialize Firebase Admin SDK
initializeApp({
  credential: require('./service-account.json')
});

const db = getFirestore();

async function migrateStats() {
  try {
    const statsRef = db.collection('site').doc('statistics');
    const doc = await statsRef.get();

    if (!doc.exists) {
      console.log('Creating statistics document with default values...');
      await statsRef.set({
        childrenHelped: 0,
        programsRunning: 0,
        successRate: 0,
        partnerOrganizations: 0
      });
      console.log('Statistics document created successfully!');
    } else {
      console.log('Statistics document already exists');
    }
  } catch (error) {
    console.error('Error migrating statistics:', error);
  }
}

migrateStats();

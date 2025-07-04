import dotenv from 'dotenv';
import { migrateImages, migrateVideos } from './dist/src/lib/migrate-data.js';

dotenv.config();

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

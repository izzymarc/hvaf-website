import { getFirestore, collection, getDocs, query, where, addDoc, deleteDoc, doc, updateDoc, orderBy } from 'firebase/firestore';
import { app } from '@/lib/firebase';

const db = getFirestore(app);
const publicImagesCollection = collection(db, 'publicGalleryImages');
const publicVideosCollection = collection(db, 'publicGalleryVideos');

export interface GalleryImage {
  id: string;
  url: string;
  title: string;
  description?: string;
  createdAt: Date;
  order: number; // For ordering
  isActive: boolean;
}

export interface GalleryVideo {
  id: string;
  youtubeId: string;
  title: string;
  description?: string;
  createdAt: Date;
  order: number; // For ordering
  isActive: boolean;
}

// Static gallery data as fallback
const staticImages: GalleryImage[] = [
  {
    id: 'static-1',
    url: '/gallery/hvaf-photo-1.jpeg',
    title: 'Community Outreach Program',
    description: 'HVAF team members engaging with local community members',
    createdAt: new Date('2025-07-04'),
    order: 1,
    isActive: true
  },
  {
    id: 'static-2',
    url: '/gallery/hvaf-photo-2.jpeg',
    title: 'Educational Support Initiative',
    description: 'Providing educational resources and support to students',
    createdAt: new Date('2025-07-04'),
    order: 2,
    isActive: true
  },
  {
    id: 'static-3',
    url: '/gallery/hvaf-photo-3.jpeg',
    title: 'Healthcare Access Program',
    description: 'Delivering healthcare services to underserved communities',
    createdAt: new Date('2025-07-04'),
    order: 3,
    isActive: true
  },
  {
    id: 'static-4',
    url: '/gallery/hvaf-photo-4.jpeg',
    title: 'Humanitarian Aid Distribution',
    description: 'Distributing essential supplies to families in need',
    createdAt: new Date('2025-07-04'),
    order: 4,
    isActive: true
  }
];

const staticVideos: GalleryVideo[] = [
  {
    id: 'static-video-1',
    youtubeId: 'local-video-1', // Will be handled differently for local videos
    title: 'HVAF Community Impact Documentary',
    description: 'A documentary showcasing the impact of our community programs',
    createdAt: new Date('2025-07-04'),
    order: 1,
    isActive: true
  },
  {
    id: 'static-video-2',
    youtubeId: 'local-video-2',
    title: 'Educational Support in Action',
    description: 'Behind the scenes of our educational support initiatives',
    createdAt: new Date('2025-07-04'),
    order: 2,
    isActive: true
  },
  {
    id: 'static-video-3',
    youtubeId: 'local-video-3',
    title: 'Healthcare Outreach Program',
    description: 'Our mobile healthcare services reaching remote communities',
    createdAt: new Date('2025-07-04'),
    order: 3,
    isActive: true
  }
];

export const getGalleryImages = async (): Promise<GalleryImage[]> => {
  try {
    const q = query(publicImagesCollection, 
      where('isActive', '==', true)
    );
    const querySnapshot = await getDocs(q);
    const firebaseImages = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as GalleryImage));
    
    // Always include static images, then add Firebase images
    const allImages = [...staticImages, ...firebaseImages];
    return allImages.sort((a, b) => a.order - b.order);
  } catch (error) {
    console.warn('Firebase unavailable, using static images only:', error);
    return staticImages;
  }
};

export const getGalleryVideos = async (): Promise<GalleryVideo[]> => {
  try {
    const q = query(publicVideosCollection, 
      where('isActive', '==', true)
    );
    const querySnapshot = await getDocs(q);
    const firebaseVideos = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as GalleryVideo));
    
    // Always include static videos, then add Firebase videos
    const allVideos = [...staticVideos, ...firebaseVideos];
    return allVideos.sort((a, b) => a.order - b.order);
  } catch (error) {
    console.warn('Firebase unavailable, using static videos only:', error);
    return staticVideos;
  }
};

export const addGalleryImage = async (image: Omit<GalleryImage, 'id'>): Promise<GalleryImage> => {
  const newImage = {
    ...image,
    createdAt: new Date(),
    isActive: true,
    order: Date.now() // Use timestamp for ordering
  };
  
  const docRef = await addDoc(publicImagesCollection, newImage);
  return {
    id: docRef.id,
    ...newImage
  };
};

export const addGalleryVideo = async (video: Omit<GalleryVideo, 'id'>): Promise<GalleryVideo> => {
  const newVideo = {
    ...video,
    createdAt: new Date(),
    isActive: true,
    order: Date.now() // Use timestamp for ordering
  };
  
  const docRef = await addDoc(publicVideosCollection, newVideo);
  return {
    id: docRef.id,
    ...newVideo
  };
};

export const deleteGalleryImage = async (id: string) => {
  const docRef = doc(db, 'publicGalleryImages', id);
  await updateDoc(docRef, { isActive: false });
};

export const deleteGalleryVideo = async (id: string) => {
  const docRef = doc(db, 'publicGalleryVideos', id);
  await updateDoc(docRef, { isActive: false });
};

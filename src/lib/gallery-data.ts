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

export const getGalleryImages = async (): Promise<GalleryImage[]> => {
  const q = query(publicImagesCollection, 
    where('isActive', '==', true)
  );
  const querySnapshot = await getDocs(q);
  const images = querySnapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  } as GalleryImage));
  return images.sort((a, b) => a.order - b.order);
};

export const getGalleryVideos = async (): Promise<GalleryVideo[]> => {
  const q = query(publicVideosCollection, 
    where('isActive', '==', true)
  );
  const querySnapshot = await getDocs(q);
  const videos = querySnapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  } as GalleryVideo));
  return videos.sort((a, b) => a.order - b.order);
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

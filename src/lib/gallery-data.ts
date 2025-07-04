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
    title: 'Educational Empowerment Program',
    description: 'HVAF team celebrating with students who received educational support and scholarships',
    createdAt: new Date('2025-07-04'),
    order: 1,
    isActive: true
  },
  {
    id: 'static-2',
    url: '/gallery/hvaf-photo-2.jpeg',
    title: 'School Fees Support Initiative',
    description: 'Supporting families by covering school fees, ensuring no child is denied education due to financial constraints',
    createdAt: new Date('2025-07-04'),
    order: 2,
    isActive: true
  },
  {
    id: 'static-3',
    url: '/gallery/hvaf-photo-3.jpeg',
    title: 'Student Uniform Distribution',
    description: 'Providing quality school uniforms to help students attend classes with dignity and confidence',
    createdAt: new Date('2025-07-04'),
    order: 3,
    isActive: true
  },
  {
    id: 'static-4',
    url: '/gallery/hvaf-photo-4.jpeg',
    title: 'Educational Supplies Distribution',
    description: 'Distributing books, stationery, and learning materials to students in underserved communities',
    createdAt: new Date('2025-07-04'),
    order: 4,
    isActive: true
  },
  {
    id: 'static-5',
    url: '/gallery/hvaf-photo-5.jpg',
    title: 'Scholarship Award Ceremony',
    description: 'Celebrating academic excellence and awarding scholarships to deserving students for higher education',
    createdAt: new Date('2025-07-04'),
    order: 5,
    isActive: true
  }
];

const staticVideos: GalleryVideo[] = [
  {
    id: 'static-video-1',
    youtubeId: 'local-video-1', // Will be handled differently for local videos
    title: 'School Fees Payment Initiative',
    description: 'HVAF supporting families by paying school fees for underprivileged children to ensure quality education access',
    createdAt: new Date('2025-07-04'),
    order: 1,
    isActive: true
  },
  {
    id: 'static-video-2',
    youtubeId: 'local-video-2',
    title: 'School Uniform Distribution Program',
    description: 'Providing new school uniforms to students in need, removing barriers to education and boosting student confidence',
    createdAt: new Date('2025-07-04'),
    order: 2,
    isActive: true
  },
  {
    id: 'static-video-3',
    youtubeId: 'local-video-3',
    title: 'Educational Support Documentation',
    description: 'Documenting the transformation in students\' lives through our educational assistance programs',
    createdAt: new Date('2025-07-04'),
    order: 3,
    isActive: true
  },
  {
    id: 'static-video-4',
    youtubeId: 'local-video-4',
    title: 'Student Scholarship Program',
    description: 'Following the journey of scholarship recipients and the impact of educational funding on their futures',
    createdAt: new Date('2025-07-04'),
    order: 4,
    isActive: true
  },
  {
    id: 'static-video-5',
    youtubeId: 'local-video-5',
    title: 'Back-to-School Campaign Success',
    description: 'Celebrating the success of our back-to-school initiative that provided essential supplies to hundreds of students',
    createdAt: new Date('2025-07-04'),
    order: 5,
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

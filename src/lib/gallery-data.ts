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
  },
  {
    id: 'static-6',
    url: '/gallery/hvaf-photo-8.jpg',
    title: 'Educational Workshop Series',
    description: 'Interactive workshops empowering students with essential life skills and academic excellence strategies',
    createdAt: new Date('2025-07-04'),
    order: 6,
    isActive: true
  },
  {
    id: 'static-7',
    url: '/gallery/hvaf-photo-10.jpg',
    title: 'School Infrastructure Support',
    description: 'Supporting schools with classroom improvements and essential learning infrastructure development',
    createdAt: new Date('2025-07-04'),
    order: 7,
    isActive: true
  },
  {
    id: 'static-8',
    url: '/gallery/hvaf-photo-11.jpg',
    title: 'Student Achievement Celebration',
    description: 'Recognizing and celebrating academic milestones and achievements of scholarship recipients',
    createdAt: new Date('2025-07-04'),
    order: 8,
    isActive: true
  },
  {
    id: 'static-9',
    url: '/gallery/hvaf-photo-12.jpg',
    title: 'Educational Technology Initiative',
    description: 'Introducing digital learning tools and technology access to enhance educational opportunities',
    createdAt: new Date('2025-07-04'),
    order: 9,
    isActive: true
  },
  {
    id: 'static-10',
    url: '/gallery/hvaf-photo-14.jpg',
    title: 'Educational Impact Assessment',
    description: 'Documenting the transformative impact of educational support on students and their families',
    createdAt: new Date('2025-07-04'),
    order: 10,
    isActive: true
  },
  {
    id: 'static-11',
    url: '/gallery/hvaf-photo-15.jpg',
    title: 'Academic Excellence Recognition',
    description: 'Celebrating outstanding academic achievements and recognizing students who excel in their studies',
    createdAt: new Date('2025-07-04'),
    order: 11,
    isActive: true
  },
  {
    id: 'static-12',
    url: '/gallery/hvaf-photo-16.jpg',
    title: 'Educational Leadership Development',
    description: 'Empowering students with leadership skills and preparing them to become future community leaders',
    createdAt: new Date('2025-07-04'),
    order: 12,
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
    youtubeId: 'local-video-11',
    title: 'Educational Capacity Building',
    description: 'Building educational capacity in communities through training programs and infrastructure development',
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

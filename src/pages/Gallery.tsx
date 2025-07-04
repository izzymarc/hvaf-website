
import React, { useState, useEffect } from 'react';
import Layout from '@/components/layout/Layout';
import { motion } from 'framer-motion';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { GalleryImage, GalleryVideo, getGalleryImages, getGalleryVideos } from '@/lib/gallery-data';

const Gallery = () => {
  const [selectedImage, setSelectedImage] = useState<GalleryImage | null>(null);
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [videos, setVideos] = useState<GalleryVideo[]>([]);
  const [activeTab, setActiveTab] = useState<string>('images');
  const [isLoadingImages, setIsLoadingImages] = useState(true);
  const [isLoadingVideos, setIsLoadingVideos] = useState(true);

  // Handle URL hash for tab selection
  useEffect(() => {
    const updateActiveTab = () => {
      const hash = window.location.hash.substring(1); // Remove the '#' character
      if (hash === 'images' || hash === 'videos') {
        setActiveTab(hash);
      }
    };

    // Update active tab on mount and hash change
    updateActiveTab();
    window.addEventListener('hashchange', updateActiveTab);

    // Clean up the event listener on unmount
    return () => window.removeEventListener('hashchange', updateActiveTab);
  }, []);

  // Fetch gallery data
  useEffect(() => {
    const fetchGallery = async () => {
      try {
        const [imgs, vids] = await Promise.all([
          getGalleryImages(),
          getGalleryVideos()
        ]);
        setImages(imgs);
        setVideos(vids);
        setIsLoadingImages(false);
        setIsLoadingVideos(false);
      } catch (error) {
        console.error('Error fetching gallery data:', error);
        // Don't clear the data on error to maintain user experience
      }
    };

    // Initial fetch
    fetchGallery();

    // Set up periodic refresh every 30 seconds
    const refreshInterval = setInterval(fetchGallery, 30000);

    // Clean up interval on unmount
    return () => clearInterval(refreshInterval);
  }, []);

  const openImageModal = (image: GalleryImage) => {
    setSelectedImage(image);
  };

  const extractYouTubeVideoId = (url: string): string => {
    return url;
  };

  return (
    <Layout>
      <motion.section
        className="py-16 bg-neutral-100"
        initial={{ opacity: 0, y: 60 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
      >
        <div className="container-custom">
          <motion.div
            className="max-w-3xl mx-auto text-center"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.7, ease: 'easeOut' }}
          >
            <h1 className="text-4xl md:text-5xl font-bold mb-6 text-brown-700">Gallery</h1>
            <p className="text-lg text-brown-600">
              Explore photos and videos of our work and impact around the world.
            </p>
          </motion.div>
        </div>
      </motion.section>

      <motion.section
        className="py-16"
        initial={{ opacity: 0, y: 60 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
      >
        <div className="container-custom">
          <Tabs value={activeTab} className="w-full" onValueChange={setActiveTab}>
            <div className="flex justify-center mb-8">
              <TabsList>
                <TabsTrigger
                  id="images"
                  value="images"
                  className="text-lg py-2 px-6 data-[state=active]:bg-primary data-[state=active]:text-white"
                >
                  Images
                </TabsTrigger>
                <TabsTrigger
                  id="videos"
                  value="videos"
                  className="text-lg py-2 px-6 data-[state=active]:bg-primary data-[state=active]:text-white"
                >
                  Videos
                </TabsTrigger>
              </TabsList>
            </div>
            <TabsContent value={activeTab}>
              {activeTab === 'images' ? (
                isLoadingImages ? (
                  <div className="col-span-3 text-center py-10">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
                    <p className="mt-4 text-gray-500">Loading images...</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {images.map((image) => (
                      <motion.div
                        key={image.id}
                        initial={{ opacity: 0, scale: 0.95 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true, amount: 0.35 }}
                        transition={{ duration: 0.5, ease: 'easeOut' }}
                      >
                        <Dialog>
                          <DialogTrigger asChild>
                            <div
                              className="cursor-pointer overflow-hidden rounded-lg shadow-md hover:shadow-xl transition-all duration-300 hover:scale-[1.02] aspect-[4/3]"
                              onClick={() => openImageModal(image)}
                            >
                              <img
                                src={image.url}
                                alt={image.title || 'Gallery image'}
                                className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                              />
                            </div>
                          </DialogTrigger>
                          <DialogContent className="max-w-4xl">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div className="flex items-center justify-center">
                                <img src={image.url} alt={image.title || 'Gallery image'} className="max-h-[60vh] object-contain rounded-md" />
                              </div>
                              <div>
                                <h3 className="text-2xl font-bold mb-2">{image.title}</h3>
                                {image.description && (
                                  <p className="text-gray-700">{image.description}</p>
                                )}
                              </div>
                            </div>
                          </DialogContent>
                        </Dialog>
                      </motion.div>
                    ))}
                  </div>
                )
              ) : (
                isLoadingVideos ? (
                  <div className="col-span-2 text-center py-10">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
                    <p className="mt-4 text-gray-500">Loading videos...</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {videos.map((video) => (
                      <div key={video.id} className="bg-white rounded-lg shadow-md overflow-hidden">
                        <div className="aspect-video">
                          {video.youtubeId.startsWith('local-video-') ? (
                            <video
                              className="w-full h-full object-cover"
                              controls
                              preload="metadata"
                              poster="/placeholder.svg"
                            >
                              <source
                                src={`/gallery/hvaf-video-${video.youtubeId.split('-')[2]}.mp4`}
                                type="video/mp4"
                              />
                              Your browser does not support the video tag.
                            </video>
                          ) : (
                            <iframe
                              className="w-full h-full"
                              src={`https://www.youtube.com/embed/${video.youtubeId}`}
                              title={video.title}
                              frameBorder="0"
                              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                              allowFullScreen
                            ></iframe>
                          )}
                        </div>
                        <div className="p-4">
                          <h3 className="text-xl font-semibold mb-2">{video.title}</h3>
                          {video.description && <p className="text-gray-700">{video.description}</p>}
                        </div>
                      </div>
                    ))}
                  </div>
                )
              )}
              {images.length === 0 && activeTab === 'images' && (
                <div className="text-center py-12 text-gray-500">
                  <p className="text-xl">No images to display.</p>
                </div>
              )}
              {videos.length === 0 && activeTab === 'videos' && (
                <div className="text-center py-12 text-gray-500">
                  <p className="text-xl">No videos to display.</p>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </motion.section>
    </Layout>
  );
};

export default Gallery;

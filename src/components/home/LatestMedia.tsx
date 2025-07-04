import React, { useEffect, useState } from 'react';
import { GalleryImage, GalleryVideo, getGalleryImages, getGalleryVideos } from '@/lib/gallery-data';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const LatestMedia: React.FC = () => {
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [videos, setVideos] = useState<GalleryVideo[]>([]);
  const [selectedImage, setSelectedImage] = useState<GalleryImage | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchLatest = async () => {
      try {
        const [imgs, vids] = await Promise.all([
          getGalleryImages(),
          getGalleryVideos()
        ]);
        setImages(imgs.slice(-4).reverse());
        setVideos(vids.slice(-4).reverse());
      } catch (e) {
        // handle error silently
      } finally {
        setIsLoading(false);
      }
    };
    fetchLatest();
  }, []);

  return (
    <>
      <section className="py-12 bg-neutral-100">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.7, ease: 'easeOut' }}
          >
            <h2 className="text-2xl font-bold mb-4 text-brown-700 text-center">Latest Pictures</h2>
            <p className="text-center mb-4 md:mb-8 max-w-2xl mx-auto">Every image tells a story, click to explore the powerful moments behind each one. Dive deeper into the heart of our mission, one photo at a time.</p>
            {isLoading ? (
              <div className="text-center py-8 text-gray-400">Loading...</div>
            ) : images.length === 0 ? (
              <div className="text-center py-8 text-gray-400">No images to display.</div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {images.map(image => (
                  <Dialog key={image.id}>
                    <DialogTrigger asChild>
                      <div
                        className="cursor-pointer rounded-lg overflow-hidden shadow hover:shadow-lg aspect-[4/3] bg-white"
                        onClick={() => setSelectedImage(image)}
                      >
                        <img src={image.url} alt={image.title || 'Gallery image'} className="w-full h-full object-cover transition-transform duration-500 hover:scale-105" />
                      </div>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="flex items-center justify-center">
                          <img src={image.url} alt={image.title || 'Gallery image'} className="max-h-[60vh] object-contain rounded-md" />
                        </div>
                        <div>
                          <h3 className="text-xl font-bold mb-2">{image.title}</h3>
                          {image.description && <p className="text-gray-700">{image.description}</p>}
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                ))}
              </div>
            )}
            <div className="text-center mt-6">
              <Link to="/gallery" className="inline-block bg-primary text-white px-4 py-2 rounded hover:bg-primary-dark transition">View All Images</Link>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="py-12 bg-neutral-50">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.7, ease: 'easeOut' }}
          >
            <h2 className="text-2xl font-bold mb-4 text-brown-700 text-center">Latest Videos</h2>
            <p className="text-center mb-4 md:mb-8 max-w-2xl mx-auto">Watch our journey unfold. These videos bring our impact, voices, and vision to life from real stories on the ground to powerful transformations we've witnessed.</p>
            {isLoading ? (
              <div className="text-center py-8 text-gray-400">Loading...</div>
            ) : videos.length === 0 ? (
              <div className="text-center py-8 text-gray-400">No videos to display.</div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {videos.map(video => (
                  <div key={video.id} className="rounded-lg overflow-hidden shadow hover:shadow-lg bg-white">
                    <div className="aspect-video">
                      <iframe
                        className="w-full h-full"
                        src={`https://www.youtube.com/embed/${video.youtubeId}`}
                        title={video.title}
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      ></iframe>
                    </div>
                    <div className="p-2">
                      <h3 className="text-base font-semibold mb-1">{video.title}</h3>
                      {video.description && <p className="text-gray-700 text-sm">{video.description}</p>}
                    </div>
                  </div>
                ))}
              </div>
            )}
            <div className="text-center mt-6">
              <Link to="/gallery#videos" className="inline-block bg-primary text-white px-4 py-2 rounded hover:bg-primary-dark transition">View All Videos</Link>
            </div>
          </motion.div>
        </div>
      </section>
    </>
  );
};

export default LatestMedia;

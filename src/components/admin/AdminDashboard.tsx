import React, { useState, useEffect } from 'react';
import { getFirestore, doc, getDoc, setDoc } from 'firebase/firestore';
import { app } from '@/lib/firebase';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Skeleton } from "../../components/ui/skeleton";
import { Loader2 } from "lucide-react";
import { Button } from "../../components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "../../components/ui/card";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Textarea } from "../../components/ui/textarea";
import { useToast } from "../../components/ui/use-toast";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle
} from "../../components/ui/alert-dialog";
import { GalleryImage, GalleryVideo, getGalleryImages, getGalleryVideos, addGalleryImage, addGalleryVideo, deleteGalleryImage, deleteGalleryVideo } from "../../lib/gallery-data";


const AdminDashboard = () => {
  const { logout, currentUser: User } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [videos, setVideos] = useState<GalleryVideo[]>([]);
  const [statistics, setStatistics] = useState({
    childrenHelped: 0,
    programsRunning: 0,
    successRate: 0,
    partnerOrganizations: 0
  });
  const [statsLoading, setStatsLoading] = useState(false);
  const db = getFirestore(app);

  // Deletion confirmation states
  const [itemToDelete, setItemToDelete] = useState<{ id: string, type: 'image' | 'video' } | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  // Form states
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imageTitle, setImageTitle] = useState("");
  const [imageDescription, setImageDescription] = useState("");

  const [videoUrl, setVideoUrl] = useState("");
  const [videoTitle, setVideoTitle] = useState("");
  const [videoDescription, setVideoDescription] = useState("");

  const [childrenHelped, setChildrenHelped] = useState("");
  const [programsRunning, setProgramsRunning] = useState("");
  const [successRate, setSuccessRate] = useState("");
  const [partnerOrganizations, setPartnerOrganizations] = useState("");

  // Uploading states
  const [imageUploading, setImageUploading] = useState(false);
  const [videoUploading, setVideoUploading] = useState(false);

  useEffect(() => {
    // Load gallery data from Firestore
    (async () => {
      try {
        const [images, videos] = await Promise.all([
          getGalleryImages(),
          getGalleryVideos()
        ]);
        setImages(images);
        setVideos(videos);
      } catch (error) {
        console.error('Error loading gallery data:', error);
        toast({
          title: 'Error loading gallery',
          description: 'Failed to load gallery data. Please try again.',
          variant: 'destructive'
        });
      }
    })();

    // Load statistics from Firestore
    const fetchStats = async () => {
      setStatsLoading(true);
      try {
        const statsRef = doc(db, 'site', 'statistics');
        const statsSnap = await getDoc(statsRef);
        if (statsSnap.exists()) {
          const stats = statsSnap.data();
          setStatistics({
            childrenHelped: Number(stats.childrenHelped) || 0,
            programsRunning: Number(stats.programsRunning) || 0,
            successRate: Number(stats.successRate) || 0,
            partnerOrganizations: Number(stats.partnerOrganizations) || 0
          });
          setChildrenHelped(String(Number(stats.childrenHelped) || 0));
          setProgramsRunning(String(Number(stats.programsRunning) || 0));
          setSuccessRate(String(Number(stats.successRate) || 0));
          setPartnerOrganizations(String(Number(stats.partnerOrganizations) || 0));
        } else {
          // Initialize empty if no stats exist
          setChildrenHelped("");
          setProgramsRunning("");
          setSuccessRate("");
          setPartnerOrganizations("");
        }
      } catch (err) {
        toast({
          title: 'Failed to load statistics',
          description: err.message || 'Could not fetch statistics from the server.',
          variant: 'destructive',
        });
      } finally {
        setStatsLoading(false);
      }
    };
    fetchStats();
  }, [db, toast]);

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/admin');
      toast({
        title: "Logged Out",
        description: "You have been successfully logged out."
      });
    } catch (error) {
      toast({
        title: "Logout Failed",
        description: "An error occurred during logout.",
        variant: "destructive"
      });
    }
  };

  const handleImageUpload = async (e: React.FormEvent) => {
    setImageUploading(true);
    e.preventDefault();
    console.log('handleImageUpload called', { imageFile });

    if (!imageFile) {
      toast({
        title: "No Image Selected",
        description: "Please select an image file to upload.",
        variant: "destructive"
      });
      setImageUploading(false);
      return;
    }
    try {
      // Check network connection
      if (!navigator.onLine) {
        throw new Error("You appear to be offline. Please check your connection.");
      }

      // Upload image to Cloudinary
      // You must replace these with your actual values:
      const cloudName = "dyjlprr5c"; // Your actual Cloudinary cloud name
      const unsignedPreset = "unsigned_preset"; // Replace with your unsigned upload preset name if different
      const url = `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`;
      const formData = new FormData();
      formData.append("file", imageFile);
      formData.append("upload_preset", unsignedPreset);

      const response = await (await import("axios")).default.post(url, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      const secureUrl = response.data.secure_url;

      // Add image to gallery
      const newImage = await addGalleryImage({
        url: secureUrl,
        title: imageTitle,
        description: imageDescription,
        createdAt: new Date(),
        isActive: true,
        order: Date.now() // Use timestamp for ordering
      });

      // Refresh gallery data
      const [updatedImages, updatedVideos] = await Promise.all([
        getGalleryImages(),
        getGalleryVideos()
      ]);
      setImages(updatedImages);
      setVideos(updatedVideos);

      // Reset form
      setImageFile(null);
      setImageTitle("");
      setImageDescription("");

      toast({
        title: "Image Uploaded",
        description: "The image has been added to the gallery."
      });
    } catch (error) {
      toast({
        title: "Upload Failed",
        description: error.message || "Failed to upload the image. Please try again.",
        variant: "destructive"
      });
    } finally {
      setImageUploading(false);
    }
  };

  const confirmImageDelete = (id: string) => {
    setItemToDelete({ id, type: 'image' });
    setIsDeleteDialogOpen(true);
  };

  const confirmVideoDelete = (id: string) => {
    setItemToDelete({ id, type: 'video' });
    setIsDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!itemToDelete) return;

    try {
      if (itemToDelete.type === 'image') {
        await deleteGalleryImage(itemToDelete.id);
        // Refresh gallery data
        const [updatedImages, updatedVideos] = await Promise.all([
          getGalleryImages(),
          getGalleryVideos()
        ]);
        setImages(updatedImages);
        setVideos(updatedVideos);
        toast({
          title: "Image Deleted",
          description: "The image has been removed from the gallery."
        });
      } else {
        await deleteGalleryVideo(itemToDelete.id);
        // Refresh gallery data
        const [updatedImages, updatedVideos] = await Promise.all([
          getGalleryImages(),
          getGalleryVideos()
        ]);
        setImages(updatedImages);
        setVideos(updatedVideos);
        toast({
          title: "Video Deleted",
          description: "The video has been removed from the gallery."
        });
      }
    } catch (error) {
      toast({
        title: "Delete Failed",
        description: "Failed to delete the item.",
        variant: "destructive"
      });
    } finally {
      setIsDeleteDialogOpen(false);
      setItemToDelete(null);
    }
  };

  const handleVideoAdd = async (e: React.FormEvent) => {
    setVideoUploading(true);
    e.preventDefault();

    if (!videoUrl) {
      toast({
        title: "No Video URL",
        description: "Please provide a YouTube video URL.",
        variant: "destructive"
      });
      setVideoUploading(false);
      return;
    }

    try {
      // Extract YouTube ID from the URL
      let youtubeId = videoUrl;

      // Handle different YouTube URL formats
      const ytUrlPattern = /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
      const match = videoUrl.match(ytUrlPattern);

      if (match && match[1]) {
        youtubeId = match[1];
      }

      // Add video to gallery
      const newVideo = await addGalleryVideo({
        youtubeId,
        title: videoTitle || "YouTube Video",
        description: videoDescription,
        createdAt: new Date(),
        isActive: true,
        order: Date.now() // Use timestamp for ordering
      });

      // Refresh gallery data
      const [updatedImages, updatedVideos] = await Promise.all([
        getGalleryImages(),
        getGalleryVideos()
      ]);
      setImages(updatedImages);
      setVideos(updatedVideos);

      // Reset form
      setVideoUrl("");
      setVideoTitle("");
      setVideoDescription("");

      toast({
        title: "Video Added",
        description: "The video has been added to the gallery."
      });
    } catch (error) {
      toast({
        title: "Add Failed",
        description: "Failed to add the video.",
        variant: "destructive"
      });
    } finally {
      setVideoUploading(false);
    }
  };

  const handleStatsUpdate = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate inputs
    if (!childrenHelped || !programsRunning || !successRate || !partnerOrganizations) {
      toast({
        title: "Missing Values",
        description: "Please fill all statistic fields",
        variant: "destructive"
      });
      return;
    }

    // Validate numbers
    if (isNaN(Number(childrenHelped)) || isNaN(Number(programsRunning)) ||
      isNaN(Number(successRate)) || isNaN(Number(partnerOrganizations))) {
      toast({
        title: "Invalid Values",
        description: "Please enter valid numbers",
        variant: "destructive"
      });
      return;
    }

    setStatsLoading(true);
    try {
      const updatedStats = {
        childrenHelped: Number(childrenHelped),
        programsRunning: Number(programsRunning),
        successRate: Number(successRate),
        partnerOrganizations: Number(partnerOrganizations)
      };

      const statsRef = doc(db, 'site', 'statistics');
      await setDoc(statsRef, updatedStats);

      setStatistics(updatedStats);
      toast({
        title: "Statistics Updated",
        description: "The homepage statistics have been updated."
      });
    } catch (error) {
      toast({
        title: "Update Failed",
        description: error.message || "Failed to update statistics.",
        variant: "destructive"
      });
    } finally {
      setStatsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-neutral-100">
      <header className="bg-primary text-white shadow">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center py-2">
            <div className="flex flex-col items-start space-y-1 sm:space-y-2">
              <div className="flex items-center">
                <img
                  src="/logo.png"
                  alt="Humanity Verse Aid Foundation Logo"
                  className="h-10 md:h-12 w-auto sm:h-8 mr-2 sm:mr-4"
                />
                <div>
                  <h1 className="text-sm sm:text-base font-bold">Admin Dashboard</h1>
                  <p className="text-xs sm:text-sm text-white/80">Welcome, {User?.displayName || User?.email}</p>
                </div>
              </div>
            </div>
            <div className="flex items-center">
              <Button className="bg-white hover:bg-accent shadow-lg hover:shadow-xl transition-all duration-300 px-3 py-1.5 sm:px-4 sm:py-2 text-xs sm:text-sm font-medium text-primary hover:text-white" onClick={handleLogout}>
                Log Out
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-brown-700">Dashboard</h2>
          <Button onClick={() => navigate('/')}>View Website</Button>
        </div>

        <Tabs defaultValue="images" className="w-full">
          <TabsList className="grid grid-cols-3 mb-6">
            <TabsTrigger value="images">Gallery Images</TabsTrigger>
            <TabsTrigger value="videos">Gallery Videos</TabsTrigger>
            <TabsTrigger value="statistics">Statistics</TabsTrigger>
          </TabsList>

          <TabsContent value="images" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Upload New Image</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleImageUpload} className="space-y-4">
                  <div>
                    <Label htmlFor="image-file">Image File</Label>
                    <Input
                      id="image-file"
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0] || null;
                        console.log('File selected:', file);
                        setImageFile(file);
                      }}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="image-title">Image Title</Label>
                    <Input
                      id="image-title"
                      value={imageTitle}
                      onChange={(e) => setImageTitle(e.target.value)}
                      placeholder="Enter image title"
                    />
                  </div>
                  <div>
                    <Label htmlFor="image-description">Description (Optional)</Label>
                    <Textarea
                      id="image-description"
                      value={imageDescription}
                      onChange={(e) => setImageDescription(e.target.value)}
                      placeholder="Enter image description"
                    />
                  </div>
                  <Button type="submit" disabled={imageUploading}>
                    Upload Image
                    {imageUploading && <Loader2 className="ml-2 h-4 w-4 animate-spin" />}
                  </Button>
                </form>
              </CardContent>
            </Card>

            <h3 className="text-xl font-bold mt-8 mb-4">Gallery Images ({images.length})</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {images.map((image) => (
                <Card key={image.id}>
                  <CardContent className="p-4">
                    <img
                      src={image.url}
                      alt={image.title}
                      className="w-full h-40 object-cover rounded-md mb-2"
                    />
                    <h4 className="font-semibold">{image.title}</h4>
                    {image.description && (
                      <p className="text-sm text-gray-600 line-clamp-2">{image.description}</p>
                    )}
                  </CardContent>
                  <CardFooter>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => confirmImageDelete(image.id)}
                      className="w-full"
                    >
                      Delete
                    </Button>
                  </CardFooter>
                </Card>
              ))}
              {images.length === 0 && (
                <div className="col-span-3 text-center py-10 text-gray-500">
                  <p>No images in the gallery. Upload some images to get started.</p>
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="videos" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Add New Video</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleVideoAdd} className="space-y-4">
                  <div>
                    <Label htmlFor="video-url">YouTube Video URL or ID</Label>
                    <Input
                      id="video-url"
                      value={videoUrl}
                      onChange={(e) => setVideoUrl(e.target.value)}
                      placeholder="e.g. https://www.youtube.com/watch?v=abcdefghijk or abcdefghijk"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="video-title">Video Title</Label>
                    <Input
                      id="video-title"
                      value={videoTitle}
                      onChange={(e) => setVideoTitle(e.target.value)}
                      placeholder="Enter video title"
                    />
                  </div>
                  <div>
                    <Label htmlFor="video-description">Description (Optional)</Label>
                    <Textarea
                      id="video-description"
                      value={videoDescription}
                      onChange={(e) => setVideoDescription(e.target.value)}
                      placeholder="Enter video description"
                    />
                  </div>
                  <Button type="submit" disabled={videoUploading}>
                    Add Video
                    {videoUploading && <Loader2 className="ml-2 h-4 w-4 animate-spin" />}
                  </Button>
                </form>
              </CardContent>
            </Card>

            <h3 className="text-xl font-bold mt-8 mb-4">Gallery Videos ({videos.length})</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {videos.map((video) => (
                <Card key={video.id}>
                  <CardContent className="p-4">
                    <div className="aspect-video mb-2">
                      <iframe
                        className="w-full h-full"
                        src={`https://www.youtube.com/embed/${video.youtubeId}`}
                        title={video.title}
                        allowFullScreen
                      ></iframe>
                    </div>
                    <h4 className="font-semibold">{video.title}</h4>
                    {video.description && (
                      <p className="text-sm text-gray-600 line-clamp-2">{video.description}</p>
                    )}
                  </CardContent>
                  <CardFooter>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => confirmVideoDelete(video.id)}
                      className="w-full"
                    >
                      Delete
                    </Button>
                  </CardFooter>
                </Card>
              ))}
              {videos.length === 0 && (
                <div className="col-span-2 text-center py-10 text-gray-500">
                  <p>No videos in the gallery. Add some videos to get started.</p>
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="statistics">
            <Card>
              <CardHeader>
                <CardTitle>Update Homepage Statistics</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleStatsUpdate} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <Label htmlFor="children-helped">Children Helped</Label>
                      <Input
                        id="children-helped"
                        type="number"
                        value={childrenHelped}
                        onChange={(e) => setChildrenHelped(e.target.value)}
                        min="0"
                      />
                    </div>
                    <div>
                      <Label htmlFor="programs-running">Programs Running</Label>
                      <Input
                        id="programs-running"
                        type="number"
                        value={programsRunning}
                        onChange={(e) => setProgramsRunning(e.target.value)}
                        min="0"
                      />
                    </div>
                    <div>
                      <Label htmlFor="success-rate">Success Rate (%)</Label>
                      <Input
                        id="success-rate"
                        type="number"
                        value={successRate}
                        onChange={(e) => setSuccessRate(e.target.value)}
                        min="0"
                        max="100"
                      />
                    </div>
                    <div>
                      <Label htmlFor="partner-organizations">Partner Organizations</Label>
                      <Input
                        id="partner-organizations"
                        type="number"
                        value={partnerOrganizations}
                        onChange={(e) => setPartnerOrganizations(e.target.value)}
                        min="0"
                      />
                    </div>
                  </div>
                  <Button type="submit">Update Statistics</Button>
                </form>
              </CardContent>
            </Card>

            <div className="mt-8">
              <h3 className="text-xl font-bold mb-4">Current Statistics</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                <Card>
                  <CardContent className="p-4 text-center">
                    <h4 className="text-gray-600 text-sm">Children Helped</h4>
                    <p className="text-3xl font-bold text-primary">{statistics.childrenHelped}</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4 text-center">
                    <h4 className="text-gray-600 text-sm">Programs Running</h4>
                    <p className="text-3xl font-bold text-primary">{statistics.programsRunning}</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4 text-center">
                    <h4 className="text-gray-600 text-sm">Success Rate</h4>
                    <p className="text-3xl font-bold text-primary">{statistics.successRate}%</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4 text-center">
                    <h4 className="text-gray-600 text-sm">Partner Organizations</h4>
                    <p className="text-3xl font-bold text-primary">{statistics.partnerOrganizations}</p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </main>

      {/* Delete confirmation dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the {itemToDelete?.type} from the gallery.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setItemToDelete(null)}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteConfirm}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default AdminDashboard;

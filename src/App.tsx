import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Upload,
  Image as ImageIcon,
  Search,
  Plus,
  Heart,
  Download,
  Share2,
  X,
  Sparkles,
  Zap,
  Filter,
  Grid3x3,
  Flame,
  Star,
  Eye,
  Edit,
  Folder,
  History,
  Settings,
  Crop,
  RotateCcw,
  Save,
  CloudUpload,
  Link,
  Copy,
  Calendar,
  Tag,
  Sliders,
  Moon,
  Sun,
  User
} from 'lucide-react';
import ImageCrop from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';
import { toast } from 'react-hot-toast';
import * as storageService from './firebase/storage';

interface GalleryImage {
  id: string | number;
  url: string;
  title: string;
  category: string;
  size: string;
  liked?: boolean;
  tags: string[];
  uploadDate: Date;
  album?: string;
  quality: number;
  format: string;
}

interface Album {
  id: string;
  name: string;
  description: string;
  imageCount: number;
  coverImage?: string;
  created: Date;
}

interface EditState {
  crop: any;
  rotation: number;
  brightness: number;
  contrast: number;
  saturation: number;
}

const CATEGORIES = ['All', 'Art', 'Cyber', 'Tech', 'Abstract', 'Nature', 'People'];
const FORMATS = ['jpeg', 'png', 'webp'];
const QUALITIES = [70, 80, 90, 100];

const DEFAULT_IMAGES: GalleryImage[] = [
  {
    id: 1,
    url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=800',
    title: 'Abstract Flow',
    category: 'Abstract',
    size: '2.4 MB',
    liked: true,
    tags: ['abstract', 'flow', 'colorful'],
    uploadDate: new Date('2024-01-15'),
    quality: 85,
    format: 'jpeg'
  },
  {
    id: 2,
    url: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80&w=800',
    title: 'Digital Horizon',
    category: 'Tech',
    size: '1.8 MB',
    liked: false,
    tags: ['tech', 'future', 'digital'],
    uploadDate: new Date('2024-01-16'),
    quality: 90,
    format: 'png'
  },
  {
    id: 3,
    url: 'https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?auto=format&fit=crop&q=80&w=800',
    title: 'Neon Dreams',
    category: 'Cyber',
    size: '3.1 MB',
    liked: true,
    tags: ['neon', 'cyberpunk', 'night'],
    uploadDate: new Date('2024-01-17'),
    quality: 80,
    format: 'jpeg'
  },
  {
    id: 4,
    url: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&q=80&w=800',
    title: 'AI Neural Network',
    category: 'Tech',
    size: '2.9 MB',
    liked: false,
    tags: ['ai', 'network', 'technology'],
    uploadDate: new Date('2024-01-18'),
    quality: 95,
    format: 'webp'
  },
  {
    id: 5,
    url: 'https://images.unsplash.com/photo-1605810230434-7631ac76ec81?auto=format&fit=crop&q=80&w=800',
    title: 'Cyberpunk Cityscape',
    category: 'Cyber',
    size: '4.2 MB',
    liked: false,
    tags: ['city', 'cyberpunk', 'urban'],
    uploadDate: new Date('2024-01-19'),
    quality: 75,
    format: 'jpeg'
  },
  {
    id: 6,
    url: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?auto=format&fit=crop&q=80&w=800',
    title: 'Synthetic Life',
    category: 'Art',
    size: '1.5 MB',
    liked: true,
    tags: ['synthetic', 'art', 'life'],
    uploadDate: new Date('2024-01-20'),
    quality: 88,
    format: 'png'
  }
];

const DEFAULT_ALBUMS: Album[] = [
  {
    id: '1',
    name: 'Nature Collection',
    description: 'Beautiful nature photography',
    imageCount: 3,
    created: new Date('2024-01-15')
  },
  {
    id: '2',
    name: 'Digital Art',
    description: 'Modern digital creations',
    imageCount: 2,
    created: new Date('2024-01-16')
  },
  {
    id: '3',
    name: 'Tech & AI',
    description: 'Technology and AI themed images',
    imageCount: 1,
    created: new Date('2024-01-17')
  }
];

type ViewMode = 'gallery' | 'albums' | 'history' | 'settings';

function App() {
  const [selectedImage, setSelectedImage] = useState<GalleryImage | null>(null);
  const [filter, setFilter] = useState('All');
  const [images, setImages] = useState<GalleryImage[]>(DEFAULT_IMAGES);
  const [albums, setAlbums] = useState<Album[]>(DEFAULT_ALBUMS);
  const [isDragging, setIsDragging] = useState(false);
  const [uploadPreview, setUploadPreview] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [editState, setEditState] = useState<EditState>({
    crop: { unit: 'px', width: 300, height: 300 },
    rotation: 0,
    brightness: 100,
    contrast: 100,
    saturation: 100
  });
  const [currentView, setCurrentView] = useState<ViewMode>('gallery');
  const [darkMode, setDarkMode] = useState(false);
  const [isSharing, setIsSharing] = useState(false);
  const [shareLink, setShareLink] = useState('');
  const [newAlbumName, setNewAlbumName] = useState('');
  const [selectedAlbum, setSelectedAlbum] = useState<string | null>(null);
  const [imageSettings, setImageSettings] = useState({
    format: 'jpeg' as string,
    quality: 85 as number,
    tags: [] as string[]
  });
  const fileInputRef = useRef<HTMLInputElement>(null);
  const fileUploadRef = useRef<HTMLInputElement>(null);

  const loadImages = async () => {
    try {
      const cloudImages = await storageService.listImages();
      const galleryImages: GalleryImage[] = cloudImages.map(img => ({
        ...img,
        title: img.name.replace(/^\d+_/, '').replace(/\.[^/.]+$/, ''),
        category: 'Art', // Default
        tags: [],
        quality: 90,
        format: img.type.split('/')[1] || 'jpeg'
      }));
      setImages(prev => {
        // Merge cloud images with default/existing, avoiding duplicates
        const existingIds = new Set(prev.map(i => i.id));
        const newImages = galleryImages.filter(i => !existingIds.has(i.id));
        return [...newImages, ...prev];
      });
    } catch (error) {
      console.error('Failed to load images from cloud:', error);
      toast.error('Failed to sync with cloud storage');
    }
  };

  useEffect(() => {
    loadImages();
  }, []);

  useEffect(() => {
    localStorage.setItem('uploadedImages', JSON.stringify(images));
  }, [images]);

  const handleFileSelect = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    const file = files[0];

    const loadingToast = toast.loading(`Uploading ${file.name}...`);

    try {
      setUploadPreview(URL.createObjectURL(file));

      const downloadUrl = await storageService.uploadImage(file, (progress) => {
        // We could show progress in UI if needed, for now toast is fine
      });

      const newImage: GalleryImage = {
        id: Date.now(),
        url: downloadUrl,
        title: file.name.replace(/\.[^/.]+$/, ''),
        category: 'Art',
        size: `${(file.size / 1024 / 1024).toFixed(1)} MB`,
        liked: false,
        tags: [],
        uploadDate: new Date(),
        quality: imageSettings.quality,
        format: imageSettings.format
      };

      setImages(prev => [newImage, ...prev]);
      toast.success('Upload successful!', { id: loadingToast });
    } catch (error: any) {
      console.error('Upload error:', error);
      toast.error(error.message || 'Upload failed', { id: loadingToast });
    } finally {
      setUploadPreview(null);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    handleFileSelect(e.dataTransfer.files);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const toggleLike = (id: string | number) => {
    setImages(images.map(img =>
      img.id === id ? { ...img, liked: !img.liked } : img
    ));
  };

  const deleteImage = async (image: GalleryImage) => {
    const confirmDelete = window.confirm(`Delete ${image.title}?`);
    if (!confirmDelete) return;

    try {
      // If it has a fullPath, it's in cloud storage
      const storageFile = (image as any).fullPath;
      if (storageFile) {
        await storageService.deleteImage(storageFile);
      }
      setImages(images.filter(img => img.id !== image.id));
      toast.success('Image deleted');
    } catch (error) {
      console.error('Delete error:', error);
      toast.error('Failed to delete image from cloud');
    }
  };

  const openImageEditor = (image: GalleryImage) => {
    setSelectedImage(image);
    setIsEditing(true);
  };

  const applyImageEdit = () => {
    if (!selectedImage) return;
    setImages(images.map(img =>
      img.id === selectedImage.id ? { ...img, ...selectedImage } : img
    ));
    setIsEditing(false);
    setSelectedImage(null);
  };

  const filteredImages = images.filter(img => {
    const matchesCategory = filter === 'All' || img.category === filter;
    const matchesAlbum = !selectedAlbum || img.album === selectedAlbum;
    const matchesSearch = searchQuery === '' ||
      img.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      img.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesAlbum && matchesSearch;
  });

  const createShareLink = (image: GalleryImage) => {
    const link = image.url; // Use real URL
    setShareLink(link);
    setIsSharing(true);
    navigator.clipboard.writeText(link);
    toast.success('Link copied to clipboard');
  };

  const createAlbum = () => {
    if (!newAlbumName.trim()) return;
    const newAlbum: Album = {
      id: Date.now().toString(),
      name: newAlbumName,
      description: 'New album',
      imageCount: 0,
      created: new Date()
    };
    setAlbums([...albums, newAlbum]);
    setNewAlbumName('');
  };

  const addToAlbum = (imageId: number, albumId: string) => {
    setImages(images.map(img =>
      img.id === imageId ? { ...img, album: albumId } : img
    ));
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    }).format(date);
  };

  const filteredAlbums = selectedAlbum
    ? albums.filter(album => album.id === selectedAlbum)
    : albums;

  const viewModes = {
    gallery: { icon: Grid3x3, label: 'Gallery' },
    albums: { icon: Folder, label: 'Albums' },
    history: { icon: History, label: 'History' },
    settings: { icon: Settings, label: 'Settings' }
  };

  return (
    <div className={`min-h-screen ${darkMode ? 'dark bg-gray-900' : ''}`}>
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 dark:bg-gray-800 bg-white shadow-lg">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-14 h-14 bg-gradient-to-br from-play-purple to-play-pink rounded-2xl flex items-center justify-center shadow-lg animate-pulse-glow">
                  <Sparkles className="w-7 h-7 text-white" />
                </div>
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-play-yellow rounded-full animate-ping" />
              </div>
              <div>
                <h1 className="text-2xl font-black tracking-tighter uppercase leading-none">
                  <span className="gradient-text">Pixel</span>Playground
                </h1>
                <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-gray-400 mt-1">
                  Experimental Image Lab
                </p>
              </div>
            </div>

            {/* Search Bar */}
            <div className="hidden md:flex flex-1 max-w-lg mx-8">
              <div className="relative w-full group">
                <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 group-focus-within:text-play-purple transition-colors" />
                <input
                  type="text"
                  placeholder="Search images, tags..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="search-play pl-14"
                />
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-3">
              <button
                onClick={() => setDarkMode(!darkMode)}
                className="p-3 rounded-xl bg-play-surface text-gray-400 hover:text-white transition-all hover:scale-105"
              >
                {darkMode ? <Sun size={20} /> : <Moon size={20} />}
              </button>
              <button
                onClick={() => fileUploadRef.current?.click()}
                className="btn-play-primary flex items-center gap-2"
              >
                <CloudUpload size={20} />
                <span className="hidden sm:inline">Upload</span>
              </button>
              <input type="file" ref={fileUploadRef} className="hidden" accept="image/*" onChange={(e) => handleFileSelect(e.target.files)} />
            </div>
          </div>
        </div>
      </nav>

      <main className="pt-32 px-6 pb-20 max-w-7xl mx-auto">
        {/* View Mode Navigation */}
        <div className="flex gap-2 mb-8">
          {Object.entries(viewModes).map(([key, mode]) => (
            <button
              key={key}
              onClick={() => setCurrentView(key as ViewMode)}
              className={`px-4 py-2 rounded-lg font-medium transition-all ${currentView === key
                ? 'bg-gradient-to-r from-play-purple to-play-pink text-white'
                : 'bg-play-surface text-gray-400 hover:text-white'
                }`}
            >
              <mode.icon size={16} className="inline mr-2" />
              {mode.label}
            </button>
          ))}
        </div>

        {/* Gallery View */}
        {currentView === 'gallery' && (
          <>
            {/* Stats and Filters */}
            <section className="mb-8">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                {[
                  { label: 'Total Images', value: images.length, icon: ImageIcon, color: 'text-play-purple' },
                  { label: 'Favorites', value: images.filter(i => i.liked).length, icon: Heart, color: 'text-play-pink' },
                  { label: 'Categories', value: CATEGORIES.length - 1, icon: Zap, color: 'text-play-yellow' },
                  { label: 'Albums', value: albums.length, icon: Folder, color: 'text-play-cyan' }
                ].map((stat, i) => (
                  <motion.div
                    key={stat.label}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className="stat-card"
                  >
                    <stat.icon className={`w-6 h-6 mx-auto mb-2 ${stat.color}`} />
                    <div className="stat-value">{stat.value}</div>
                    <div className="stat-label">{stat.label}</div>
                  </motion.div>
                ))}
              </div>

              {/* Category and Album Filters */}
              <div className="flex flex-wrap gap-4">
                <div className="flex gap-2">
                  {CATEGORIES.map(category => (
                    <button
                      key={category}
                      onClick={() => setFilter(category)}
                      className={`category-pill ${filter === category ? 'active' : ''}`}
                    >
                      {category}
                    </button>
                  ))}
                </div>
                {albums.length > 0 && (
                  <div className="flex gap-2 items-center">
                    <Folder className="w-4 h-4 text-gray-500" />
                    <select
                      value={selectedAlbum || ''}
                      onChange={(e) => setSelectedAlbum(e.target.value || null)}
                      className="bg-play-surface rounded-lg px-3 py-1 text-sm"
                    >
                      <option value="">All Albums</option>
                      {albums.map(album => (
                        <option key={album.id} value={album.id}>{album.name}</option>
                      ))}
                    </select>
                  </div>
                )}
              </div>
            </section>

            {/* Upload Zone */}
            {uploadPreview && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="upload-zone p-8 mb-8">
                <div className="flex flex-col md:flex-row items-center gap-6">
                  <div className="relative">
                    <img src={uploadPreview} alt="Upload preview" className="max-w-md rounded-lg shadow-xl" />
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-br from-play-purple/20 to-play-pink/20 rounded-lg"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.5 }}
                    />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold mb-2">Processing Upload...</h3>
                    <p className="text-gray-600">Your image is being prepared for the gallery</p>
                    <div className="mt-4 flex gap-2">
                      <button
                        onClick={() => setUploadPreview(null)}
                        className="px-4 py-2 bg-play-surface rounded-lg hover:bg-gray-700 transition-colors"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Image Grid */}
            {filteredImages.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredImages.map((image, index) => (
                  <motion.div
                    key={image.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="group relative"
                  >
                    <div className="bounce-card bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 rounded-2xl overflow-hidden shadow-lg">
                      <div className="relative aspect-square">
                        <img
                          src={image.url}
                          alt={image.title}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
                          <div className="flex gap-2">
                            <button
                              onClick={() => openImageEditor(image)}
                              className="p-2 bg-white/20 backdrop-blur rounded-lg hover:bg-white/30 transition-all"
                            >
                              <Edit size={16} />
                            </button>
                            <button
                              onClick={() => toggleLike(image.id)}
                              className={`p-2 bg-white/20 backdrop-blur rounded-lg hover:bg-white/30 transition-all ${image.liked ? 'text-play-pink' : ''}`}
                            >
                              <Heart size={16} fill={image.liked ? 'currentColor' : 'none'} />
                            </button>
                            <button
                              onClick={() => createShareLink(image)}
                              className="p-2 bg-white/20 backdrop-blur rounded-lg hover:bg-white/30 transition-all"
                            >
                              <Share2 size={16} />
                            </button>
                            <button
                              onClick={() => deleteImage(image)}
                              className="p-2 bg-red-500/20 backdrop-blur rounded-lg hover:bg-red-500/30 transition-all"
                            >
                              <X size={16} />
                            </button>
                          </div>
                        </div>
                      </div>
                      <div className="p-4">
                        <div className="flex items-start justify-between mb-2">
                          <h3 className="font-semibold text-lg truncate">{image.title}</h3>
                          <span className="text-xs bg-play-surface px-2 py-1 rounded-full">
                            {image.format.toUpperCase()} · {image.quality}%
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 mb-2">
                          <span className="category-pill bg-gray-200 dark:bg-gray-700">{image.category}</span>
                          <span className="text-xs">•</span>
                          <span>{formatFileSize(parseInt(image.size) * 1024 * 1024)}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="flex gap-1">
                            {image.tags.slice(0, 3).map((tag: string) => (
                              <span key={tag} className="text-xs bg-gray-200 dark:bg-gray-700 px-2 py-1 rounded-full">
                                #{tag}
                              </span>
                            ))}
                            {image.tags.length > 3 && (
                              <span className="text-xs text-gray-500">+{image.tags.length - 3}</span>
                            )}
                          </div>
                          <span className="text-xs text-gray-500">{formatDate(image.uploadDate)}</span>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <ImageIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">No images found. Upload some to get started!</p>
              </div>
            )}
          </>
        )}

        {/* Albums View */}
        {currentView === 'albums' && (
          <div>
            <h2 className="text-2xl font-bold mb-6">Your Albums</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {albums.map(album => (
                <motion.div
                  key={album.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bounce-card bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 rounded-2xl overflow-hidden shadow-lg"
                >
                  <div className="aspect-video bg-gradient-to-br from-play-purple to-play-pink flex items-center justify-center">
                    <Folder className="w-16 h-16 text-white" />
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold text-lg mb-1">{album.name}</h3>
                    <p className="text-sm text-gray-600 mb-3">{album.description}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-500">{album.imageCount} images</span>
                      <span className="text-xs text-gray-500">{formatDate(album.created)}</span>
                    </div>
                  </div>
                </motion.div>
              ))}

              {/* Create New Album */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bounce-card bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 rounded-2xl overflow-hidden shadow-lg border-2 border-dashed border-gray-300 dark:border-gray-600"
              >
                <div className="aspect-video flex items-center justify-center">
                  <div className="text-center">
                    <Plus className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <input
                      type="text"
                      value={newAlbumName}
                      onChange={(e) => setNewAlbumName(e.target.value)}
                      placeholder="Album name..."
                      className="w-full px-4 py-2 bg-transparent border-none outline-none text-center font-semibold"
                    />
                    <button
                      onClick={createAlbum}
                      className="mt-4 px-4 py-2 bg-play-purple text-white rounded-lg hover:bg-play-pink transition-colors"
                    >
                      Create Album
                    </button>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        )}

        {/* History View */}
        {currentView === 'history' && (
          <div>
            <h2 className="text-2xl font-bold mb-6">Upload History</h2>
            <div className="space-y-4">
              {images
                .sort((a, b) => b.uploadDate.getTime() - a.uploadDate.getTime())
                .map((image, index) => (
                  <motion.div
                    key={image.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 rounded-2xl p-4 shadow-lg flex items-center gap-4"
                  >
                    <img src={image.url} alt={image.title} className="w-20 h-20 rounded-lg object-cover" />
                    <div className="flex-1">
                      <h3 className="font-semibold">{image.title}</h3>
                      <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400 mt-1">
                        <span>Uploaded: {formatDate(image.uploadDate)}</span>
                        <span>Size: {image.size}</span>
                        <span>Format: {image.format.toUpperCase()}</span>
                        <span>Quality: {image.quality}%</span>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => openImageEditor(image)}
                        className="p-2 bg-play-surface rounded-lg hover:bg-gray-700 transition-colors"
                      >
                        <Edit size={16} />
                      </button>
                      <button
                        onClick={() => createShareLink(image)}
                        className="p-2 bg-play-surface rounded-lg hover:bg-gray-700 transition-colors"
                      >
                        <Share2 size={16} />
                      </button>
                    </div>
                  </motion.div>
                ))}
            </div>
          </div>
        )}

        {/* Settings View */}
        {currentView === 'settings' && (
          <div className="max-w-2xl">
            <h2 className="text-2xl font-bold mb-6">Settings</h2>
            <div className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 rounded-2xl p-6 shadow-lg space-y-6">
              <div>
                <h3 className="font-semibold mb-3 flex items-center gap-2">
                  <Sliders size={20} />
                  Upload Settings
                </h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Default Format</label>
                    <select
                      value={imageSettings.format}
                      onChange={(e) => setImageSettings({ ...imageSettings, format: e.target.value })}
                      className="w-full px-4 py-2 bg-play-surface rounded-lg"
                    >
                      {FORMATS.map(format => (
                        <option key={format} value={format}>{format.toUpperCase()}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Default Quality</label>
                    <select
                      value={imageSettings.quality}
                      onChange={(e) => setImageSettings({ ...imageSettings, quality: parseInt(e.target.value) })}
                      className="w-full px-4 py-2 bg-play-surface rounded-lg"
                    >
                      {QUALITIES.map(quality => (
                        <option key={quality} value={quality}>{quality}%</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="font-semibold mb-3 flex items-center gap-2">
                  <CloudUpload size={20} />
                  Cloud Storage
                </h3>
                <div className="bg-play-surface rounded-lg p-4">
                  <p className="text-sm text-gray-600 mb-3">Connect cloud services for automatic backup</p>
                  <div className="flex gap-2">
                    <button className="px-4 py-2 bg-gradient-to-r from-play-purple to-play-pink text-white rounded-lg hover:opacity-90 transition-opacity">
                      Connect Google Drive
                    </button>
                    <button className="px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors">
                      Connect Dropbox
                    </button>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="font-semibold mb-3 flex items-center gap-2">
                  <Moon size={20} />
                  Appearance
                </h3>
                <div className="flex items-center justify-between">
                  <span>Dark Mode</span>
                  <button
                    onClick={() => setDarkMode(!darkMode)}
                    className="relative w-12 h-6 bg-gray-300 rounded-full transition-colors"
                  >
                    <div className={`absolute top-1 w-4 h-4 rounded-full transition-all ${darkMode ? 'bg-play-purple right-1' : 'bg-white left-1'}`} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Image Editor Modal */}
      <AnimatePresence>
        {isEditing && selectedImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4"
            onClick={() => setIsEditing(false)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-white dark:bg-gray-800 rounded-2xl p-6 max-w-4xl w-full max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">Edit Image</h2>
                <button onClick={() => setIsEditing(false)} className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg">
                  <X size={24} />
                </button>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                  <div className="bg-gray-100 dark:bg-gray-900 rounded-lg p-4">
                    <ImageCrop
                      crop={editState.crop}
                      onChange={(c: any) => setEditState({ ...editState, crop: c })}
                    >
                      <img src={selectedImage.url} alt="Crop me" />
                    </ImageCrop>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <h3 className="font-semibold mb-3">Crop & Transform</h3>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        onClick={() => setEditState({ ...editState, rotation: editState.rotation - 90 })}
                        className="p-3 bg-play-surface rounded-lg hover:bg-gray-700 transition-colors flex flex-col items-center gap-1"
                      >
                        <RotateCcw size={20} />
                        <span className="text-sm">Rotate Left</span>
                      </button>
                      <button
                        onClick={() => setEditState({ ...editState, rotation: editState.rotation + 90 })}
                        className="p-3 bg-play-surface rounded-lg hover:bg-gray-700 transition-colors flex flex-col items-center gap-1"
                      >
                        <RotateCcw size={20} className="rotate-90" />
                        <span className="text-sm">Rotate Right</span>
                      </button>
                      <button
                        onClick={() => setEditState({ ...editState, crop: { unit: 'px', width: 300, height: 300 } })}
                        className="p-3 bg-play-surface rounded-lg hover:bg-gray-700 transition-colors flex flex-col items-center gap-1"
                      >
                        <Crop size={20} />
                        <span className="text-sm">Reset Crop</span>
                      </button>
                      <button
                        onClick={() => setEditState({ ...editState, brightness: 100, contrast: 100, saturation: 100 })}
                        className="p-3 bg-play-surface rounded-lg hover:bg-gray-700 transition-colors flex flex-col items-center gap-1"
                      >
                        <Sliders size={20} />
                        <span className="text-sm">Reset Filters</span>
                      </button>
                    </div>
                  </div>

                  <div>
                    <h3 className="font-semibold mb-3">Image Properties</h3>
                    <div className="space-y-3">
                      <div>
                        <label className="block text-sm font-medium mb-1">Title</label>
                        <input
                          type="text"
                          value={selectedImage.title}
                          onChange={(e) => setSelectedImage({ ...selectedImage, title: e.target.value })}
                          className="w-full px-3 py-2 bg-play-surface rounded-lg"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1">Category</label>
                        <select
                          value={selectedImage.category}
                          onChange={(e) => setSelectedImage({ ...selectedImage, category: e.target.value })}
                          className="w-full px-3 py-2 bg-play-surface rounded-lg"
                        >
                          {CATEGORIES.filter(c => c !== 'All').map(category => (
                            <option key={category} value={category}>{category}</option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1">Tags (comma-separated)</label>
                        <input
                          type="text"
                          value={selectedImage.tags.join(', ')}
                          onChange={(e) => setSelectedImage({ ...selectedImage, tags: e.target.value.split(',').map(t => t.trim()).filter(Boolean) })}
                          className="w-full px-3 py-2 bg-play-surface rounded-lg"
                        />
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={applyImageEdit}
                    className="w-full px-4 py-3 bg-gradient-to-r from-play-purple to-play-pink text-white rounded-lg hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
                  >
                    <Save size={20} />
                    Save Changes
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Share Modal */}
      <AnimatePresence>
        {isSharing && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4"
            onClick={() => setIsSharing(false)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-white dark:bg-gray-800 rounded-2xl p-6 max-w-md w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="text-center">
                <Share2 className="w-16 h-16 text-play-purple mx-auto mb-4" />
                <h2 className="text-2xl font-bold mb-2">Share Image</h2>
                <p className="text-gray-600 mb-6">Copy the link below to share your image</p>

                <div className="bg-gray-100 dark:bg-gray-900 rounded-lg p-3 mb-4">
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={shareLink}
                      readOnly
                      className="flex-1 bg-transparent outline-none"
                    />
                    <button
                      onClick={() => navigator.clipboard.writeText(shareLink)}
                      className="p-2 bg-play-purple text-white rounded-lg hover:bg-play-pink transition-colors"
                    >
                      <Copy size={16} />
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <button className="px-4 py-2 bg-gradient-to-r from-play-purple to-play-pink text-white rounded-lg hover:opacity-90 transition-opacity">
                    Copy Link
                  </button>
                  <button
                    onClick={() => setIsSharing(false)}
                    className="px-4 py-2 bg-gray-200 dark:bg-gray-700 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                  >
                    Close
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default App;
import { useState, useRef } from 'react';
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
  Eye
} from 'lucide-react';

interface GalleryImage {
  id: number;
  url: string;
  title: string;
  category: string;
  size: string;
  liked?: boolean;
}

const CATEGORIES = ['All', 'Art', 'Cyber', 'Tech', 'Abstract'];

const IMAGES: GalleryImage[] = [
  {
    id: 1,
    url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=800',
    title: 'Abstract Flow',
    category: 'Abstract',
    size: '2.4 MB',
    liked: true
  },
  {
    id: 2,
    url: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80&w=800',
    title: 'Digital Horizon',
    category: 'Tech',
    size: '1.8 MB',
    liked: false
  },
  {
    id: 3,
    url: 'https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?auto=format&fit=crop&q=80&w=800',
    title: 'Neon Dreams',
    category: 'Cyber',
    size: '3.1 MB',
    liked: true
  },
  {
    id: 4,
    url: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&q=80&w=800',
    title: 'AI Neural Network',
    category: 'Tech',
    size: '2.9 MB',
    liked: false
  },
  {
    id: 5,
    url: 'https://images.unsplash.com/photo-1605810230434-7631ac76ec81?auto=format&fit=crop&q=80&w=800',
    title: 'Cyberpunk Cityscape',
    category: 'Cyber',
    size: '4.2 MB',
    liked: false
  },
  {
    id: 6,
    url: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?auto=format&fit=crop&q=80&w=800',
    title: 'Synthetic Life',
    category: 'Art',
    size: '1.5 MB',
    liked: true
  }
];

function App() {
  const [selectedImage, setSelectedImage] = useState<GalleryImage | null>(null);
  const [filter, setFilter] = useState('All');
  const [images, setImages] = useState<GalleryImage[]>(IMAGES);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const filteredImages = filter === 'All' ? images : images.filter(img => img.category === filter);

  const toggleLike = (id: number) => {
    setImages(images.map(img =>
      img.id === id ? { ...img, liked: !img.liked } : img
    ));
  };

  return (
    <div className="min-h-screen">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-40 nav-glass">
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
                  placeholder="Search the playground..."
                  className="search-play pl-14"
                />
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-3">
              <button className="p-3 rounded-xl bg-play-surface text-gray-400 hover:text-white transition-all hover:scale-105 animate-wiggle">
                <Filter size={20} />
              </button>
              <button
                onClick={() => fileInputRef.current?.click()}
                className="btn-play-primary flex items-center gap-2"
              >
                <Plus size={20} />
                <span className="hidden sm:inline">Upload</span>
              </button>
              <input type="file" ref={fileInputRef} className="hidden" />
            </div>
          </div>
        </div>
      </nav>

      <main className="pt-32 px-6 pb-20 max-w-7xl mx-auto">
        {/* Hero Stats */}
        <section className="mb-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: 'Total Images', value: images.length, icon: ImageIcon, color: 'text-play-purple' },
              { label: 'Favorites', value: images.filter(i => i.liked).length, icon: Heart, color: 'text-play-pink' },
              { label: 'Categories', value: CATEGORIES.length - 1, icon: Zap, color: 'text-play-yellow' },
              { label: 'Storage', value: '2.4 GB', icon: Star, color: 'text-play-cyan' }
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
        </section>

        {/* Upload Zone */}
        <section className="mb-12">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="upload-zone cursor-pointer"
            onClick={() => fileInputRef.current?.click()}
          >
            <div className="space-y-6">
              <div className="w-24 h-24 mx-auto bg-gradient-to-br from-play-purple/20 to-play-pink/20 rounded-3xl flex items-center justify-center animate-float">
                <Upload className="w-12 h-12 text-play-purple" />
              </div>
              <div>
                <h3 className="text-3xl font-black gradient-text mb-2">Drop it like it's hot!</h3>
                <p className="text-gray-400">Supports PNG, JPG, WebP up to 10MB</p>
              </div>
              <button className="btn-play-secondary">
                <Flame className="w-5 h-5 inline mr-2" />
                Fire Up the Upload
              </button>
            </div>
          </motion.div>
        </section>

        {/* Category Filter */}
        <section className="mb-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
            <h2 className="text-4xl font-black uppercase tracking-tighter">
              Your <span className="gradient-text-alt">Gallery</span>
            </h2>
            <div className="flex gap-2 flex-wrap">
              {CATEGORIES.map(cat => (
                <button
                  key={cat}
                  onClick={() => setFilter(cat)}
                  className={`category-pill ${filter === cat ? 'active' : ''}`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* Gallery Grid */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredImages.map((img, idx) => (
            <motion.div
              key={img.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: idx * 0.1 }}
              className="image-card group cursor-pointer"
              onClick={() => setSelectedImage(img)}
            >
              <img src={img.url} alt={img.title} />
              <div className="image-card-overlay flex flex-col justify-end p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-xs font-bold text-play-purple uppercase tracking-wider mb-1 block">
                      {img.category}
                    </span>
                    <h3 className="text-lg font-black uppercase tracking-tight">{img.title}</h3>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleLike(img.id);
                    }}
                    className={`p-3 rounded-xl transition-all ${
                      img.liked
                        ? 'bg-play-pink text-white scale-110'
                        : 'bg-black/50 text-white hover:scale-110'
                    }`}
                  >
                    <Heart size={18} fill={img.liked ? 'currentColor' : 'none'} />
                  </button>
                </div>
              </div>
              <div className="floating-badge">{img.size}</div>
            </motion.div>
          ))}
        </section>

        {/* CTA Section */}
        <section className="mt-20 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-play-purple/20 via-play-pink/20 to-play-cyan/20 animate-gradient" />
          <div className="relative bounce-card p-12 text-center">
            <Sparkles className="w-16 h-16 text-play-purple mx-auto mb-6 animate-pulse-glow" />
            <h3 className="text-4xl md:text-5xl font-black gradient-text mb-4">
              Ready to Level Up?
            </h3>
            <p className="text-gray-400 max-w-xl mx-auto mb-8">
              Unleash the full power of AI-powered image enhancement and transform your visuals
              into masterpieces.
            </p>
            <button className="btn-play-primary text-lg px-12 py-5">
              <Zap className="w-6 h-6 inline mr-2" />
              Unlock AI Magic
            </button>
          </div>
        </section>
      </main>

      {/* Lightbox Modal */}
      <AnimatePresence>
        {selectedImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="lightbox-backdrop"
            onClick={() => setSelectedImage(null)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="lightbox-content flex flex-col lg:flex-row"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setSelectedImage(null)}
                className="absolute top-4 right-4 z-10 p-3 bg-black/50 hover:bg-play-pink text-white rounded-xl transition-all"
              >
                <X size={24} />
              </button>

              <div className="flex-1 bg-black flex items-center justify-center min-h-[50vh] lg:min-h-[600px]">
                <img
                  src={selectedImage.url}
                  alt={selectedImage.title}
                  className="max-w-full max-h-[60vh] lg:max-h-[90vh] object-contain"
                />
              </div>

              <div className="w-full lg:w-96 p-8 flex flex-col">
                <span className="inline-block px-4 py-2 rounded-full bg-play-purple/20 text-play-purple text-xs font-bold uppercase tracking-wider mb-4 w-fit">
                  {selectedImage.category}
                </span>
                <h2 className="text-3xl font-black gradient-text mb-4">{selectedImage.title}</h2>
                <p className="text-gray-400 mb-8">
                  High-resolution visual asset optimized for web and print. Metadata captured
                  with professional-grade equipment.
                </p>

                <div className="space-y-4">
                  <button className="w-full btn-play-primary flex items-center justify-center gap-2">
                    <Download size={20} />
                    Download Original
                  </button>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      onClick={() => toggleLike(selectedImage.id)}
                      className={`btn-play-secondary flex items-center justify-center gap-2 ${
                        selectedImage.liked ? 'border-play-pink text-play-pink' : ''
                      }`}
                    >
                      <Heart size={18} fill={selectedImage.liked ? 'currentColor' : 'none'} />
                      {selectedImage.liked ? 'Liked' : 'Like'}
                    </button>
                    <button className="btn-play-secondary flex items-center justify-center gap-2">
                      <Share2 size={18} />
                      Share
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Footer */}
      <footer className="border-t border-white/5 py-8 px-6 mt-20">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs font-black uppercase tracking-[0.3em] text-gray-500">
            Made with <Flame className="w-4 h-4 inline text-play-pink" /> by PixelPlayground
          </p>
          <p className="text-xs font-bold uppercase tracking-wider text-gray-600">
            18/30 Experimental Editions
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;

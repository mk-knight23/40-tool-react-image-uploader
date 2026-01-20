import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, Image as ImageIcon, Search, Plus, Filter, Heart, Download, Share2, Maximize2, X, Sparkles, Wand2 } from 'lucide-react';

const IMAGES = [
    { id: 1, url: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=800", title: "Abstract Flow", category: "Art" },
    { id: 2, url: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80&w=800", title: "Digital Horizon", category: "Tech" },
    { id: 3, url: "https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?auto=format&fit=crop&q=80&w=800", title: "Neon Dreams", category: "Cyber" },
    { id: 4, url: "https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&q=80&w=800", title: "AI Neural Network", category: "Tech" },
    { id: 5, url: "https://images.unsplash.com/photo-1605810230434-7631ac76ec81?auto=format&fit=crop&q=80&w=800", title: "Cyberpunk Cityscape", category: "Cyber" },
    { id: 6, url: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?auto=format&fit=crop&q=80&w=800", title: "Synthetic Life", category: "Art" },
];

function App() {
    const [selectedImage, setSelectedImage] = useState<typeof IMAGES[0] | null>(null);
    const [filter, setFilter] = useState('All');
    const fileInputRef = useRef<HTMLInputElement>(null);

    const filteredImages = filter === 'All' ? IMAGES : IMAGES.filter(img => img.category === filter);

    return (
        <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
            {/* Navigation */}
            <nav className="fixed top-0 left-0 right-0 h-24 glass-nav z-[100] px-6">
                <div className="max-w-7xl mx-auto h-full flex justify-between items-center">
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-rose-500 rounded-2xl flex items-center justify-center text-white shadow-2xl shadow-rose-500/20 rotate-3 group cursor-pointer hover:rotate-0 transition-transform">
                            <ImageIcon className="w-7 h-7" />
                        </div>
                        <div>
                            <h1 className="text-2xl font-black tracking-tighter uppercase leading-none">VISUAL<span className="text-rose-500">VAULT</span></h1>
                            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.3em] mt-1">MK Creative Studio</p>
                        </div>
                    </div>

                    <div className="hidden lg:flex flex-1 max-w-xl mx-20">
                        <div className="relative w-full group">
                            <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 group-focus-within:text-rose-500 transition-colors" />
                            <input
                                type="text"
                                placeholder="Scan the vault for inspiration..."
                                className="w-full bg-white/5 border border-white/10 rounded-[2rem] py-4 pl-16 pr-8 text-sm font-medium focus:ring-4 focus:ring-rose-500/20 focus:border-rose-500/50 transition-all outline-none uppercase tracking-widest text-[10px]"
                            />
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => fileInputRef.current?.click()}
                            className="hidden sm:flex items-center gap-3 px-8 py-4 bg-rose-500 hover:bg-rose-600 text-white font-black rounded-[1.5rem] transition-all shadow-xl shadow-rose-500/20 active:scale-95 group"
                        >
                            <Upload className="w-5 h-5 group-hover:-translate-y-0.5 transition-transform" />
                            <span className="text-xs uppercase tracking-widest leading-none">Upload Asset</span>
                        </button>
                        <input type="file" ref={fileInputRef} className="hidden" />
                    </div>
                </div>
            </nav>

            <main className="pt-40 px-6 pb-20 max-w-7xl mx-auto w-full flex-1">
                {/* Sorting & Filter */}
                <div className="flex flex-col md:flex-row justify-between items-center gap-8 mb-16">
                    <div>
                        <h2 className="text-5xl font-black tracking-tighter uppercase mb-2 leading-none">THE <span className="text-slate-700 italic">ARCHIVE</span></h2>
                        <p className="text-xs font-bold text-slate-500 uppercase tracking-[0.4em] ml-1">Total Assets: 142.8K Verified</p>
                    </div>

                    <div className="flex gap-3 p-2 bg-white/5 rounded-3xl border border-white/10">
                        {['All', 'Art', 'Tech', 'Cyber'].map(cat => (
                            <button
                                key={cat}
                                onClick={() => setFilter(cat)}
                                className={`px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${filter === cat ? 'bg-rose-500 text-white' : 'hover:bg-white/5 text-slate-500'}`}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Masonry-ish Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {filteredImages.map((img, idx) => (
                        <motion.div
                            key={img.id}
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: idx * 0.1 }}
                            className="gallery-card group"
                            onClick={() => setSelectedImage(img)}
                        >
                            <img src={img.url} alt={img.title} className="w-full aspect-[4/5] object-cover group-hover:scale-110 transition-transform duration-700" />

                            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-8">
                                <div className="flex justify-between items-end">
                                    <div>
                                        <span className="text-[10px] font-bold text-rose-500 uppercase tracking-widest mb-1 block">{img.category}</span>
                                        <h3 className="text-xl font-black uppercase tracking-tight leading-none">{img.title}</h3>
                                    </div>
                                    <div className="flex gap-2">
                                        <button className="p-3 bg-white/10 backdrop-blur-md rounded-xl hover:bg-rose-500 transition-colors"><Maximize2 className="w-5 h-5" /></button>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* AI Processing Banner */}
                <section className="mt-32 p-12 bg-gradient-to-r from-rose-500/10 to-indigo-500/10 border border-white/5 rounded-[4rem] text-center relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-rose-500/20 rounded-full blur-[80px] -z-10 group-hover:translate-x-10 transition-transform duration-1000" />
                    <div className="absolute bottom-0 left-0 w-64 h-64 bg-indigo-500/20 rounded-full blur-[80px] -z-10 group-hover:-translate-x-10 transition-transform duration-1000" />

                    <div className="relative z-10">
                        <Sparkles className="w-12 h-12 text-rose-500 mx-auto mb-8 animate-pulse" />
                        <h3 className="text-4xl md:text-6xl font-black tracking-tighter uppercase mb-6 leading-none">Enhance your vision <br /> with <span className="text-rose-500">MK_AI_ENGINE</span></h3>
                        <p className="text-slate-400 font-medium max-w-2xl mx-auto mb-10">
                            Integrated neural upscaling, color grading, and generative expansion. Turn every upload into a masterpiece in milliseconds.
                        </p>
                        <button className="px-12 py-5 bg-white text-slate-950 font-black rounded-[2rem] hover:bg-rose-500 hover:text-white transition-all shadow-2xl active:scale-95 flex items-center gap-3 mx-auto uppercase text-xs tracking-widest">
                            Explore AI Lab <Wand2 className="w-4 h-4" />
                        </button>
                    </div>
                </section>
            </main>

            {/* Lightbox / Modal */}
            <AnimatePresence>
                {selectedImage && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[200] bg-slate-950/95 backdrop-blur-3xl flex items-center justify-center p-4"
                        onClick={() => setSelectedImage(null)}
                    >
                        <motion.div
                            initial={{ scale: 0.9, y: 20 }}
                            animate={{ scale: 1, y: 0 }}
                            exit={{ scale: 0.9, y: 20 }}
                            className="max-w-6xl w-full flex flex-col lg:flex-row gap-10 bg-slate-900 rounded-[4rem] p-10 overflow-hidden relative"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <button onClick={() => setSelectedImage(null)} className="absolute top-8 right-8 p-3 bg-white/5 hover:bg-rose-500 rounded-2xl transition-all z-10"><X className="w-6 h-6" /></button>

                            <div className="flex-1 rounded-[3rem] overflow-hidden shadow-2xl">
                                <img src={selectedImage.url} alt={selectedImage.title} className="w-full h-full object-cover" />
                            </div>

                            <div className="w-full lg:w-96 flex flex-col">
                                <div className="mb-10">
                                    <span className="text-xs font-bold text-rose-500 uppercase tracking-[0.3em] mb-3 block">{selectedImage.category}</span>
                                    <h2 className="text-5xl font-black uppercase tracking-tighter leading-[0.9] mb-6">{selectedImage.title}</h2>
                                    <p className="text-slate-400 font-medium leading-relaxed">
                                        Captured at 8K resolution. Metadata: Sony A7R IV • 35mm f/1.4 • ISO 100. Licensed for commercial use under VisualVault Premium.
                                    </p>
                                </div>

                                <div className="mt-auto space-y-4">
                                    <button className="w-full flex items-center justify-center gap-3 py-6 bg-rose-500 hover:bg-rose-600 text-white font-black rounded-3xl transition-all shadow-xl shadow-rose-500/20 uppercase text-xs tracking-widest">
                                        Download Original <Download className="w-5 h-5" />
                                    </button>
                                    <div className="grid grid-cols-2 gap-4">
                                        <button className="flex items-center justify-center gap-2 py-5 bg-white/5 hover:bg-white/10 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all">
                                            <Heart className="w-4 h-4" /> Favorite
                                        </button>
                                        <button className="flex items-center justify-center gap-2 py-5 bg-white/10 hover:bg-rose-500/20 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all text-rose-500">
                                            <Share2 className="w-4 h-4" /> Share
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Footer */}
            <footer className="py-20 border-t border-white/5 text-center mt-auto">
                <p className="text-[10px] font-black text-slate-600 uppercase tracking-[0.5em]">© 2024 MK_VISUAL_VAULT • 17/30 DONE</p>
            </footer>
        </div>
    );
}

export default App;

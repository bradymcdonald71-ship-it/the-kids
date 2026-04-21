/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useMemo, useEffect } from "react";
import { 
  Search, 
  Gamepad2, 
  Filter, 
  X, 
  Maximize2, 
  Star, 
  TrendingUp,
  ChevronRight,
  Info
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import gamesData from "./data/games.json";

interface Game {
  id: string;
  name: string;
  category: string;
  thumbnail: string;
  url: string;
  description: string;
}

export default function App() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [selectedGame, setSelectedGame] = useState<Game | null>(null);
  const [isIframeFullscreen, setIsIframeFullscreen] = useState(false);

  const categories = useMemo(() => {
    const cats = new Set(gamesData.map(g => g.category));
    return ["All", ...Array.from(cats)].sort();
  }, []);

  const filteredGames = useMemo(() => {
    return gamesData.filter(game => {
      const matchesSearch = game.name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategory === "All" || game.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [searchQuery, selectedCategory]);

  // Prevent scroll when game is open
  useEffect(() => {
    if (selectedGame) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
  }, [selectedGame]);

  return (
    <div className="min-h-screen bg-black text-white font-sans selection:bg-green-500/30">
      {/* Navigation */}
      <nav className="sticky top-0 z-40 border-b border-white/10 bg-black/80 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center neon-glow">
              <Gamepad2 className="text-black" size={24} />
            </div>
            <h1 className="text-xl font-bold tracking-tighter uppercase hidden sm:block">
              Nova Games
            </h1>
          </div>

          <div className="flex-1 max-w-md relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" size={18} />
            <input
              type="text"
              placeholder="Search games..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-full py-2 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-green-500/50 transition-all placeholder:text-white/20"
            />
          </div>

          <div className="flex items-center gap-4">
            <button className="text-white/50 hover:text-white transition-colors cursor-pointer hidden md:block">
              <TrendingUp size={20} />
            </button>
            <button className="bg-white text-black px-4 py-2 rounded-full font-semibold text-sm hover:bg-white/90 transition-all cursor-pointer">
              Login
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Categories Bar */}
        <section className="mb-12 overflow-x-auto pb-4 no-scrollbar">
          <div className="flex items-center gap-2">
            <Filter size={16} className="text-white/30 mr-2 shrink-0" />
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-5 py-1.5 rounded-full text-sm font-medium transition-all whitespace-nowrap cursor-pointer ${
                  selectedCategory === cat
                    ? "bg-green-500 text-black neon-glow"
                    : "bg-white/5 hover:bg-white/10 border border-white/5"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </section>

        {/* Hero Section (Only if no search/filter) */}
        {!searchQuery && selectedCategory === "All" && (
          <section className="mb-16">
            <div className="relative rounded-3xl overflow-hidden aspect-[21/9] bg-gradient-to-r from-zinc-900 to-black group border border-white/10">
              <img
                src="https://picsum.photos/seed/cyber/1200/600"
                alt="Feature Game"
                className="absolute inset-0 w-full h-full object-cover opacity-60 group-hover:scale-105 transition-transform duration-700"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />
              <div className="absolute bottom-0 left-0 p-8 md:p-12 w-full max-w-2xl">
                <div className="flex items-center gap-2 mb-4">
                  <span className="bg-green-500/20 text-green-400 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest border border-green-500/30">
                    Featured
                  </span>
                  <span className="text-white/40 text-xs">•</span>
                  <span className="text-white/40 text-xs font-medium uppercase tracking-widest">
                    Available Now
                  </span>
                </div>
                <h2 className="text-4xl md:text-6xl font-black mb-6 leading-none uppercase italic">
                  Level Up Your <br />
                  <span className="text-green-500">Unblocked</span> Experience
                </h2>
                <p className="text-white/60 text-lg mb-8 line-clamp-2 max-w-md">
                  Discover thousands of hand-picked titles that bypass everything. No downloads, no lag, just gameplay.
                </p>
                <button 
                  onClick={() => setSelectedGame(gamesData[0])}
                  className="flex items-center gap-2 bg-white text-black px-8 py-3 rounded-xl font-bold uppercase tracking-tighter hover:bg-green-500 transition-all cursor-pointer transform hover:scale-105"
                >
                  Play Featured <ChevronRight size={20} />
                </button>
              </div>
            </div>
          </section>
        )}

        {/* Game Grid */}
        <section>
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-2xl font-bold flex items-center gap-2 uppercase tracking-tighter">
              {searchQuery || selectedCategory !== "All" ? "Filtered Results" : "All Games"}
              <span className="text-white/20 text-lg font-normal ml-2">
                ({filteredGames.length})
              </span>
            </h3>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {filteredGames.map((game) => (
              <motion.div
                key={game.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                whileHover={{ y: -8 }}
                onClick={() => setSelectedGame(game)}
                className="group cursor-pointer"
              >
                <div className="relative aspect-[3/4] bg-zinc-900 rounded-2xl overflow-hidden border border-white/5 group-hover:border-green-500/50 transition-colors">
                  <img
                    src={game.thumbnail}
                    alt={game.name}
                    className="absolute inset-0 w-full h-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-110 transition-all duration-500"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-60 group-hover:opacity-90" />
                  
                  {/* Hover Overlay Info */}
                  <div className="absolute inset-0 p-4 flex flex-col justify-end translate-y-4 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-300">
                    <div className="bg-black/60 backdrop-blur-md p-3 rounded-xl border border-white/10">
                       <p className="text-xs text-white/60 mb-1 line-clamp-1">{game.description}</p>
                       <div className="flex items-center justify-between">
                         <span className="text-[10px] uppercase font-bold text-green-400">{game.category}</span>
                         <Star size={12} className="text-yellow-500 fill-yellow-500" />
                       </div>
                    </div>
                  </div>

                  <div className="absolute top-3 right-3 px-2 py-1 bg-black/50 backdrop-blur-md rounded-lg border border-white/10 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Info size={14} className="text-white" />
                  </div>
                </div>
                <h4 className="mt-3 font-bold text-sm tracking-wide group-hover:text-green-500 transition-colors px-1">
                  {game.name}
                </h4>
              </motion.div>
            ))}
          </div>

          {filteredGames.length === 0 && (
            <div className="text-center py-32 opacity-30">
              <Search size={48} className="mx-auto mb-4" />
              <p className="text-xl font-medium uppercase tracking-widest">No games found</p>
              <p className="text-sm mt-2">Try adjusting your search or category filter</p>
            </div>
          )}
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-white/5 py-12 mt-20 bg-zinc-950">
        <div className="max-w-7xl mx-auto px-4 grid md:grid-cols-3 gap-12 items-center text-center md:text-left">
          <div>
            <div className="flex items-center gap-2 justify-center md:justify-start mb-4">
              <Gamepad2 className="text-green-500" size={24} />
              <span className="font-black text-xl italic uppercase">Nova Games</span>
            </div>
            <p className="text-white/40 text-sm max-w-xs mx-auto md:mx-0">
              The ultimate unblocked destination. Stay safe, stay unblocked.
            </p>
          </div>
          <div className="space-x-8 text-sm font-medium text-white/30">
            <a href="#" className="hover:text-green-400 transition-colors">Privacy</a>
            <a href="#" className="hover:text-green-400 transition-colors">Terms</a>
            <a href="#" className="hover:text-green-400 transition-colors">DMCA</a>
          </div>
          <div className="text-sm text-white/20">
            © 2026 Nova Games Hub. All rights reserved.
          </div>
        </div>
      </footer>

      {/* Game Modal / Overlay */}
      <AnimatePresence>
        {selectedGame && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-0 sm:p-4 bg-black/95 backdrop-blur-3xl"
          >
            <motion.div
              layoutId={selectedGame.id}
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className={`relative bg-zinc-900 border border-white/10 shadow-2xl flex flex-col overflow-hidden transition-all duration-500 ${
                isIframeFullscreen 
                  ? "w-full h-full sm:rounded-none" 
                  : "w-full h-full sm:max-w-6xl sm:h-[85vh] sm:rounded-3xl"
              }`}
            >
              {/* Toolbar */}
              <div className="flex items-center justify-between p-4 bg-black/40 border-b border-white/5">
                <div className="flex items-center gap-4">
                  <div className="w-8 h-8 rounded-lg overflow-hidden shrink-0">
                    <img src={selectedGame.thumbnail} alt={selectedGame.name} className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <h5 className="font-bold text-sm leading-none flex items-center gap-2">
                       {selectedGame.name}
                       <span className="text-[10px] text-green-500 bg-green-500/10 px-1.5 py-0.5 rounded uppercase tracking-widest">{selectedGame.category}</span>
                    </h5>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <button 
                    onClick={() => setIsIframeFullscreen(!isIframeFullscreen)}
                    className="p-2 hover:bg-white/10 rounded-lg transition-colors cursor-pointer"
                    title="Fullscreen Mode"
                  >
                    <Maximize2 size={18} className="text-white/60" />
                  </button>
                  <button 
                    onClick={() => {
                      setSelectedGame(null);
                      setIsIframeFullscreen(false);
                    }}
                    className="p-2 hover:bg-red-500 rounded-lg transition-all cursor-pointer group"
                    title="Close Game"
                  >
                    <X size={18} className="text-white/60 group-hover:text-white" />
                  </button>
                </div>
              </div>

              {/* Iframe Area */}
              <div className="flex-1 relative bg-black">
                <iframe
                 src={selectedGame.url}
                 className="w-full h-full border-none"
                 allow="autoplay; encrypted-media; fullscreen; focus; geolocation; microphone; camera"
                 title={selectedGame.name}
                />
              </div>

              {/* Controls Info (Only if not full-full-screen) */}
              {!isIframeFullscreen && (
                <div className="p-4 bg-black/60 hidden sm:flex items-center justify-between text-xs text-white/40">
                  <div className="flex items-center gap-6">
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 rounded bg-white/10 flex items-center justify-center">F</div>
                      <span>Toggle Fullscreen</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 rounded bg-white/10 flex items-center justify-center">Esc</div>
                      <span>Close Game</span>
                    </div>
                  </div>
                  <div className="text-white/20 italic">
                    Note: Some games may require interaction to start audio.
                  </div>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <style>{`
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
}

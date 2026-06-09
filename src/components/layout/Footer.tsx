import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

export function Footer() {
  return (
    <footer className="mt-16 border-t border-purple-500/10 bg-gradient-to-b from-zinc-900 to-zinc-950 px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-[1400px]">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          {/* Brand */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h3 className="text-2xl font-black tracking-tight text-white mb-3">
              StreamForge
            </h3>
            <p className="text-white/70 text-lg mb-2 font-medium">
              Watch without limits
            </p>
            <p className="text-white/50 text-sm leading-relaxed">
              HD streaming, quick discovery, and a cleaner watch experience.
            </p>
          </motion.div>

          {/* Explore */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <h4 className="text-white/60 text-[13px] font-bold uppercase tracking-widest mb-4">
              Explore
            </h4>
            <ul className="space-y-3">
              {[
                { to: '/', label: 'Home' },
                { to: '/search?type=movie', label: 'Movies' },
                { to: '/search?type=tv', label: 'TV Shows' },
                { to: '/search?type=anime', label: 'Anime' },
                { to: '/favorites', label: 'Watchlist' },
              ].map((item) => (
                <li key={item.label}>
                  <Link
                    to={item.to}
                    className="text-white/80 hover:text-purple-300 transition-colors duration-200 text-base font-medium"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Trust & Legal */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <h4 className="text-white/60 text-[13px] font-bold uppercase tracking-widest mb-4">
              Trust & Legal
            </h4>
            <ul className="space-y-3">
              {['About', 'Contact', 'DMCA', 'Terms'].map((item) => (
                <li key={item}>
                  <a
                    href="#"
                    className="text-white/80 hover:text-purple-300 transition-colors duration-200 text-base font-medium"
                  >
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Community */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <h4 className="text-white/60 text-[13px] font-bold uppercase tracking-widest mb-4">
              Community
            </h4>
            
            <motion.a
              href="https://discord.gg/5K3zwXWpaV"
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="inline-flex items-center gap-3 rounded-xl bg-gradient-to-r from-purple-600/20 to-violet-600/20 hover:from-purple-600/30 hover:to-violet-600/30 border border-purple-500/30 hover:border-purple-400/50 px-5 py-3 transition-all duration-300 backdrop-blur-sm"
            >
              <span className="w-10 h-10 rounded-xl bg-purple-500/30 flex items-center justify-center text-xl">
                💬
              </span>
              <span className="text-base font-semibold text-purple-200">
                Join Discord
              </span>
            </motion.a>
          </motion.div>
        </div>

        {/* Bottom */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mt-12 pt-8 border-t border-purple-500/10 flex flex-col md:flex-row items-center justify-between gap-4"
        >
          <p className="text-white/40 text-sm">
            © {new Date().getFullYear()} StreamForge. All rights reserved.
          </p>
          <div className="flex gap-6 text-sm text-white/40">
            {['Privacy', 'Terms', 'DMCA'].map((item) => (
              <a
                key={item}
                href="#"
                className="hover:text-purple-300 transition-colors duration-200"
              >
                {item}
              </a>
            ))}
          </div>
        </motion.div>
      </div>
    </footer>
  );
}

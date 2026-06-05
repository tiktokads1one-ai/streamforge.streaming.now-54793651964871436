import { Link } from 'react-router-dom';

export function HomePage() {
  return (
    <div className="min-h-screen">
      {/* Hero Badge */}
      <div className="flex justify-center pt-10">
        <div className="inline-flex items-center gap-2 bg-white rounded-full px-3 py-1 shadow-sm">
          <span className="bg-gradient-to-r from-purple-deep to-purple text-white text-xs font-bold px-3 py-1 rounded-full">
            FREE STREAMING
          </span>
          <span className="text-xs text-gray-600">
            Watch thousands of Movies, TV Shows &amp; Anime completely free.
          </span>
        </div>
      </div>

      {/* Hero Section */}
      <div className="max-w-5xl mx-auto px-4 pt-16 pb-32">
        <div className="text-center">
          {/* Headline */}
          <h1 className="text-6xl md:text-8xl font-black leading-tight">
            <div>Stream without</div>
            <div className="text-gradient">Limits.</div>
          </h1>

          {/* Subtitle */}
          <div className="mt-6 text-lg text-gray-600 max-w-2xl mx-auto">
            <p>Watch movies, anime, TV shows and more in one place.</p>
            <p className="mt-2">Built for speed, quality and unlimited entertainment.</p>
          </div>

          {/* CTA Buttons */}
          <div className="mt-10 flex items-center justify-center gap-4">
            <Link
              to="/search?type=movie"
              className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-deep to-purple text-white font-bold px-8 py-3 rounded-full hover:shadow-lg hover:scale-105 transition-all"
            >
              ▶ Start Watching
            </Link>
            <Link
              to="/search"
              className="inline-flex items-center gap-2 text-gray-700 font-semibold hover:text-purple-deep transition-colors"
            >
              Browse Library →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
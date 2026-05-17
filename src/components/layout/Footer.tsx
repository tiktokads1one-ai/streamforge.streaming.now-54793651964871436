export function Footer() {
  return (
    <footer className="mt-16 border-t border-white/[0.06] bg-surface-raised/50 px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-4xl text-center">
        <p className="text-sm font-semibold text-white">You&apos;re safe here</p>
        <ul className="mt-4 flex flex-wrap justify-center gap-x-4 gap-y-2 text-xs text-white/45">
          <li>✓ 100% Free</li>
          <li>✓ No sign-up</li>
          <li>✓ No app install</li>
          <li>✓ Switch servers anytime</li>
        </ul>
        <p className="mt-6 text-[11px] text-white/30">
          StreamForge · Metadata from TMDB · Playback via VidCore embed
        </p>
      </div>
    </footer>
  );
}

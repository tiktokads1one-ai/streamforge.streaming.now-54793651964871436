import { motion } from 'framer-motion';
import {
  getActiveProvider,
  getProviders,
  switchProvider,
} from '@/providers/providerManager';
import { useLibraryStore } from '@/store/useLibraryStore';
import { GlassCard } from '@/components/ui/GlassCard';

interface ServerSelectorProps {
  onSwitch?: () => void;
}

export function ServerSelector({ onSwitch }: ServerSelectorProps) {
  const providers = getProviders();
  const active = getActiveProvider();
  const setPlayback = useLibraryStore((s) => s.setPlaybackSettings);

  const handleSwitch = (id: string) => {
    switchProvider(id);
    setPlayback({ preferredProviderId: id });
    onSwitch?.();
  };

  return (
    <section className="mt-4 px-4 sm:px-6">
      <p className="mb-3 text-center text-sm text-white/60">
        Slow or unavailable? Switch servers below.
      </p>
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        className="mx-auto max-w-lg"
      >
        <p className="mb-3 flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-forge-glow">
          <span>⚡</span> Servers
        </p>
        <motion.div className="grid grid-cols-2 gap-3">
          {providers.map((provider) => {
            const isActive = provider.id === active.id;
            return (
              <GlassCard
                key={provider.id}
                active={isActive}
                onClick={() => handleSwitch(provider.id)}
                className="p-4"
              >
                <p className="font-semibold text-white">{provider.name}</p>
                <p className="text-sm text-forge-glow">{provider.quality}</p>
                <p className="text-xs text-white/50">{provider.description}</p>
                {isActive && (
                  <p className="mt-2 text-[10px] uppercase tracking-wide text-forge-green">
                    Selected
                  </p>
                )}
              </GlassCard>
            );
          })}
        </motion.div>
      </motion.div>
    </section>
  );
}

import { motion } from 'framer-motion';
import {
  getActiveProvider,
  getProviders,
  switchProvider,
} from '@/providers/providerManager';
import type { Provider, ProviderBadge } from '@/providers/Provider';
import { useLibraryStore } from '@/store/useLibraryStore';
import { ProviderIcon } from './ProviderIcon';

interface ServerSelectorProps {
  onSwitch?: () => void;
}

function Badge({ badge }: { badge: ProviderBadge }) {
  if (!badge) return null;
  const styles =
    badge === 'FAST'
      ? 'bg-amber-400/15 text-amber-300 ring-amber-400/30'
      : badge === 'HD'
        ? 'bg-sky-400/15 text-sky-300 ring-sky-400/30'
        : 'bg-violet-400/15 text-violet-300 ring-violet-400/30';
  return (
    <span
      className={`rounded-md px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide ring-1 ${styles}`}
    >
      {badge}
    </span>
  );
}

function ServerRow({
  provider,
  isActive,
  onSelect,
}: {
  provider: Provider;
  isActive: boolean;
  onSelect: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onSelect}
      className={`group relative flex w-full items-center gap-3 rounded-xl border px-4 py-3.5 text-left transition ${
        isActive
          ? 'border-violet-400/60 bg-violet-500/10 shadow-[0_0_24px_rgba(139,92,246,0.2)]'
          : 'border-white/[0.06] bg-white/[0.03] hover:border-violet-500/30 hover:bg-white/[0.06]'
      }`}
    >
      {isActive && (
        <span className="absolute left-0 top-2 bottom-2 w-1 rounded-full bg-violet-400 shadow-[0_0_12px_rgba(167,139,250,0.8)]" />
      )}
      <span
        className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${
          isActive ? 'bg-violet-500/20 text-violet-200' : 'bg-white/5 text-white/45'
        }`}
      >
        <ProviderIcon type={provider.icon} />
      </span>
      <span className="min-w-0 flex-1">
        <span className="block font-semibold text-white">{provider.name}</span>
        <span className="block text-xs text-white/40">{provider.description}</span>
      </span>
      {isActive ? (
        <span className="shrink-0 text-[11px] font-bold uppercase tracking-wider text-violet-300">
          Active
        </span>
      ) : (
        <Badge badge={provider.badge ?? null} />
      )}
    </button>
  );
}

export function ServerSelector({ onSwitch }: ServerSelectorProps) {
  const providers = getProviders();
  const active = getActiveProvider();
  const setPlayback = useLibraryStore((s) => s.setPlaybackSettings);

  const handleSwitch = (id: string) => {
    if (id === active.id) return;
    switchProvider(id);
    setPlayback({ preferredProviderId: id });
    onSwitch?.();
  };

  return (
    <section className="mx-auto mt-6 max-w-md px-4 sm:px-0">
      <div className="mb-3 flex items-start gap-3 rounded-xl border border-red-500/25 bg-red-950/40 px-3 py-2.5">
        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-red-500/20 text-red-400">
          ⚠
        </span>
        <div className="min-w-0 flex-1 text-sm">
          <p className="font-semibold uppercase tracking-wide text-red-400/90">
            Not working?
          </p>
          <p className="text-white/70">
            Lagging or broken?{' '}
            <span className="font-medium text-white">Switch server</span>
          </p>
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="overflow-hidden rounded-2xl border border-violet-500/20 bg-gradient-to-b from-violet-600/10 via-surface-card to-surface-card shadow-card"
      >
        <div className="border-b border-white/[0.06] px-5 py-4">
          <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-white/40">
            Currently using
          </p>
          <p className="mt-1 text-2xl font-bold text-white">{active.name}</p>
          <p className="mt-1 text-sm text-white/45">
            Slow or blocked? Pick another below.
          </p>
        </div>

        <div className="px-4 py-4">
          <p className="mb-3 flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-violet-300">
            <ProviderIcon type="server" className="h-4 w-4" />
            Servers
          </p>
          <ul className="flex flex-col gap-2">
            {providers.map((provider) => (
              <li key={provider.id}>
                <ServerRow
                  provider={provider}
                  isActive={provider.id === active.id}
                  onSelect={() => handleSwitch(provider.id)}
                />
              </li>
            ))}
          </ul>
        </div>
      </motion.div>
    </section>
  );
}

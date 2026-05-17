import { readStorage, writeStorage, STORAGE_KEYS } from '@/utils/storage';
import type { Provider, ProviderContext } from './Provider';
import { primaryProvider } from './primary';
import { backupProvider } from './backup';

const providers: Provider[] = [primaryProvider, backupProvider];

let activeProviderId = readStorage<string>(
  STORAGE_KEYS.provider,
  primaryProvider.id,
);

export function getProviders(): Provider[] {
  return providers;
}

export function getActiveProvider(): Provider {
  return (
    providers.find((p) => p.id === activeProviderId) ?? primaryProvider
  );
}

export function getProviderById(id: string): Provider | undefined {
  return providers.find((p) => p.id === id);
}

export function switchProvider(id: string): Provider {
  const next = getProviderById(id);
  if (!next) {
    return getActiveProvider();
  }
  activeProviderId = next.id;
  writeStorage(STORAGE_KEYS.provider, next.id);
  return next;
}

export function getPlaybackSource(ctx: ProviderContext): string {
  return getActiveProvider().getPlaybackSource(ctx);
}

export function getPlaybackSourceWithFallback(
  ctx: ProviderContext,
): { source: string; provider: Provider } {
  const active = getActiveProvider();
  return { source: active.getPlaybackSource(ctx), provider: active };
}

export function tryFallbackProvider(
  currentId: string,
): Provider | null {
  const fallback = providers.find((p) => p.id !== currentId);
  if (!fallback) return null;
  return switchProvider(fallback.id);
}

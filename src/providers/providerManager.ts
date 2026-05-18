import { readStorage, writeStorage, STORAGE_KEYS } from '@/utils/storage';
import type { Provider, ProviderContext } from './Provider';
import { primaryProvider } from './primary';
import { backupProvider } from './backup';
import { videasyProvider } from './videasy';
import { vidsrcProvider } from './vidsrc';
import { vidsrcMeProvider } from './vidsrcme';

const providers: Provider[] = [
  videasyProvider,
  vidsrcProvider,
  primaryProvider,
  vidsrcMeProvider,
  backupProvider,
];

let activeProviderId = readStorage<string>(
  STORAGE_KEYS.provider,
  videasyProvider.id,
);

export function getProviders(): Provider[] {
  return providers;
}

export function getActiveProvider(): Provider {
  return (
    providers.find((p) => p.id === activeProviderId) ?? videasyProvider
  );
}

export function getProviderById(id: string): Provider | undefined {
  return providers.find((p) => p.id === id);
}

export function switchProvider(id: string): Provider {
  const next = getProviderById(id);
  if (!next) return getActiveProvider();
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

export function tryFallbackProvider(currentId: string): Provider | null {
  const currentIndex = providers.findIndex((p) => p.id === currentId);
  const next = providers[currentIndex + 1];
  if (!next) return null;
  return switchProvider(next.id);
}
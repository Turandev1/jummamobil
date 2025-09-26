// queryClient.tsx
import { QueryClient } from "@tanstack/react-query";
import { PersistQueryClientProvider } from "@tanstack/react-query-persist-client";
import { createAsyncStoragePersister } from "@tanstack/query-async-storage-persister";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const queryClient = new QueryClient();

// Persister tanımı (MMKV async wrapper ile)
const persister = createAsyncStoragePersister({
  storage: AsyncStorage,
});

// Provider ile sarmalanmış App
export function QueryProvider({ children }: { children: React.ReactNode }) {
  return (
    <PersistQueryClientProvider
      client={queryClient}
      persistOptions={{
        persister,
        maxAge: 1000 * 60 * 60 * 24 * 3, // 30 gün
      }}
    >
      {children}
    </PersistQueryClientProvider>
  );
}

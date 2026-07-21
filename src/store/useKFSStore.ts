import { createStore } from "./coreStore";

export interface KFSStoreState {
  version: string;
  globalCatalog: any[];
  setGlobalCatalog: (catalog: any[]) => void;
}

export const kfsStore = createStore<KFSStoreState>({
  version: "3.3",
  globalCatalog: [],
  setGlobalCatalog: (catalog) => kfsStore.setState({ globalCatalog: catalog })
});

export const useKFSStore = kfsStore.useStore;

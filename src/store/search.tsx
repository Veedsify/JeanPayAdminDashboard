"use client";
import { searchDocument } from "@/data/config/data";
import { add } from "lodash";
import MiniSearch from "minisearch";
import React, {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
} from "react";

export type PageFunctionDoc = {
  id: number;
  title: string;
  content: string;
  type: "page" | "function";
  link?: string;
};

type MiniSearchContextType = {
  miniSearch: MiniSearch<PageFunctionDoc>;
  addDocuments: (docs: PageFunctionDoc[]) => void;
};

const MiniSearchContext = createContext<MiniSearchContextType | undefined>(
  undefined,
);

export const useMiniSearch = () => {
  const context = useContext(MiniSearchContext);
  if (!context) {
    throw new Error("useMiniSearch must be used within a MiniSearchProvider");
  }
  return context;
};

export const MiniSearchProvider = ({ children }: { children: ReactNode }) => {
  const addedRef = useRef(0);
  const miniSearch = useMemo(
    () =>
      new MiniSearch<PageFunctionDoc>({
        fields: ["title", "content", "type", "link"],
        storeFields: ["id", "title", "type", "link"],
      }),
    [],
  );

  const addDocuments = useCallback((docs: PageFunctionDoc[]) => {
    miniSearch.addAll(docs);
  }, []);

  useEffect(() => {
    if (searchDocument.length > 0 && addedRef.current == 0) {
      addDocuments(searchDocument);
      addedRef.current = 1;
    }
  }, [searchDocument, miniSearch]);

  return (
    <MiniSearchContext.Provider value={{ miniSearch, addDocuments }}>
      {children}
    </MiniSearchContext.Provider>
  );
};

// Example: Feed in the documents
// const docs: PageFunctionDoc[] = [
//   { id: '1', title: 'Home Page', content: 'Welcome to the homepage.', type: 'page' },
//   { id: '2', title: 'calculateSum', content: 'Function to calculate sum of two numbers.', type: 'function' },
// ]
// addDocuments(docs)

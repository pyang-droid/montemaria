"use client";

import { useEffect, useMemo, useState } from "react";
import {
  collection,
  onSnapshot,
  query,
  where,
  type DocumentData,
} from "firebase/firestore";
import { db } from "./firebase";

export type FirestoreRecord<T extends DocumentData> = T & { id: string };

export function useLiveCollection<T extends DocumentData>(
  name: string,
  publishedAttractionsOnly = false
) {
  const source = useMemo(
    () =>
      publishedAttractionsOnly
        ? query(
            collection(db, name),
            where("isActive", "==", true),
            where("isPublished", "==", true)
          )
        : collection(db, name),
    [name, publishedAttractionsOnly]
  );
  const [state, setState] = useState<{
    name: string;
    records: FirestoreRecord<T>[];
    loading: boolean;
    error: string | null;
  }>({ name: "", records: [], loading: true, error: null });

  useEffect(() => {
    return onSnapshot(
      source,
      (snapshot) => {
        setState({
          name,
          records: snapshot.docs.map(
            (document) =>
              ({ ...document.data(), id: document.id }) as FirestoreRecord<T>
          ),
          loading: false,
          error: null,
        });
      },
      (reason) => {
        console.error(`Unable to subscribe to ${name}:`, reason);
        setState({
          name,
          records: [],
          loading: false,
          error: "Unable to load records. Check your access and try again.",
        });
      }
    );
  }, [name, source]);

  const current = state.name === name;
  return {
    records: current ? state.records : [],
    loading: !current || state.loading,
    error: current ? state.error : null,
  };
}

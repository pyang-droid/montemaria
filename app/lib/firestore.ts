"use client";

import { useEffect, useState } from "react";
import {
  collection,
  onSnapshot,
  type DocumentData,
} from "firebase/firestore";
import { db } from "./firebase";

export type FirestoreRecord<T extends DocumentData> = T & { id: string };

export function useLiveCollection<T extends DocumentData>(name: string) {
  const [state, setState] = useState<{
    name: string;
    records: FirestoreRecord<T>[];
    loading: boolean;
    error: string | null;
  }>({ name: "", records: [], loading: true, error: null });

  useEffect(() => {
    return onSnapshot(
      collection(db, name),
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
  }, [name]);

  const current = state.name === name;
  return {
    records: current ? state.records : [],
    loading: !current || state.loading,
    error: current ? state.error : null,
  };
}

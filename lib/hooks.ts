"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { getDb, ref, onValue, set, remove } from "./firebase";
import { BusPosition } from "./types";

function useRealtimeValue<T>(path: string): { data: Record<string, T>; loading: boolean } {
  const [data, setData] = useState<Record<string, T>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const db = getDb();
      const dbRef = ref(db, path);

      const unsubscribe = onValue(
        dbRef,
        (snapshot) => {
          const val = snapshot.val();
          setData(val ? (val as Record<string, T>) : {});
          setLoading(false);
        },
        () => {
          setLoading(false);
        }
      );

      return unsubscribe;
    } catch {
      setTimeout(() => setLoading(false), 0);
    }
  }, [path]);

  return { data, loading };
}

export function useBuses() {
  const { data, loading } = useRealtimeValue<BusPosition>("buses");
  return { buses: data, loading };
}

export function useFirebaseStatus() {
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    try {
      const db = getDb();
      const connectedRef = ref(db, ".info/connected");
      const unsubscribe = onValue(connectedRef, (snap) => {
        setConnected(snap.val() === true);
      });
      return unsubscribe;
    } catch {}
  }, []);

  return { connected };
}

export function useSetBusCapacity(busId: string) {
  const db = getDb();

  const setCapacityStatus = useCallback(
    (status: string) => {
      const statusRef = ref(db, `buses/${busId}/capacity_status`);
      set(statusRef, status);
    },
    [db, busId]
  );

  return { setCapacityStatus };
}

export function useTracker() {
  const [position, setPosition] = useState<GeolocationPosition | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [watching, setWatching] = useState(false);
  const [watcherId, setWatcherId] = useState<number | null>(null);

  const startTracking = useCallback(() => {
    if (!navigator.geolocation) {
      setError("Geolocation not supported");
      return;
    }

    const id = navigator.geolocation.watchPosition(
      (pos) => {
        setPosition(pos);
        setError(null);
      },
      (err) => {
        setError(err.message);
      },
      { enableHighAccuracy: true, maximumAge: 5000, timeout: 10000 }
    );

    setWatcherId(id);
    setWatching(true);
  }, []);

  const stopTracking = useCallback(() => {
    if (watcherId !== null) navigator.geolocation.clearWatch(watcherId);
    setWatcherId(null);
    setWatching(false);
  }, [watcherId]);

  useEffect(() => {
    return () => {
      if (watcherId !== null) navigator.geolocation.clearWatch(watcherId);
    };
  }, [watcherId]);

  return { position, error, watching, startTracking, stopTracking };
}

export function usePublishPosition() {
  const db = getDb();
  const lastPublishRef = useRef(0);

  const publish = useCallback(
    (busId: string, routeId: string, pos: GeolocationPosition, capacityStatus?: string) => {
      const now = Date.now();
      if (now - lastPublishRef.current < 2000) return;
      lastPublishRef.current = now;

      const busRef = ref(db, `buses/${busId}`);
      const data: Record<string, unknown> = {
        lat: pos.coords.latitude,
        lng: pos.coords.longitude,
        timestamp: new Date().toISOString(),
        route_id: routeId,
      };
      if (capacityStatus) data.capacity_status = capacityStatus;
      set(busRef, data);
    },
    [db]
  );

  return { publish };
}

export function useRemoveBusData() {
  const db = getDb();

  const removeBus = useCallback(
    (busId: string) => {
      const busRef = ref(db, `buses/${busId}`);
      remove(busRef);
    },
    [db]
  );

  return { removeBus };
}

"use client";

import { useMemo } from "react";
import { useLoadScript, GoogleMap, Polyline } from "@react-google-maps/api";
import { BusPosition } from "@/lib/types";
import { PITX_COORDS, ROUTE_PATHS, ROUTE_COLORS } from "@/lib/constants";
import { ROUTES_META } from "@/lib/design";
import { computeETA } from "@/lib/algorithms";
import BusMarker from "./BusMarker";

const containerStyle: React.CSSProperties = { position: "absolute", top: 0, left: 0, right: 0, bottom: 0 };

interface MapViewProps {
  buses: Record<string, BusPosition>;
  selectedRouteId?: string;
}

function MapInner({ buses, selectedRouteId }: MapViewProps) {
  const center = useMemo(() => PITX_COORDS, []);

  const routeIds = useMemo(
    () => (selectedRouteId ? [selectedRouteId] : Object.keys(ROUTE_PATHS)),
    [selectedRouteId]
  );

  const options = useMemo(
    () => ({
      disableDefaultUI: true,
      zoomControl: false,
    }),
    []
  );

  return (
    <GoogleMap mapContainerStyle={containerStyle} center={center} zoom={11} options={options}>
      {routeIds.map((rid) => (
        <Polyline
          key={rid}
          path={ROUTE_PATHS[rid]}
          options={{
            strokeColor: ROUTE_COLORS[rid],
            strokeOpacity: 0.5,
            strokeWeight: 3,
          }}
        />
      ))}

      {Object.entries(buses).map(([id, bus]) => {
        const color = ROUTE_COLORS[bus.route_id] || "#6B6B6B";
        const meta = ROUTES_META[bus.route_id as keyof typeof ROUTES_META];
        const routeLabel = meta?.name ?? bus.route_id;
        const eta = computeETA(bus);
        return (
          <BusMarker key={id} busId={id} lat={bus.lat} lng={bus.lng} color={color} pulse routeLabel={routeLabel} eta={eta} />
        );
      })}
    </GoogleMap>
  );
}

export default function MapView(props: MapViewProps) {
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "",
  });

  if (loadError) {
    return (
      <div style={{ padding: 24, textAlign: "center", color: "#EE3127", fontWeight: 600, fontSize: 14 }}>
        Failed to load Google Maps
      </div>
    );
  }

  if (!isLoaded) {
    return (
      <div
        style={{
          height: "100%", display: "flex", alignItems: "center", justifyContent: "center",
          background: "#F2F2F7",
        }}
      >
        <div style={{ textAlign: "center" }}>
          <div
            style={{
              width: 32, height: 32, border: "3px solid #E5E5EA",
              borderTopColor: "#22469D", borderRadius: "50%",
              margin: "0 auto 12px", animation: "spin .8s linear infinite",
            }}
          />
          <p style={{ margin: 0, fontSize: 13, color: "#6B6B6B", fontWeight: 600 }}>
            Loading map...
          </p>
        </div>
      </div>
    );
  }

  return <MapInner {...props} />;
}

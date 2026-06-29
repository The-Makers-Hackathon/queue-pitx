"use client";

import { useMemo } from "react";
import { GoogleMap, Polyline } from "@react-google-maps/api";
import { BusPosition } from "@/lib/types";
import { PITX_COORDS, ROUTE_PATHS, ROUTE_COLORS, ROUTE_LABELS } from "@/lib/constants";
import BusMarker from "./BusMarker";

const containerStyle = { width: "100%", height: "100%" };
const mapOptions: google.maps.MapOptions = {
  disableDefaultUI: true,
  zoomControl: false,
  styles: [
    { featureType: "poi", stylers: [{ visibility: "off" }] },
    { featureType: "transit", stylers: [{ visibility: "off" }] },
  ],
};

interface MapViewProps {
  buses: Record<string, BusPosition>;
  selectedRouteId?: string;
}

export default function MapView({ buses, selectedRouteId }: MapViewProps) {
  const center = useMemo(() => PITX_COORDS, []);

  const routeIds = useMemo(
    () => (selectedRouteId ? [selectedRouteId] : Object.keys(ROUTE_PATHS)),
    [selectedRouteId]
  );

  return (
    <GoogleMap mapContainerStyle={containerStyle} center={center} zoom={11} options={mapOptions}>
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
        return (
          <BusMarker key={id} busId={id} lat={bus.lat} lng={bus.lng} color={color} pulse />
        );
      })}
    </GoogleMap>
  );
}

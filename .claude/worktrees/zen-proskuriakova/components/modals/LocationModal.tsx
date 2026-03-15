"use client";

import dynamic from "next/dynamic";
import { LocationData } from "@/context/CollectionsContext";

// Leaflet requires window — dynamic import with SSR disabled
const LeafletMap = dynamic(() => import("./LeafletMap"), { ssr: false });

type Props = {
  open: boolean;
  data: LocationData;
  onClose: () => void;
  onSave: (data: LocationData) => void;
};

export default function LocationModal({ open, data, onClose, onSave }: Props) {
  if (!open) return null;

  const handleConfirm = (address: string, lat: number, lng: number) => {
    onSave({ address, lat, lng });
    onClose();
  };

  return (
    <div
      className="slide-up"
      style={{
        position: "fixed", inset: 0, zIndex: 200,
        maxWidth: 430, margin: "0 auto",
        background: "#f5f5f5",
      }}
    >
      <LeafletMap
        onConfirm={handleConfirm}
        onClose={onClose}
        initialLat={(data as LocationData & { lat?: number }).lat}
        initialLng={(data as LocationData & { lng?: number }).lng}
      />
    </div>
  );
}

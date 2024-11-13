import React, { useEffect, useRef } from "react";
import { Card } from "../ui/card";
import { generateSvg } from "src/utils/helpers";
import L from "leaflet";
import { ICar } from "src/interfaces/common";

interface ICoordinates {
  id: string;
  lat: number;
  lng: number;
  price: string;
  carName: string;
  carImage: string;
}

const createMarkerIcon = (price: string) => {
  const priceTagSvg = generateSvg(price);
  return new L.DivIcon({
    html: priceTagSvg,
    className: "leaflet-marker-icon",
    iconSize: [40, 40], // Adjust the size of the marker
  });
};

type Props = {
  cars: ICar[];
};

const HomeMap = ({ cars }: Props) => {
  // Set mapRef to L.Map | null
  const mapRef = useRef<L.Map | null>(null); // `mapRef` can be `null` initially
  const markersRef = useRef<L.Marker[]>([]);

  const coordinates: ICoordinates[] = cars?.map((car) => ({
    id: car?.id,
    lat: car?.location?.coordinates[1],
    lng: car?.location?.coordinates[0],
    price: car?.rentPerDay ? car?.rentPerDay.toString() : "N/A",
    carName: car?.name,
    carImage: car?.images[0]?.url,
  }));

  const loadMap = () => {
    // Only create the map once if it's not already initialized
    if (mapRef.current) return; // Check if the map is already initialized

    const mapInstance = L.map("map").setView(
      [coordinates[0]?.lat || 0, coordinates[0]?.lng || 0],
      10
    );

    // TileLayer (example: OpenStreetMap)
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(mapInstance);

    mapRef.current = mapInstance; // Store map instance in useRef
  };

  useEffect(() => {
    loadMap();
  }, []); // Empty dependency array ensures this only runs once

  useEffect(() => {
    if (mapRef.current && coordinates?.length > 0) {
      // Clear existing markers
      markersRef.current.forEach((marker) => marker.remove());
      markersRef.current = [];

      coordinates?.forEach((coordinate) => {
        const marker = L.marker([coordinate.lat, coordinate.lng], {
          icon: createMarkerIcon(coordinate.price),
        }).addTo(mapRef.current!);

        marker.on("click", () => {
          const content = 
            `<div class="text-center mx-auto" style="max-width: 200px;">
              <img src="${coordinate.carImage}" alt="Car Name" class="border mb-3 w-full h-auto" />
              <a href="/car/${coordinate.id}" target="_blank" class="text-xl font-medium text-blue-600 dark:text-blue-500 hover:underline">${coordinate.carName} - $${coordinate.price}</a>
            </div>`;

          const popup = L.popup()
            .setContent(content)
            .setLatLng([coordinate.lat, coordinate.lng]);
          popup.openOn(mapRef.current!);
        });

        markersRef.current.push(marker);
      });
    }
  }, [coordinates]); // Re-run only when `coordinates` change

  return (
    <Card className="w-full flex-1">
      <div id="map" className="h-full h-screen"></div>
    </Card>
  );
};

export default HomeMap;

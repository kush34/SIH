import { useState, useRef, useEffect, useCallback } from "react";
import { APIProvider, Map, useApiLoadingStatus } from "@vis.gl/react-google-maps";
import { Input } from "@/components/ui/input";
import { X } from "lucide-react";
import { TrafficChart } from "@/components/chart";

const API_KEY = import.meta.env.VITE_GOOGLE_MAPS;

interface MapPosition {
  lat: number;
  lng: number;
}

const DEFAULT_POSITION: MapPosition = { lat: 22.593684, lng: 78.96288 };
const DEFAULT_ZOOM = 5;
const SEARCH_ZOOM = 13;

const SearchComponent = () => {
  const [mapCenter, setMapCenter] = useState<MapPosition>(DEFAULT_POSITION);
  const [zoom, setZoom] = useState(DEFAULT_ZOOM);
  const [inputValue, setInputValue] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);
  const listenerRef = useRef<google.maps.MapsEventListener | null>(null);

  const apiLoadingStatus = useApiLoadingStatus();

  const initializeAutocomplete = useCallback(() => {
    if (!inputRef.current || !window.google?.maps?.places?.Autocomplete) return;

    try {
      autocompleteRef.current = new window.google.maps.places.Autocomplete(
        inputRef.current,
        {
          types: ["(cities)"],
          fields: ["geometry", "name", "formatted_address"]
        }
      );

      listenerRef.current = autocompleteRef.current.addListener(
        "place_changed",
        () => {
          const place = autocompleteRef.current?.getPlace();
          if (place?.geometry?.location) {
            const location = place.geometry.location;
            setMapCenter({
              lat: location.lat(),
              lng: location.lng()
            });
            setZoom(SEARCH_ZOOM);
            setInputValue(place.formatted_address || place.name || "");
          }
        }
      );
    } catch (error) {
      console.error("Error initializing autocomplete:", error);
    }
  }, []);

  const cleanupAutocomplete = useCallback(() => {
    if (listenerRef.current) {
      window.google?.maps?.event?.removeListener(listenerRef.current);
      listenerRef.current = null;
    }
    autocompleteRef.current = null;
  }, []);

  useEffect(() => {
    if (apiLoadingStatus === "LOADED") {
      initializeAutocomplete();
    }

    return cleanupAutocomplete;
  }, [apiLoadingStatus, initializeAutocomplete, cleanupAutocomplete]);

  const resetMap = useCallback(() => {
    setMapCenter(DEFAULT_POSITION);
    setZoom(DEFAULT_ZOOM);
    setInputValue("");

    if (inputRef.current) {
      inputRef.current.value = "";
    }
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const handleInputFocus = () => {
    inputRef.current?.select();
  };

  if (apiLoadingStatus === "FAILED") {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-red-500">Failed to load Google Maps</p>
      </div>
    );
  }
  useEffect(() => {
    const handleHotkey = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.key === "k") {
        e.preventDefault();
        inputRef.current?.focus();
        inputRef.current?.select();
      }
    };

    window.addEventListener("keydown", handleHotkey);
    return () => window.removeEventListener("keydown", handleHotkey);
  }, []);
  return (
    <div className="relative h-screen w-screen">
      <div className="absolute top-4 left-1/2 -translate-x-1/2 z-10 flex items-center w-1/2 max-w-5xl">
        <Input
          ref={inputRef}
          type="text"
          placeholder="Search for a city or ctl+k shortcut..."
          value={inputValue}
          onChange={handleInputChange}
          onFocus={handleInputFocus}
          className="flex-1 px-4 py-2 rounded-l-lg border bg-white shadow-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
        />
        {inputValue && (
          <button
            onClick={resetMap}
            className="mx-2 px-3 py-2 rounded-lg bg-white border border-l-0 border-gray-300 shadow-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
            aria-label="Clear search"
          >
            <X size={16} />
          </button>
        )}
      </div>
      <div className="hidden md:block md:absolute top-4 left-4 z-10">
        <TrafficChart />
      </div>

      <Map
        defaultCenter={DEFAULT_POSITION}
        center={mapCenter}
        defaultZoom={DEFAULT_ZOOM}
        zoom={zoom}
        mapId="DEMO_MAP_ID"
        className="h-full w-full"
        gestureHandling="greedy"
        mapTypeControl={false}
        streetViewControl={false}
        fullscreenControl={false}
        zoomControl={false}
        rotateControl={false}
        scaleControl={false}
        clickableIcons={false}
      />
    </div>
  );
};

const Dashboard = () => {
  if (!API_KEY) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-red-500">Google Maps API key not found</p>
      </div>
    );
  }

  return (
    <APIProvider apiKey={API_KEY} libraries={["places"]}>
      <SearchComponent />
    </APIProvider>
  );
};

export default Dashboard;
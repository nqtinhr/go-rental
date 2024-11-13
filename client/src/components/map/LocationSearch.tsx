import React, { useEffect, useState } from "react";
import { Button } from "../ui/button";
import { Popover, PopoverTrigger, PopoverContent } from "../ui/popover";
import { MapPin, MapPinned } from "lucide-react";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "../ui/command";
import axios from "axios"; // Using axios to call Nominatim API for location search

type Props = {
  onLocationChanged: (location: string) => void;
  prevLocation?: string;
};

const PlacesAutocomplete = ({ onLocationChanged, prevLocation }: Props) => {
  const [open, setOpen] = useState(false);
  const [locationValue, setLocationValue] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);

  // Nominatim API endpoint for search
  const searchLocation = async (query: string) => {
    if (!query) return;
    setLoading(true);
    try {
      const response = await axios.get(
        `https://nominatim.openstreetmap.org/search?format=json&q=${query}&addressdetails=1&limit=5`
      );
      setSuggestions(response.data);
    } catch (error) {
      console.error("Error fetching location data", error);
    }
    setLoading(false);
  };

  useEffect(() => {
    if (prevLocation) {
      setLocationValue(prevLocation);
    }
  }, [prevLocation]);

  return (
    <div className="w-full">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-full flex justify-between items-center"
          >
            <MapPinned className="h-4 w-4 shrink-0 opacity-50 mr-2" />
            <span className="flex-grow text-left truncate">
              {locationValue ? locationValue : "Select location ..."}
            </span>
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[500px] p-0">
          <Command>
            <CommandInput
              placeholder="Search Location..."
              value={locationValue}
              onValueChange={(val) => {
                setLocationValue(val);
                searchLocation(val); // Trigger search
              }}
            />
            <CommandList>
              <CommandEmpty>No location found.</CommandEmpty>
              <CommandGroup>
                {loading ? (
                  <div>Loading...</div>
                ) : (
                  suggestions.map(({ lat, lon, display_name }, index) => (
                    <CommandItem
                      key={index}
                      value={display_name}
                      onSelect={(currentValue) => {
                        setLocationValue(currentValue);
                        onLocationChanged(currentValue);
                        setOpen(false);
                      }}
                    >
                      <div className="flex justify-between items-center w-full">
                        <div className="flex items-center flex-grow">
                          <MapPin className="h-4 w-4 flex-shrink-0 mr-2" />
                          <span className="flex-grow">{display_name}</span>
                        </div>
                      </div>
                    </CommandItem>
                  ))
                )}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
};

const LocationSearch = ({ onLocationChanged, prevLocation }: Props) => {
  const [isLoaded, setIsLoaded] = useState(true); // Set isLoaded to true since we don't need to load a map

  return (
    <div>
      {isLoaded ? (
        <PlacesAutocomplete
          onLocationChanged={onLocationChanged}
          prevLocation={prevLocation}
        />
      ) : (
        <div>Loading...</div>
      )}
    </div>
  );
};

export default LocationSearch;

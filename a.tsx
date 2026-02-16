import { Search, MapPin, Building2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import PropertyVerificationBanner from "./PropertyVerificationBanner";
import { useAvailableLocations } from "@/hooks/useAvailableLocations";
import { useIsMobile } from "@/hooks/use-mobile";

interface SearchBarProps {
  selectedCity?: string;
}

const SearchBar = ({ selectedCity }: SearchBarProps) => {
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const { locations } = useAvailableLocations();
  const [selectedLocations, setSelectedLocations] = useState<string[]>(
    selectedCity ? [selectedCity] : []
  );
  const [listingType, setListingType] = useState<string>("");

  const handleLocationAdd = (location: string) => {
    if (location && !selectedLocations.includes(location)) {
      setSelectedLocations([...selectedLocations, location]);
    }
  };

  const handleLocationRemove = (location: string) => {
    setSelectedLocations(selectedLocations.filter(loc => loc !== location));
  };

  const handleSearchClick = () => {
    const searchParams = new URLSearchParams();
    
    if (selectedLocations.length > 0) {
      searchParams.set('cities', selectedLocations.join(','));
    }
    
    if (listingType && listingType !== 'all') {
      searchParams.set('listing_type', listingType);
    }
    
    const queryString = searchParams.toString();
    navigate(`/search${queryString ? `?${queryString}` : ''}`);
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4">
      {isMobile ? (
        // Mobile Layout - Vertical Stack
        <div className="space-y-3 mb-6">
          {/* Locations Section - Mobile */}
          <div className="bg-background border border-input rounded-xl p-4 shadow-sm">
            <div className="flex items-center gap-2 mb-3">
              <MapPin className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium text-foreground">Locations</span>
            </div>
            
            <div className="space-y-2">
              {selectedLocations.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {selectedLocations.map((location) => (
                    <Badge key={location} variant="secondary" className="text-xs">
                      {location}
                      <X
                        className="h-3 w-3 ml-1 cursor-pointer"
                        onClick={() => handleLocationRemove(location)}
                      />
                    </Badge>
                  ))}
                </div>
              )}
              
              <Select onValueChange={handleLocationAdd}>
                <SelectTrigger className="w-full h-10">
                  <SelectValue placeholder="Add location..." />
                </SelectTrigger>
                <SelectContent>
                  {locations.map((location) => (
                    <SelectItem 
                      key={location.id} 
                      value={location.city}
                      disabled={selectedLocations.includes(location.city)}
                    >
                      {location.city}, {location.state}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Listing Type & Search Button Row - Mobile */}
          <div className="flex gap-3">
            <div className="bg-background border border-input rounded-xl p-4 shadow-sm flex-1">
              <div className="flex items-center gap-2 mb-3">
                <Building2 className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium text-foreground">Type</span>
              </div>
              <Select value={listingType} onValueChange={setListingType}>
                <SelectTrigger className="w-full h-10">
                  <SelectValue placeholder="All Types" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="rent">For Rent</SelectItem>
                  <SelectItem value="sell">For Sale</SelectItem>
                  <SelectItem value="lease">For Lease</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Button 
              onClick={handleSearchClick}
              className="bg-destructive hover:bg-destructive/90 text-destructive-foreground rounded-xl h-auto px-6 py-4 flex items-center justify-center min-w-[80px]"
            >
              <Search className="h-5 w-5" />
            </Button>
          </div>
        </div>
      ) : (
        // Desktop Layout - Horizontal
        <div className="flex items-center bg-background border border-input rounded-full overflow-hidden shadow-lg mb-6">
          {/* Locations Section */}
          <div className="flex items-center gap-2 px-4 py-3 flex-1 min-w-0">
            <MapPin className="h-4 w-4 text-muted-foreground flex-shrink-0" />
            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap gap-1 mb-1">
                {selectedLocations.length > 0 ? (
                  selectedLocations.map((location) => (
                    <Badge key={location} variant="secondary" className="text-xs">
                      {location}
                      <X
                        className="h-3 w-3 ml-1 cursor-pointer"
                        onClick={() => handleLocationRemove(location)}
                      />
                    </Badge>
                  ))
                ) : (
                  <span className="text-sm font-medium text-foreground">Select Locations</span>
                )}
              </div>
              <Select onValueChange={handleLocationAdd}>
                <SelectTrigger className="border-0 shadow-none focus:ring-0 h-auto p-0 w-fit">
                  <span className="text-xs text-muted-foreground">Add location...</span>
                </SelectTrigger>
                <SelectContent>
                  {locations.map((location) => (
                    <SelectItem 
                      key={location.id} 
                      value={location.city}
                      disabled={selectedLocations.includes(location.city)}
                    >
                      {location.city}, {location.state}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Divider */}
          <div className="w-px h-8 bg-border" />

          {/* Listing Type Section */}
          <div className="flex items-center gap-2 px-4 py-3 flex-1 min-w-0">
            <Building2 className="h-4 w-4 text-muted-foreground flex-shrink-0" />
            <Select value={listingType} onValueChange={setListingType}>
              <SelectTrigger className="border-0 shadow-none focus:ring-0 h-auto p-0">
                <div className="text-left">
                  <div className="text-sm font-medium text-foreground">
                    {listingType && listingType !== 'all' ? (listingType === 'rent' ? 'For Rent' : listingType === 'lease' ? 'For Lease' : 'For Sale') : 'All Types'}
                  </div>
                  <div className="text-xs text-muted-foreground">Listing type</div>
                </div>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="rent">For Rent</SelectItem>
                <SelectItem value="sell">For Sale</SelectItem>
                <SelectItem value="lease">For Lease</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Search Button */}
          <Button 
            onClick={handleSearchClick}
            className="bg-destructive hover:bg-destructive/90 text-destructive-foreground rounded-full h-12 px-6 mx-2 flex items-center gap-2"
          >
            <Search className="h-4 w-4" />
            Search
          </Button>
        </div>
      )}
      <PropertyVerificationBanner />
    </div>
  );
};

export default SearchBar;

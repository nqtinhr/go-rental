import { ArrowRightLeft, HandCoins } from "lucide-react";
import { useState } from "react";
import { DateRange } from "react-day-picker";
import { useNavigate } from "react-router-dom";
import { buildQueryString } from "src/utils/helpers";
import { CarDatePicker } from "../booking/CarDatePicker";
import LocationSearch from "../map/LocationSearch";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";

const Search = () => {
  const [location, setLocation] = useState<string>("");
  const [dates, setDates] = useState<DateRange | undefined>({
    from: undefined,
    to: undefined,
  });
  const [budget, setBudget] = useState<string>("");

  const navigate = useNavigate();

  const submitHandler = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const queryString = buildQueryString({
      location,
      startDate: dates?.from,
      endDate: dates?.to,
      budget,
    });

    const url = queryString ? `/?${queryString}` : "/";
    navigate(url);

    // Reset form fields after navigation
    setLocation("");
    setDates({ from: undefined, to: undefined });
    setBudget("");
  };

  return (
    <div className="w-full py-4">
      <form
        onSubmit={submitHandler}
        className="flex flex-col gap-6 lg:flex-row"
      >
        <div className="flex flex-col gap-1 w-full lg:w-auto">
          <Label htmlFor="location">Pick Up Location</Label>
          <LocationSearch onLocationChanged={(value) => setLocation(value)} />
        </div>
        <div className="flex flex-col gap-1 w-full lg:w-auto">
          <Label htmlFor="dates">Select Dates</Label>
          <CarDatePicker onDateChange={(dates) => setDates(dates)} />
        </div>
        <div className="flex flex-col gap-1 w-full lg:w-auto">
          <Label htmlFor="budget">Budget Per Day (Optional)</Label>
          <div className="relative">
            <HandCoins className="absolute left-4 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="number"
              placeholder="50"
              className="w-full rounded-lg bg-background pl-10"
              value={budget}
              onChange={(e) => setBudget(e.target.value)}
            />
          </div>
        </div>
        <div className="w-full sm:w-1/2 lg:w-auto mt-3 lg:mt-4">
          <Button type="submit" className="w-full lg:w-auto">
            <ArrowRightLeft className="h-4 w-4 mr-2" />
            Find Best Deals
          </Button>
        </div>
      </form>
    </div>
  );
};

export default Search;

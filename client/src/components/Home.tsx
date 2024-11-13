import Filters from "./layout/Filters";
import { useQuery } from "@apollo/client";
import ListHomeCars from "./car/ListHomeCars";
import { GET_ALL_CARS } from "src/graphql/queries/car.queries";
import { useSearchParams } from "react-router-dom";
import { useEffect } from "react";

import { errorToast } from "src/utils/helpers";

import HomeMap from "./map/HomeMap";
import LoadingSpinner from "./layout/LoadingSpinner";
import { CardHeader, CardTitle } from "./ui/card";
import Search from "./search/Search";

const Home = () => {
  let [searchParams] = useSearchParams();

  const query = searchParams.get("query");
  const page = parseInt(searchParams.get("page") || "1", 10);

  const category = searchParams.get("category");
  const brand = searchParams.get("brand");
  const transmission = searchParams.get("transmission");

  const location = searchParams.get("location");
  const startDate = searchParams.get("startDate");
  const endDate = searchParams.get("endDate");
  const budget = searchParams.get("budget");

  const filters = {
    status: "Active",
    ...(budget && { rentPerDay: { lte: parseInt(budget, 10) } }),
    ...(category && { category }),
    ...(brand && { brand }),
    ...(transmission && { transmission }),
  };

  const variables = {
    page,
    filters,
    query,
    location,
    dateFilters: { startDate, endDate },
  };

  const { data, loading, error } = useQuery(GET_ALL_CARS, { variables });

  useEffect(() => {
    if (error) errorToast(error);
  }, [error]);

  return (
    <main className="my-8 grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8 md:grid-cols-6 lg:grid-cols-12 xl:grid-cols-12">
      <div className="md:col-span-2 lg:col-span-2 flex flex-col">
        <Filters />
      </div>

      <div className="md:col-span-4 lg:col-span-10 flex flex-col">
        <CardHeader className="p-0 w-full">
          <CardTitle className="text-2xl">
            {location
              ? `${data?.getAllCars?.cars?.length} Cars in: ${location}`
              : "Rent Car for Your Next Trip"}
          </CardTitle>
          <div className="flex-1 flex justify-end">
            <Search />
          </div>
        </CardHeader>

        <div className="grid md:grid-cols-1 lg:grid-cols-2 gap-4 mt-2">
          <div className="flex flex-col">
            <ListHomeCars
              cars={data?.getAllCars?.cars}
              loading={loading}
              pagination={data?.getAllCars?.pagination}
            />
          </div>

          <div className="flex flex-col">
            <div className="flex items-center justify-center h-screen">
              {loading ? (
                <div className="flex items-center justify-center h-screen">
                  <LoadingSpinner fullScreen={true} size={60} />
                </div>
              ) : (
                location && <HomeMap cars={data?.getAllCars?.cars} />
              )}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default Home;

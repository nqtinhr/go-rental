import { ICar } from "src/interfaces/common";
import CustomPagination from "../layout/CustomPagination";
import LoadingSpinner from "../layout/LoadingSpinner";
import CardItem from "./CardItem";

type Props = {
  cars: ICar[];
  loading: boolean;
  pagination: {
    totalCount: number;
    resPerPage: number;
  };
};

const ListHomeCars = ({ cars, loading, pagination }: Props) => {
  if (loading) {
    return <LoadingSpinner size={60} fullScreen={true} />;
  }

  return (
    <>
      <div className="text-sm text-muted-foreground">
        {cars?.map((car: ICar) => (
          <CardItem key={car?.id} car={car} />
        ))}
      </div>
      {pagination?.totalCount > pagination?.resPerPage && (
        <CustomPagination
          totalCount={pagination?.totalCount}
          resPerPage={pagination?.resPerPage}
        />
      )}
    </>
  );
};

export default ListHomeCars;

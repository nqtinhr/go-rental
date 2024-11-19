import { gql } from "@apollo/client";

export const GET_ALL_CARS = gql`
  query Cars(
    $filters: CarFilters
    $query: String
    $page: Int
    $location: String
    $dateFilters: DateFilters
  ) {
    getAllCars(
      filters: $filters
      query: $query
      page: $page
      location: $location
      dateFilters: $dateFilters
    ) {
      cars {
        category
        fuelType
        location {
          coordinates
        }
        images {
          public_id
          url
        }
        id
        name
        rentPerDay
        transmission
        ratings {
          count
          value
        }
        createdAt
      }
      pagination {
        resPerPage
        totalCount
      }
    }
  }
`;

export const GET_CAR_BY_ID = gql`
  query GetCarById(
    $carId: ID!
    $getCarBookedDatesCarId2: String
    $canReviewCarId: ID
  ) {
    getCarById(carId: $carId) {
      id
      name
      description
      status
      rentPerDay
      address
      year
      power
      milleage
      brand
      transmission
      fuelType
      seats
      doors
      images {
        url
        public_id
      }
      reviews {
        id
        user {
          id
          name
          avatar {
            public_id
            url
          }
        }
        rating
        comment
        updatedAt
      }
      category
      ratings {
        value
        count
      }
      createdAt
      updatedAt
    }
    getCarBookedDates(carId: $getCarBookedDatesCarId2)
    canReview(canReviewCarId: $canReviewCarId)
    getAllFaqs {
      id
      question
      answer
    }
  }
`;

import JobPost from "@/backend/models/NewJob";
import userDb from "@/backend/models/userModel";
import { PaginationParams } from "@/backend/utils/pagination";
import getDistanceAggrQuery from "@/helper/aggregateDistanceQuery";
import { getPaginatedData } from "@/helper/getPaginatedData";
export const getUsersJobPost = async (
  userId: any,
  {
    pageNumber,
    pageSize,
    categories = "",
    distance = "",
    placeName = "",
    userCoordinates,
  }: PaginationParams & {
    categories?: string;
    distance?: string;
    placeName?: string;
    userCoordinates?: { lat: number; lon: number };
  }
) => {
  try {
    const totalDocuments = await JobPost.countDocuments({ userId });
    const {
      adjustedPageSize,
      hasToContinue,
      emptyResponse,
      totalPages,
      currentPage,
    } = getPaginatedData(totalDocuments, pageSize, pageNumber);

    if (!hasToContinue) {
      return emptyResponse;
    }

    const findCriteria: any = {
      userId: userId,
    };

    if (categories) {
      findCriteria.category = categories;
    }

    if (placeName) {
      findCriteria["location.place_name"] = {
        $regex: placeName,
        $options: "i",
      };
    }

    let aggregationPipeline: any[] = [
      { $match: findCriteria },
      { $sort: { createdAt: -1 } },
      { $skip: (pageNumber - 1) * pageSize },
      { $limit: adjustedPageSize },
    ];

    if (userCoordinates && userCoordinates?.lat && userCoordinates?.lon) {
      const distanceAggregation = getDistanceAggrQuery(
        userCoordinates.lat,
        userCoordinates.lon
      );
      aggregationPipeline = [
        { $match: findCriteria },
        ...distanceAggregation,
        { $sort: { createdAt: -1 } },
        { $skip: (pageNumber - 1) * pageSize },
        { $limit: adjustedPageSize },
      ];

      if (distance) {
        const distanceInMeters = Number(distance) * 1000; // Convert distance to meters
        aggregationPipeline.push({
          $match: { distance: { $lte: distanceInMeters } },
        });
      }
    }

    let allJobs = await JobPost.aggregate(aggregationPipeline).exec();

    return { data: allJobs, totalPages, currentPage };
  } catch (error) {
    throw error;
  }
};

const getDistanceAggrQuery = (long: number, lat: number) => {
  const query: any = [
    {
      $geoNear: {
        near: {
          type: "Point",
          coordinates: [long, lat],
        },
        spherical: true,
        distanceField: "distance", // Field to store calculated distance
        key: "location.coordinates", // Field containing the coordinates
        distanceMultiplier: 0.001, // Convert distance to kilometers
      },
    },
    {
      $addFields: {
        distance: { $round: "$distance" }, // Round the distance to the nearest integer
      },
    },
  ];
  return query;
};
export default getDistanceAggrQuery;


location: {
  coordinates: {
    type: { type: String, default: "Point" },
    coordinates: [Number],
  },
  place_name: { type: String, required: true },
  zip_code: { type: Number, required: true },
},
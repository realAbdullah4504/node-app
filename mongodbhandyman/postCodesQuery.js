// Import necessary modules

import connectDb from "@/backend/middleware/db";
import PostalCode from "@/backend/models/PostalCode";
import userDb from "@/backend/models/userModel";
import { createError, errorResponse } from "@/backend/utils/errorHandler";
import getDistanceAggrQuery from "@/helper/aggregateDistanceQuery";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  switch (req.method) {
    case "GET":
      await GetHandyman(req, res);
      break;
    default:
      res.status(405).json({ error: "Method Not Allowed" });
      break;
  }
}

async function GetHandyman(req: NextApiRequest, res: NextApiResponse) {
  try {
    const zipCode = req.query?.zipCode;
    const service = req.query?.service;
    const pageSize = req.query?.pageSize || 10;
    const pageNumber = req.query?.pageNumber || 1;
    const city = req.query?.city;
    const minRating = req.query.rating;
    let distance = Number(req.query.distance);
	
    if (!zipCode || zipCode === "undefined") {
		return createError("missing zip code", 400);
    }
	
    if (!service) {
		return createError("missing service", 400);
    }

    if (!city) {
      return createError("missing city", 400);
    }
	const currentPostalCode= await PostalCode.findOne({ Place_Name: city });
	const currentLatitude= Number(currentPostalCode?.Latitude);
	const currentLongitude= Number(currentPostalCode?.Longitude);

	//distance=100000;
	const distanceAggregation = getDistanceAggrQuery(currentLatitude, currentLongitude);
	const distanceInMeters = distance;
	const distanceCheckAggregation = {
	  $match: { distance: { $lte: distanceInMeters } },
	};
	const postalCodesWithinRadius = await PostalCode.aggregate([
	  ...distanceAggregation,
	  distanceCheckAggregation,
	]);

	const postalCodeIds = postalCodesWithinRadius.map((doc) => doc._id);


    const serviceString = String(service).split("-").join(" ");
    // Use aggregation pipeline to get users
    const lastStage: any = [
      { $sort: { avgRating: -1, "craftsman.statusOrder": 1 } },
      { $skip: (Number(pageNumber) - 1) * Number(pageSize) },
      { $limit: Number(pageSize) },
    ];
    if (minRating) {
		lastStage.unshift({
			$match: {
				avgRating: {
					$gte: Number(minRating),
				},
			},
		});
    }
    const results = await userDb.aggregate([
		{
			$match: {
				role: "handyman",
				address: {
					$in: postalCodeIds,
				},
        },
      },
      {
        $lookup: {
          from: "postalcodes", // The name of the PostalCode collection
          localField: "address",
          foreignField: "_id",
          as: "address",
        },
      },
      {
        $unwind: "$address",
      },
      {
        $match: {
          "address.Postal_Code": Number(zipCode),
          // "address.Place_Name": city,
        },
      },
      { $addFields: { admin_name: "$address.Admin_Name" } },
      {
        $lookup: {
          from: "craftsmen", // The name of the Craftsman collection
          localField: "craftsman",
          foreignField: "_id",
          as: "craftsman",
        },
      },
      {
        $unwind: "$craftsman",
      },
      {
        $match: {
          "craftsman.services": {
            $in: [new RegExp(serviceString, "i")],
          },
          "craftsman.status": "verified",
        },
      },

      {
        $lookup: {
          from: "reviews", // The name of the Reviews collection
          localField: "craftsman.reviews",
          foreignField: "_id",
          as: "reviews",
        },
      },
      {
        $unwind: {
          path: "$reviews",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $group: {
          _id: "$_id",
          name: { $first: "$name" },
          profile_photo: { $first: "$profile_photo" },
          address: { $first: "$address" },
          admin_name: { $first: "$admin_name" },
          role: { $first: "$role" },
          craftsman: { $first: "$craftsman" },
          avgRating: { $avg: "$reviews.rating" },
        },
      },
      {
        $addFields: {
          "craftsman.statusOrder": {
            $switch: {
              branches: [
                {
                  case: {
                    $eq: ["$craftsman.status", "verified"],
                  },
                  then: 0,
                },
                {
                  case: {
                    $eq: ["$craftsman.status", "unverified"],
                  },
                  then: 1,
                },
                // Add more cases as needed for other status values
              ],
              default: 2, // Default value for any other status
            },
          },
        },
      },
      {
        $facet: {
          totalCount: [{ $count: "count" }],
          data: lastStage,
        },
      },
    ]);

    const totalCount = results[0].totalCount[0]?.count || 0;
    const totalPages = Math.ceil(totalCount / Number(pageSize));
    const users = results[0].data;

    res.status(200).json({
      users,
      totalCount,
      totalPages,
      currentPage: Number(pageNumber),
    });
  } catch (error: any) {
    return errorResponse(res, error);
  }
}

connectDb(handler);

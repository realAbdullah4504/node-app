const mongoose = require('mongoose');
const { Schema, model, models } = require('mongoose');


// { "Admin_Name3": { $regex: "�" } }
const connectDB = async () => {
    try {
        const uri = 'mongodb+srv://abdullahjaved4504:kVuuxpFFieEbuxA5@cluster0.eyd6ho3.mongodb.net/developement'
        // const uri = 'mongodb://localhost:27017/developement';
        await mongoose.connect(uri, {
            serverSelectionTimeoutMS: 50000, // Increase the timeout to 50 seconds
        });
        console.log('Connected to MongoDB');
    } catch (error) {
        console.error('MongoDB connection error:', error);
    }
};
connectDB();


// Define the interface for Plan
// Define the schema for Plan
const planSchema = new Schema({
    name: { type: String, required: true },
    price: { type: Number, required: true },
    duration_in_months: { type: Number, required: true, min: 1, max: 12 },
    description: { type: String, required: true },
});

// Define and export the Plan model
const Plans = models.Plans ?? model("Plans", planSchema);

const insertPlans = async () => {
    try {
        await connectDB();
        const plans = [
            {
                name: "Basic",
                price: 9.99,
                duration_in_months: 1,
                description: "Basic plan with essential features",
            },
            {
                name: "Standard",
                price: 19.99,
                duration_in_months: 3,
                description: "Standard plan with more features",
            },
            {
                name: "Premium",
                price: 29.99,
                duration_in_months: 6,
                description: "Premium plan with all features",
            },
            {
                name: "Enterprise",
                price: 49.99,
                duration_in_months: 12,
                description: "Enterprise plan with priority support",
            },
        ];
        await Plans.insertMany(plans);
        console.log("Plans inserted successfully");
    } catch (error) {
        console.error("Error inserting plans:", error);
    } finally {
        mongoose.connection.close();
    }
};

// insertPlans();


const PostalCodeSchema = new mongoose.Schema(
    {
        Postal_Code: { type: Number, required: true },
        Place_Name: { type: String, required: true },
        Latitude: { type: Number, required: true },
        Longitude: { type: Number, required: true },
        location: {
            type: { type: String, default: "Point" },
            coordinates: { type: [Number], index: "2dsphere" },
        },
        Admin_Name: { type: String, default: "" },
        Admin_Code: { type: String, default: "" },
        Admin_Name2: { type: String, default: "" },
        Admin_Code2: { type: String, default: "" },
        Admin_Name3: { type: String, default: "" },
        Admin_Code3: { type: Number },
        CountryCode: { type: String, required: true },
        Accuracy: { type: Number, required: true },
    },
    { timestamps: true }
);

const PostalCode = mongoose.model("PostalCode", PostalCodeSchema);

const dataArray = require("./developement.postalcodes.json");
// console.log(dataArray.length);


const insertPostalCodes = async () => {
    try {
        await connectDB();
        // Transform the data: convert Extended JSON _id ({ "$oid": "..." }) to plain string
        const transformedData = dataArray.map(doc => {
            if (doc._id && doc._id.$oid) {
                return { ...doc, _id: doc._id.$oid };
            }
            return doc;
        });
        const result = await PostalCode.insertMany(transformedData);
        console.log("Results have been inserted");
    } catch (error) {
        console.error('Error inserting postal codes:', error);
    } finally {
        mongoose.connection.close(); // Ensure connection is closed after insertion
    }
};

// insertPostalCodes();

async function updateDocuments() {
    try {
        // Find all documents that need to be updated
        const documentsToUpdate = await PostalCode.find({});

        // Update each document
        for (let doc of documentsToUpdate) {
            // Construct GeoJSON coordinates
            doc.location = {
                type: "Point",
                coordinates: [doc.Longitude, doc.Latitude]
            };
            // Save the updated document
            await doc.save();
        }

        console.log("Documents updated successfully.");
    } catch (error) {
        console.error("Error updating documents:", error);
    }
}

// updateDocuments();



const getDistanceAggrQuery = (long, lat) => {
    const query = [
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


const postalCodesWithRadius = async () => {
    try {
        const distanceAggregation = getDistanceAggrQuery(
            43.22728106,
            -8.288771847
        );
        const distance = 1000;


        const distanceInMeters = Number(distance); // Convert distance to meters
        const distanceCheckAggregation = {
            $match: { distance: { $lte: distanceInMeters } },
        };
        const postalCodesWithinRadius = await PostalCode.aggregate([
            ...distanceAggregation,
            distanceCheckAggregation,
        ])

        const postalCodeIds = postalCodesWithinRadius.map(doc => doc._id);

        const matchedPostal = await PostalCode.aggregate([
            { $match: { _id: { $in: postalCodeIds } } }
        ]);

        const hello = 2;
    }
    catch (error) {
        console.log(error)
    }
}

// postalCodesWithRadius();


async function updatePlaceNamesFromJSON() {
    try {

        const data = fs.readFileSync('correctPlaceNames.json', 'utf8');
        const placeNames = JSON.parse(data);

        for (const entry of placeNames) {
            const { id, Place_Name } = entry;

            const result = await PostalCode.updateMany(
                { _id: id },
                { $set: { Place_Name } }
            );

            console.log(`Matched ${result.matchedCount} documents and modified ${result.modifiedCount} documents for ID ${id}.`);
        }
    } catch (error) {
        console.error('Error updating Place_Name:', error);
    } finally {
        mongoose.connection.close();
    }
}

//   updatePlaceNamesFromJSON();

// const wrongCityNames = require("./wrongLetters.json");
const fs = require("fs");
const correctCityNames = async () => {
    const wrongCityNames = JSON.parse(fs.readFileSync("wrongLetters.json", "utf8"));
    const bulkOps = wrongCityNames.map(({ _id, Place_Name, Admin_Name }) => ({
        updateOne: {
            filter: { _id: new mongoose.Types.ObjectId(_id.$oid) },
            update: { Place_Name, Admin_Name },
        },
    }));

    const result = await PostalCode.bulkWrite(bulkOps);
}

// correctCityNames();


// const postalCodes = require("./Spainpostalcode_Spain_Postal_Code.json")
// console.log(postalCodes.length)

const correctPostalDistanceAndlocationName = () => {
    const correct = postalCodes.map(postalCode => {
        const { _id, Place_Name, Admin_Name, Postal_Code, Latitude, Longitude } = postalCode
        postalCode.location = {
            type: "Point",
            coordinates: [Longitude, Latitude]
        }
        return postalCode;
    }
    )
    fs.writeFileSync("correctPostalDistanceAndlocationName.json", JSON.stringify(correct))
    console.log("file is written")
}

// correctPostalDistanceAndlocationName();
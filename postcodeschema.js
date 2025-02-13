import { Document, Model, Schema, model, models } from "mongoose";

// Define interface for TypeScript type checking
export interface IPostalCode {
    Postal_Code: number;
    Place_Name: string;
    Latitude: number;
    Longitude: number;
    Admin_Name: string;
    Admin_Code: string;
    Admin_Name2: string;
    Admin_Code2: string;
    Admin_Name3: string;
    Admin_Code3: number;
    CountryCode: string;
    Accuracy: number;
}

interface PostalCodeDoc extends IPostalCode, Document { }

// Define MongoDB schema
const PostalCodeSchema = new Schema < PostalCodeDoc > (
    {
        Postal_Code: { type: Number, required: true },
        Place_Name: { type: String, required: true },
        Latitude: { type: Number, required: true },
        Longitude: { type: Number, required: true },
        Admin_Name: { type: String, default: "" }, // Adjusted to have a default value
        Admin_Code: { type: String, default: "" }, // Adjusted to have a default value
        Admin_Name2: { type: String, default: "" }, // Adjusted to have a default value
        Admin_Code2: { type: String, default: "" }, // Adjusted to have a default value
        Admin_Name3: { type: String, default: "" }, // Adjusted to have a default value
        Admin_Code3: { type: Number }, // Adjusted to have a default value
        CountryCode: { type: String, required: true },
        Accuracy: { type: Number, required: true },
    },
    { timestamps: true }
);

// Export the model
const PostalCode: Model<PostalCodeDoc> =
    models.PostalCode ?? model < PostalCodeDoc > ("PostalCode", PostalCodeSchema);

export default PostalCode;

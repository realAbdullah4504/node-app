import { citySiteMaps } from "./cityMaps";
import postals from "./developement.postalcodes.json";


// const selectedMaps = citySiteMaps.filter(city => .some(filtered => city.toLowerCase().includes(filtered.toLowerCase())))
// selectedMaps

// const postals = [{ Place_Name: "Madrid" }, { Place_Name: "Albaida del Aljarafe" }]
const selectedMaps = postals.filter(postal => citySiteMaps.some(filtered => (postal.Place_Name.toLowerCase().includes(filtered.toLowerCase() || filtered.toLowerCase().includes(postal.Place_Name.toLowerCase())))))
selectedMaps


const madrid=selectedMaps.filter(city=>city.Place_Name==="Madrid")
madrid

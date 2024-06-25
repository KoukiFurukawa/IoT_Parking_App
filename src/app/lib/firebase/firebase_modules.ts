import { db } from "./firebase_config";
import { doc, getDocs, collection } from "firebase/firestore";
import { ParkingData } from "../interfaces";

export async function loadAvailableParking()
{
    const querySnapshot = await getDocs(collection(db, "Users"));
    let coordinates: ParkingData[] = []
    querySnapshot.forEach((doc) => {
        // doc.data() is never undefined for query doc snapshots
        let data = doc.data()
        let parkingData: ParkingData = {
            name: data.name,
            path: {
                x: data.path.x,
                y: data.path.y
            },
            percent: data.percent
        }
        console.log(doc.id, " => ", doc.data());
        coordinates.push(parkingData)
    });
    return coordinates;
}

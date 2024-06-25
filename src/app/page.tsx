"use client"
import Image from "next/image";
import { Wrapper, Status } from "@googlemaps/react-wrapper";
import { GoogleMap, LoadScript, Marker } from "@react-google-maps/api";

import { loadAvailableParking } from "./lib/firebase/firebase_modules";
import { IPosition, ParkingData } from "./lib/interfaces";
import { useEffect, useState } from "react";

export default function Home() {
    const googleMapAPI: any = process.env.NEXT_PUBLIC_GOOGLE_MAP_API;
    const containerStyle = {
        width: "100%",
        height: "92vh",
    };
    const zoom = 13;
    const [position, setPosition] = useState<IPosition>({ lat:0, lng:0 })
    const [map, setMap] = useState<google.maps.Map>();
    const [coordinates, setCoordinates] = useState<ParkingData[]>([{name:"", path: { x:0, y:0 }, percent: 0}])

    useEffect(() => {
        navigator.geolocation.getCurrentPosition(position => {
            const userPos: IPosition = {
                lat: position.coords.latitude,
                lng: position.coords.longitude
            };
            setPosition(userPos);
        });
        const loadData = async () => {
            const data = await loadAvailableParking();
            setCoordinates(data)
        }
        loadData();

    }, [])

    const render = (status: Status) => {
        return <h1>{status}</h1>;
    };
    

    return (
        <>
            <div className="">
                <Wrapper apiKey={googleMapAPI} render={render}>
                    <GoogleMap
                        mapContainerStyle={containerStyle}
                        center={position}
                        zoom={zoom}
                        onLoad={map => { setMap(map); }}
                    >
                        { coordinates.map((marker, index) => (
                            <Marker key={index} position={{ lat: marker.path.x, lng: marker.path.y }} title={marker.name} />
                        ))}
                    </GoogleMap>
                    
                </Wrapper>
            </div>
        </>
    );
}

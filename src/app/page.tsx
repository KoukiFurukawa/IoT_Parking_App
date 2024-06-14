"use client"
import Image from "next/image";
import { Wrapper, Status } from "@googlemaps/react-wrapper";
import { GoogleMap, useJsApiLoader } from "@react-google-maps/api";

export default function Home() {
  const googleMapAPI: any = process.env.NEXT_PUBLIC_GOOGLE_MAP_API;

  const containerStyle = {
    width: "100%",
    height: "86vh",
  };
  
  const center = {
    lat: 34.7293466708865,
    lng: 135.49939605607292,
  };
  
  const zoom = 13;  

  const render = (status: Status) => {
    return <h1>{status}</h1>;
  };

  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: 'YOUR API KEY HERE',
    libraries: ['geometry', 'drawing'],
  });
  

  return (
    <>
      <Wrapper apiKey={googleMapAPI} render={render}>
        { isLoaded ? 
          <GoogleMap
            mapContainerStyle={containerStyle}
            center={center}
            zoom={zoom}
        ></GoogleMap> : 
        <></>
        }
      </Wrapper>
    </>
  );
}

"use client";
import { Wrapper, Status } from "@googlemaps/react-wrapper";
import { loadAvailableParking } from "./lib/firebase/firebase_modules";
import { IPosition, ParkingData } from "./lib/interfaces";
import { useEffect, useState, useRef } from "react";

import MarkerModal from "./_components/MarkerModal"; // モーダルコンポーネントをインポート

type Props = {
    map: google.maps.Map | null;
    coordinates: ParkingData[];
    onMarkerClick: (data: ParkingData) => void;
};

const MarkerComp: React.FC<Props> = ({ map, coordinates, onMarkerClick }) => {
    const [markers, setMarkers] = useState<google.maps.Marker[]>([]);

    useEffect(() => {
        if (map) {
            const newMarkers = coordinates.map((data) => {
                let color: string;
                if (data.percent > 0.7)
                {
                    color = "red"
                }
                else if (data.percent > 0.3)
                {
                    color = "yellow"
                }
                else{
                    color = "green"
                } // 条件に応じて色を変更
                
                
                const iconUrl = `https://maps.google.com/mapfiles/ms/icons/${color}-dot.png`; // Google MapsのカスタムアイコンURL

                const marker = new google.maps.Marker({
                    position: { lat: data.path.x, lng: data.path.y },
                    map,
                    title: data.name,
                    icon: {
                        url: iconUrl,
                        scaledSize: new google.maps.Size(40, 40), // アイコンのサイズを調整
                    },
                });

                marker.addListener("click", () => {
                    onMarkerClick(data); // マーカークリック時にモーダルを表示する
                });

                return marker;
            });

            setMarkers((prevMarkers) => {
                prevMarkers.forEach((marker) => marker.setMap(null));
                return newMarkers;
            });
        }
    }, [map, coordinates]);

    return null;
};

function MyMap({ coordinates, onMarkerClick }: { coordinates: ParkingData[], onMarkerClick: (data: ParkingData) => void }) {
    const [position, setPosition] = useState<IPosition>({ lat: 0, lng: 0 });
    const [map, setMap] = useState<google.maps.Map | null>(null);
    const ref = useRef<HTMLDivElement>(null);

    const mapOptions: google.maps.MapOptions = {
        center: position,
        zoom: 16,
    };

    useEffect(() => {
        navigator.geolocation.getCurrentPosition((position) => {
            const userPos: IPosition = {
                lat: position.coords.latitude,
                lng: position.coords.longitude,
            };
            setPosition(userPos);
        });
    }, []);

    useEffect(() => {
        if (ref.current) {
            setMap(new window.google.maps.Map(ref.current, mapOptions));
        }
    }, [position]);

    return (
        <div className="g-map" ref={ref} style={{ height: "100%", width: "100%" }}>
            <MarkerComp map={map} coordinates={coordinates} onMarkerClick={onMarkerClick} />
        </div>
    );
}

export default function Home() {
    const googleMapAPI = process.env.NEXT_PUBLIC_GOOGLE_MAP_API as string;
    const [coordinates, setCoordinates] = useState<ParkingData[]>([]);
    const [showModal, setShowModal] = useState<boolean>(false);
    const [selectedMarkerData, setSelectedMarkerData] = useState<ParkingData | null>(null);

    const render = (status: Status) => <h1>{status}</h1>;

    useEffect(() => {
        const loadData = async () => {
            const data = await loadAvailableParking();
            setCoordinates(data);
        };

        loadData();
    }, []);

    const handleMarkerClick = (data: ParkingData) => {
        setSelectedMarkerData(data);
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setSelectedMarkerData(null);
    };

    return (
        <div style={{ width: "100%", height: "92vh" }}>
            <Wrapper apiKey={googleMapAPI} render={render} libraries={["places"]}>
                <MyMap coordinates={coordinates} onMarkerClick={handleMarkerClick} />
            </Wrapper>

            {showModal && selectedMarkerData && (
                <MarkerModal data={selectedMarkerData} onClose={handleCloseModal} />
            )}
        </div>
    );
}



export interface ParkingData
{
    name: string,
    path: {
        x: number,
        y: number
    },
    percent: number
}

export interface IPosition
{
    lat: number;
    lng: number;
}
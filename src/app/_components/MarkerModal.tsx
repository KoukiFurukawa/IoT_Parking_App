// MarkerModal.tsx
import React from 'react';
import { ParkingData } from '../lib/interfaces';

interface MarkerModalProps {
    data: ParkingData;
    onClose: () => void;
}

const MarkerModal: React.FC<MarkerModalProps> = ({ data, onClose }) => {
    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50" >
            <div className="bg-white p-4 rounded-lg shadow-lg">
                <button className="absolute top-0 right-0 m-4" onClick={onClose}>
                    &times;
                </button>
                <h2 className="text-lg font-bold">{data.name}</h2>
                <p className="mt-2">Percent: {data.percent}%</p>
                <p className="mt-2">Location: {data.path.x}, {data.path.y}</p>
            </div>
        </div>
    );
};

export default MarkerModal;
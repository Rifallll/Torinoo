"use client";

import React from 'react';
import { Car, BusFront, TramFront, ParkingSquare, Landmark } from 'lucide-react';

const MapLegend: React.FC = () => {
  return (
    <div className="bg-white dark:bg-gray-800 p-3 rounded-lg shadow-md text-sm space-y-2 border border-gray-200 dark:border-gray-700">
      <h3 className="font-bold text-gray-800 dark:text-gray-100 mb-2">Legenda Peta</h3>

      {/* Traffic Level */}
      <div>
        <p className="font-semibold text-gray-700 dark:text-gray-200 mb-1">Tingkat Lalu Lintas:</p>
        <div className="space-y-1 pl-2">
          <div className="flex items-center">
            <span className="w-4 h-4 rounded-full bg-red-500 mr-2"></span>
            <span className="text-gray-700 dark:text-gray-300">Tinggi (Macet)</span>
          </div>
          <div className="flex items-center">
            <span className="w-4 h-4 rounded-full bg-orange-500 mr-2"></span>
            <span className="text-gray-700 dark:text-gray-300">Sedang</span>
          </div>
          <div className="flex items-center">
            <span className="w-4 h-4 rounded-full bg-green-500 mr-2"></span>
            <span className="text-gray-700 dark:text-gray-300">Rendah (Lancar)</span>
          </div>
        </div>
      </div>

      {/* Feature Types */}
      <div className="pt-2 border-t border-gray-200 dark:border-gray-700">
        <p className="font-semibold text-gray-700 dark:text-gray-200 mb-1">Jenis Fitur:</p>
        <div className="space-y-1 pl-2">
          <div className="flex items-center">
            <div className="w-5 h-5 rounded-full bg-blue-500 flex items-center justify-center text-white text-xs font-bold mr-2">B</div>
            <span className="text-gray-700 dark:text-gray-300">Bus</span>
          </div>
          <div className="flex items-center">
            <div className="w-5 h-5 rounded-full bg-blue-500 flex items-center justify-center text-white text-xs font-bold mr-2">C</div>
            <span className="text-gray-700 dark:text-gray-300">Mobil</span>
          </div>
          <div className="flex items-center">
            <div className="w-5 h-5 rounded-full bg-blue-500 flex items-center justify-center text-white text-xs font-bold mr-2">T</div>
            <span className="text-gray-700 dark:text-gray-300">Tram</span>
          </div>
          <div className="flex items-center">
            <div className="w-5 h-5 rounded-full bg-green-500 flex items-center justify-center text-white text-xs font-bold mr-2">P</div>
            <span className="text-gray-700 dark:text-gray-300">Parkir (Amenity)</span>
          </div>
          <div className="flex items-center">
            <div className="w-5 h-5 rounded-full bg-amber-500 flex items-center justify-center text-white text-xs font-bold mr-2">L</div>
            <span className="text-gray-700 dark:text-gray-300">Landmark (Bangunan)</span>
          </div>
          <div className="flex items-center">
            <div className="w-5 h-5 rounded-full bg-[#007bff] flex items-center justify-center text-white text-xs font-bold mr-2">M</div>
            <span className="text-gray-700 dark:text-gray-300">Stasiun Metro</span>
          </div>
          <div className="flex items-center">
            <div className="w-5 h-5 rounded-full bg-[#4f46e5] flex items-center justify-center text-white text-xs font-bold mr-2">🚌</div>
            <span className="text-gray-700 dark:text-gray-300">Kendaraan Transportasi Publik</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MapLegend;
// src/components/ReportCard.jsx
import React from 'react';
import { Link } from 'react-router-dom';

const statusColors = {
  'Menunggu Verifikasi': 'bg-yellow-100 text-yellow-800',
  'Diproses': 'bg-blue-100 text-blue-800',
  'Selesai': 'bg-green-100 text-green-800'
};

const ReportCard = ({ report }) => (
  <Link to={`/laporan/${report.id}`} className="block group">
    <div className="bg-white rounded-xl shadow-lg overflow-hidden transition-all duration-300 group-hover:shadow-2xl h-full flex flex-col">
      <div className="relative overflow-hidden h-48">
        <img 
          src={report.image_url} 
          alt={report.title} 
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" 
        />
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
          <span className={`text-xs font-semibold px-2 py-1 rounded-full ${statusColors[report.status] || 'bg-gray-100 text-gray-800'}`}>
            {report.status}
          </span>
        </div>
      </div>
      <div className="p-6 flex-grow flex flex-col">
        <h4 className="font-bold text-xl text-gray-800 mb-2 line-clamp-2">{report.title}</h4>
        <div className="flex items-center justify-between mt-auto pt-4 border-t border-gray-100">
          <span className="text-sm text-gray-500">oleh {report.username}</span>
          <span className="text-xs text-gray-400">
            {new Date(report.created_at).toLocaleDateString()}
          </span>
        </div>
      </div>
    </div>
  </Link>
);

export default ReportCard;
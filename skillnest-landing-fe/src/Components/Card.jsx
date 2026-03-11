import React from 'react';
import { Star, Calendar, Users, MapPin, Clock } from 'lucide-react';

export default function Card({
  variant = "default", // "default", "product", "student", "event", "testimonial", "category"
  data,
  onClick,
  className = "",
}) {
  
  // Render different card variants
  const renderCardContent = () => {
    switch (variant) {
      case "category":
        return (
          <>
            <div className="text-indigo-600 mb-3">
              {data.icon}
            </div>
            <h3 className="font-semibold text-gray-900">
              {data.name}
            </h3>
            <p className="text-sm text-gray-500 mt-1">
              {data.count} {data.countLabel || 'items'}
            </p>
          </>
        );

      case "student":
        return (
          <>
            <div className="flex items-center gap-3 mb-4">
              <img 
                src={data.avatar} 
                alt={data.name}
                className="w-12 h-12 rounded-full object-cover"
              />
              <div>
                <h3 className="font-semibold text-gray-900">{data.name}</h3>
                <p className="text-sm text-gray-500">{data.university}</p>
              </div>
            </div>
            
            <div className="mb-3">
              <span className="inline-block px-2 py-1 bg-indigo-50 text-indigo-700 rounded-full text-xs">
                {data.skill}
              </span>
            </div>
            
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-1">
                <Star size={14} className="text-yellow-400 fill-current" />
                <span>{data.rating}</span>
              </div>
              <span className="text-gray-500">{data.projects} proyek</span>
            </div>
            
            {data.price && (
              <div className="mt-3 font-semibold text-indigo-600">
                Rp {data.price}
              </div>
            )}
          </>
        );

      case "product":
        return (
          <>
            <img 
              src={data.image} 
              alt={data.title}
              className="w-full h-40 object-cover rounded-t-lg"
            />
            <div className="mt-3">
              <h3 className="font-semibold text-gray-900 mb-1 line-clamp-2">
                {data.title}
              </h3>
              <p className="text-sm text-gray-500 mb-2">{data.author}</p>
              
              <div className="flex items-center justify-between text-sm mb-2">
                <div className="flex items-center gap-1">
                  <Star size={14} className="text-yellow-400 fill-current" />
                  <span>{data.rating}</span>
                </div>
                <span className="text-gray-500">{data.sold} terjual</span>
              </div>
              
              <div className="font-semibold text-indigo-600">
                {data.price}
              </div>
            </div>
          </>
        );

      case "event":
        return (
          <>
            <div className="flex flex-wrap gap-3 text-indigo-600 text-sm mb-3">
              <div className="flex items-center gap-1">
                <Calendar size={14} />
                <span>{data.date}</span>
              </div>
              <div className="flex items-center gap-1">
                <Clock size={14} />
                <span>{data.time}</span>
              </div>
            </div>
            
            <h3 className="font-semibold text-gray-900 mb-2">
              {data.title}
            </h3>
            
            <p className="text-sm text-gray-600 mb-3 line-clamp-2">
              {data.description}
            </p>
            
            <p className="text-sm text-gray-500 mb-3">
              <span className="font-medium">Pembicara:</span> {data.speakers}
            </p>
            
            {data.location && (
              <div className="flex items-center gap-1 text-sm text-gray-500 mb-3">
                <MapPin size={14} />
                <span>{data.location}</span>
              </div>
            )}
            
            <div className="flex items-center gap-1 text-sm text-gray-500">
              <Users size={14} />
              <span>{data.attendees} akan hadir</span>
            </div>
          </>
        );

      case "testimonial":
        return (
          <>
            <div className="flex items-center gap-3 mb-3">
              <img 
                src={data.avatar} 
                alt={data.name}
                className="w-10 h-10 rounded-full object-cover"
              />
              <div>
                <div className="font-semibold text-gray-900">{data.name}</div>
                <div className="text-xs text-gray-500">{data.role}</div>
              </div>
            </div>
            
            <p className="text-sm text-gray-600">"{data.content}"</p>
          </>
        );

      default:
        return (
          <div>
            <h3 className="font-semibold text-gray-900">{data.title}</h3>
            {data.description && (
              <p className="text-sm text-gray-600 mt-1">{data.description}</p>
            )}
          </div>
        );
    }
  };

  return (
    <div 
      onClick={onClick}
      className={`
        bg-white rounded-lg border border-gray-200 p-4
        ${onClick ? 'cursor-pointer hover:shadow-md' : ''} 
        transition-all duration-200
        ${className}
      `}
    >
      {renderCardContent()}
    </div>
  );
}
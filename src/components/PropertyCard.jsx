import React from 'react';
import { formatCurrency, formatPropertyType, truncateText, extractLinks } from '../utils/formatters';
import { MapPin, Bed, Bath, Home, ExternalLink, Eye } from 'lucide-react';

const PropertyCard = ({ property }) => {
  const {
    'Property Name': name,
    'Description': description,
    'Location': location,
    'Bed rooms': bedrooms,
    'Baths': baths,
    'Home Type': homeType,
    'Price': price,
    'Currency': currency,
    'Status': status,
    'InfinitiView Virtual tour URLs': virtualTour,
    'Website URL': website,
    'Developer Name': developer,
  } = property;

  const hasVirtualTour = virtualTour && virtualTour !== 'N/A';
  const hasWebsite = website && website !== 'N/A';

  return (
    <div className="card hover:shadow-md transition-shadow duration-200">
      {/* Header */}
      <div className="mb-4">
        <div className="flex items-start justify-between mb-2">
          <h3 className="text-lg font-semibold text-gray-900">{name || 'Property Name Not Available'}</h3>
          {status && status !== 'N/A' && (
            <span className={`px-2 py-1 text-xs font-medium rounded-full ${
              status.toLowerCase().includes('available') 
                ? 'bg-green-100 text-green-800' 
                : 'bg-gray-100 text-gray-800'
            }`}>
              {status}
            </span>
          )}
        </div>
        
        {developer && developer !== 'N/A' && (
          <p className="text-sm text-gray-600 mb-2">by {developer}</p>
        )}
      </div>

      {/* Location */}
      {location && location !== 'N/A' && (
        <div className="flex items-center gap-2 mb-3 text-gray-600">
          <MapPin className="w-4 h-4" />
          <span className="text-sm">{location}</span>
        </div>
      )}

      {/* Property Details */}
      <div className="grid grid-cols-3 gap-4 mb-4">
        {bedrooms && bedrooms !== 'N/A' && (
          <div className="flex items-center gap-2 text-gray-600">
            <Bed className="w-4 h-4" />
            <span className="text-sm">{bedrooms} beds</span>
          </div>
        )}
        
        {baths && baths !== 'N/A' && (
          <div className="flex items-center gap-2 text-gray-600">
            <Bath className="w-4 h-4" />
            <span className="text-sm">{baths} baths</span>
          </div>
        )}
        
        {homeType && homeType !== 'N/A' && (
          <div className="flex items-center gap-2 text-gray-600">
            <Home className="w-4 h-4" />
            <span className="text-sm">{formatPropertyType(homeType)}</span>
          </div>
        )}
      </div>

      {/* Price */}
      {price && price !== 'N/A' && (
        <div className="mb-4">
          <p className="text-2xl font-bold text-primary-600">
            {formatCurrency(price, currency)}
          </p>
        </div>
      )}

      {/* Description */}
      {description && description !== 'N/A' && (
        <div className="mb-4">
          <p className="text-gray-700 text-sm leading-relaxed">
            {truncateText(description, 120)}
          </p>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex gap-2">
        {hasVirtualTour && (
          <a
            href={virtualTour}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-primary flex items-center gap-2 text-sm"
          >
            <Eye className="w-4 h-4" />
            Virtual Tour
          </a>
        )}
        
        {hasWebsite && (
          <a
            href={website}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-secondary flex items-center gap-2 text-sm"
          >
            <ExternalLink className="w-4 h-4" />
            Website
          </a>
        )}
      </div>
    </div>
  );
};

export default PropertyCard;

import { Marker } from 'react-map-gl';

const EntryMarker = ({ latitude, longitude, className, color }) => {
  return (
    <div>
      <Marker latitude={latitude} longitude={longitude}>
        <svg
          className={className}
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round">
          <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
          <circle fill={color} cx="12" cy="10" r="3"></circle>
        </svg>
      </Marker>
    </div>
  );
};

export default EntryMarker;

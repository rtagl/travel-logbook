import { Popup } from 'react-map-gl';

const EntryPopup = ({
  latitude,
  longitude,
  closeOnClick,
  onClose,
  children,
}) => {
  return (
    <Popup
      latitude={latitude}
      longitude={longitude}
      closeButton={true}
      closeOnClick={closeOnClick}
      dynamicPosition={true}
      onClose={onClose}
      anchor="top">
      {children}
    </Popup>
  );
};

export default EntryPopup;

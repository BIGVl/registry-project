import { useState } from 'react';
import AddLocation from '../../components/App/AddLocation/AddLocation';
import './NoLocations.css';

const NoLocation = () => {
  const [openAddLocation, setOpenAddLocation] = useState(false);
  return (
    <div className="no-location-page">
      {openAddLocation ? <AddLocation setOpenAddLocation={setOpenAddLocation} /> : ''}
      <h1>Inregistreaza prima ta locatie</h1>
      <button onClick={() => setOpenAddLocation(true)} className="add-first-location">
        Adauga
      </button>
    </div>
  );
};

export default NoLocation;

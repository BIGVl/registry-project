import { doc, setDoc } from 'firebase/firestore';
import { FormEvent, useContext, useState } from 'react';
import { db } from '../../../firebase';
import './AddLocation.css';
import { ReactComponent as Cancel } from '../../../assets/cancel.svg';
import { UserIDContext } from '../../../Contexts';
import { useNavigate } from 'react-router-dom';

type FormData = {
  locationName: string;
  rooms: string;
};

interface Props {
  setOpenAddLocation: (value: boolean) => void;
  setOpenHamburger: (value: boolean) => void;
}

//This adds a new Location to manage in the db
export default function AddLocation({ setOpenAddLocation, setOpenHamburger }: Props) {
  const [formData, setFormData] = useState<FormData>({ locationName: '', rooms: '' });
  const userID = useContext(UserIDContext);
  const navigate = useNavigate();

  const submitLocation = async (e: FormEvent) => {
    e.preventDefault();

    await setDoc(doc(db, `locations${userID}`, formData.locationName), {
      name: formData.locationName,
      rooms: formData.rooms,
      selected: true
    });
    navigate(`/${formData.locationName}`);
    setOpenAddLocation(false);
    setOpenHamburger(false);
  };

  const change = (e: any) => {
    setFormData((prev: any) => {
      return { ...prev, [e.target.name]: e.target.value };
    });
  };

  return (
    <div className="add-location-layout">
      <Cancel
        onClick={() => {
          setOpenAddLocation(false);
        }}
        className="close-add-location"
      />
      <form onSubmit={submitLocation} className="add-location-form" id="add-location-form" action="POST">
        <fieldset className="add-fieldset">
          Adauga o proprietate noua sau schimba numarul de camere al unei proprietati deja existente
        </fieldset>
        <label htmlFor="location-name">
          Numele proprietatii:
          <input type="text" name="locationName" id="locationName" minLength={3} maxLength={36} required onChange={change} />
        </label>
        <label htmlFor="add-rooms" className="add-location-rooms">
          Numar de camere:
          <input type="number" name="rooms" className="add-rooms" id="add-rooms" required min={1} max={50} onChange={change} />
        </label>
        <button className="add-location" type="submit">
          Adauga
        </button>
      </form>
    </div>
  );
}

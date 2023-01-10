import { doc, setDoc } from 'firebase/firestore';
import { FormEvent, useContext, useState } from 'react';
import { db } from '../../firebase';
import './AddLocation.css';
import Cancel from '../../assets/cancel.svg';
import { UserIDContext } from '../../Contexts';

type FormData = {
  locationName: string;
  rooms: string;
};

interface Props {
  setOpenAddLocation: (value: boolean) => void;
}

//This adds a new Location to manage in the db
export default function AddLocation({ setOpenAddLocation }: Props) {
  const [formData, setFormData] = useState<FormData>({ locationName: '', rooms: '' });
  const userID = useContext(UserIDContext);

  const submitLocation = async (e: FormEvent) => {
    e.preventDefault();

    await setDoc(doc(db, `locations${userID}`, formData.locationName), {
      name: formData.locationName,
      rooms: formData.rooms,
      selected: false
    });
    setOpenAddLocation(false);
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
      <form onSubmit={submitLocation} id="add-location-form" action="POST">
        <fieldset>Adauga o proprietate noua sau schimba numarul de camere al unei proprietati deja existente</fieldset>
        <label htmlFor="location-name">
          Numele proprietatii:
          <input type="text" name="locationName" id="locationName" minLength={3} required onChange={change} />
        </label>
        <label htmlFor="rooms">
          Numar de camere:
          <input type="number" name="rooms" id="rooms" required min={1} max={50} onChange={change} />
        </label>
        <button type="submit">Adauga</button>
      </form>
    </div>
  );
}

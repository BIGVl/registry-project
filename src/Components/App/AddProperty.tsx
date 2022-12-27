import { doc, setDoc } from 'firebase/firestore';
import { FormEvent, useState } from 'react';
import { db } from '../../firebase';
import './AddProperty.css';
import { ReactComponent as Cancel } from '../../assets/cancel.svg';

type FormData = {
  propertyName: string;
  rooms: string;
};

interface Props {
  setOpenAddProperty: (value: boolean) => void;
}

//This adds a new property to manage in the db
export default function AddProperty({ setOpenAddProperty }: Props) {
  const [formData, setFormData] = useState<FormData>({ propertyName: '', rooms: '' });

  const submitProperty = async (e: FormEvent) => {
    e.preventDefault();

    await setDoc(doc(db, 'properties', formData.propertyName), {
      name: formData.propertyName,
      rooms: formData.rooms
    });
    setOpenAddProperty(false);
  };

  const change = (e: any) => {
    console.log(formData);
    setFormData((prev: any) => {
      return { ...prev, [e.target.name]: e.target.value };
    });
  };

  return (
    <div className="add-property-layout">
      <Cancel
        onClick={() => {
          setOpenAddProperty(false);
        }}
        className="close-add-property"
      />
      <form onSubmit={submitProperty} id="add-property-form" action="POST">
        <fieldset>Adauga o proprietate noua sau schimba numarul de camere al unei proprietati deja existente</fieldset>
        <label htmlFor="property-name">
          Numele proprietatii:
          <input type="text" name="propertyName" id="propertyName" minLength={3} required onChange={change} />
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

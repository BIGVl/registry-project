import { signOut } from 'firebase/auth';
import { auth, db } from '../../firebase';
import { UserInfo } from '../../globalInterfaces';
import { ReactComponent as Close } from '../../assets/arrow-right.svg';
import './HamburgerMenu.css';
import { doc, DocumentData, updateDoc } from 'firebase/firestore';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface Props {
  setOpenAddLocationForm: (value: boolean) => void;
  userInfo: UserInfo;
  setOpenHamburger: (value: boolean) => void;
  locations: DocumentData[];
}

const HamburgerMenu = ({ setOpenAddLocationForm, userInfo, setOpenHamburger, locations }: Props) => {
  const [openLocationsList, setOpenLocationsList] = useState<boolean>(false);
  const navigate = useNavigate();

  const logOut = async () => {
    try {
      await signOut(auth);
      setOpenHamburger(false);
    } catch (err) {
      console.log(err);
    }
  };

  const openLocation = async (e: any) => {
    await updateDoc(doc(db, `locations${userInfo.uid}`, e.target.id), {
      selected: true
    });

    navigate(`/${e.target.id}`);
  };

  return (
    <section className="hamburger-menu">
      <Close onClick={(e) => setOpenHamburger(false)} />
      <p> {userInfo.name} </p>
      <p> {userInfo.email} </p>
      {openLocationsList && (
        <ul>
          {locations.map((location) => {
            const tag = location.name.charAt(0).toUpperCase() + location.name.slice(1);
            return (
              <li onClick={openLocation} id={location.name}>
                {tag}
              </li>
            );
          })}
        </ul>
      )}
      <button onClick={(e) => setOpenLocationsList(!openLocationsList)} className="open-list-locations">
        Locatii
      </button>

      <button
        className="open-addLocation-button"
        onClick={() => {
          setOpenAddLocationForm(true);
        }}
      >
        Adauga locatie
      </button>

      <button onClick={logOut} className="sign-out">
        Deconecteaza-te
      </button>
    </section>
  );
};

export default HamburgerMenu;

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
    setOpenHamburger(false);
  };

  return (
    <section className="hamburger-menu">
      <div className="hamburger-close">
        <Close className="hamburger-close-svg" onClick={(e) => setOpenHamburger(false)} />
      </div>
      <p className="hamburger-user"> {userInfo.name} </p>
      <p className="hamburger-email"> {userInfo.email} </p>
      {openLocationsList &&
        (locations.length > 0 ? (
          <ul className="locations-list">
            {locations.map((location) => {
              const tag = location.name.charAt(0).toUpperCase() + location.name.slice(1);
              return (
                <li key={location.name} onClick={openLocation} id={location.name}>
                  {tag}
                </li>
              );
            })}
          </ul>
        ) : (
          <div className="no-locations-message"> Nu exista nici o locatie in baza de date. </div>
        ))}
      <button
        onClick={(e) => {
          setOpenLocationsList(!openLocationsList);
        }}
        className="open-list-locations"
      >
        Locatii
      </button>

      <button
        className="open-addLocation-button"
        onClick={() => {
          setOpenAddLocationForm(true);
        }}
      >
        Adauga locatie noua
      </button>

      <button onClick={logOut} className="sign-out">
        Deconecteaza-te
      </button>
    </section>
  );
};

export default HamburgerMenu;

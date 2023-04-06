import { signOut } from 'firebase/auth';
import { auth, db } from '../../firebase';
import { UserInfo } from '../../globalInterfaces';
import { ReactComponent as Close } from '../../assets/arrow-right.svg';
import './HamburgerMenu.scss';
import { doc, DocumentData, updateDoc } from 'firebase/firestore';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import deleteUrl from '../../assets/delete.png';

interface Props {
  setOpenAddLocationForm: (value: boolean) => void;
  userInfo: UserInfo;
  setOpenHamburger: (value: boolean) => void;
  locations: DocumentData[];
}

const HamburgerMenu = ({ setOpenAddLocationForm, userInfo, setOpenHamburger, locations }: Props) => {
  const [openLocationsList, setOpenLocationsList] = useState<boolean>(false);
  const navigate = useNavigate();
  console.log(locations);
  const logOut = async () => {
    try {
      await signOut(auth);
      setOpenHamburger(false);
    } catch (err) {
      console.log(err);
    }
  };

  const openLocation = async (e: any) => {
    console.log(e.target.id);
    await updateDoc(doc(db, `locations${userInfo.uid}`, e.target.id), {
      selected: true
    });
    navigate(`/${e.target.id}`);
    setOpenHamburger(false);
  };

  const deleteLocation = () => {};

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
                  <div className="li-content" id={location.name}>
                    {tag}
                    <img src={deleteUrl} alt="Delete location" className="delete-location" />
                  </div>
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

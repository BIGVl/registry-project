import { signOut } from 'firebase/auth';
import { auth, db } from '../../firebase';
import { UserInfo } from '../../globalInterfaces';
import { ReactComponent as Close } from '../../assets/arrow-right.svg';
import './HamburgerMenu.scss';
import { deleteDoc, doc, DocumentData, updateDoc } from 'firebase/firestore';
import { MouseEventHandler, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import deleteUrl from '../../assets/delete.png';
import AddLocation from './AddLocation';

interface Props {
  userInfo: UserInfo;
  setOpenHamburger: (value: boolean) => void;
  locations: DocumentData[];
}

const HamburgerMenu = ({ userInfo, setOpenHamburger, locations }: Props) => {
  const [openAddLocation, setOpenAddLocation] = useState<boolean>(false);
  const [openLocationsList, setOpenLocationsList] = useState<boolean>(false);
  const [locationToDelete, setLocationToDelete] = useState<string>('');
  const location = useLocation();
  const path =
    location.pathname.indexOf('/', 1) > 0 ? location.pathname.slice(0, location.pathname.indexOf('/', 1)) : location.pathname;

  const navigate = useNavigate();
  const logOut = async () => {
    try {
      await signOut(auth);
      setOpenHamburger(false);
    } catch (err) {
    }
  };

  //Sends the user to the location's url
  const openLocation: MouseEventHandler<HTMLLIElement> = async (e) => {
    if (e.target instanceof HTMLLIElement || e.target instanceof HTMLDivElement) {
      await updateDoc(doc(db, `locations${userInfo.uid}`, e.target.id), {
        selected: true
      });
      navigate(`/${e.target.id}`);
      setOpenHamburger(false);
    }
  };

  //Delete a location completely from the db
  const openDeleteLocation: MouseEventHandler<HTMLImageElement> = (e) => {
    if (e.target instanceof HTMLImageElement) {
      setLocationToDelete(e.target.id);
    }
  };
  const deleteLocation = async () => {
    setLocationToDelete('');
    await deleteDoc(doc(db, `locations${userInfo.uid}`, locationToDelete));
  };

  return (
    <section className="hamburger-menu">
      {openAddLocation ? <AddLocation setOpenAddLocation={setOpenAddLocation} /> : ''}
      <div className="hamburger-close">
        <Close className="hamburger-close-svg" onClick={(e) => setOpenHamburger(false)} />
      </div>
      <section className="user-info">
        <p className="hamburger-user"> Salutari, {userInfo.name} ! </p>
        <p className="hamburger-email"> {userInfo.email} </p>
      </section>
      {openLocationsList &&
        (locations.length > 0 ? (
          <ul className="locations-list">
            {locations.map((location) => {
              const tag = location.name.charAt(0).toUpperCase() + location.name.slice(1);
              return (
                <li key={location.name} onClick={openLocation} id={location.name}>
                  <div className="li-content" id={location.name}>
                    {tag}
                    <img
                      src={deleteUrl}
                      alt="Delete location"
                      className="delete-location-img"
                      id={location.name}
                      onClick={openDeleteLocation}
                    />
                  </div>
                </li>
              );
            })}
          </ul>
        ) : (
          <div className="no-locations-message"> Nu exista nici o locatie in baza de date. </div>
        ))}
      <Link to={`${path}/customer-list`} className="customer-list">
        Lista Clienti
      </Link>
      <section className="locations-section">
        <button
          onClick={(e) => {
            setOpenLocationsList(!openLocationsList);
          }}
          className="open-list-locations"
        >
          Lista locatii
        </button>
        {locationToDelete !== '' && (
          <div className="delete-location-layout">
            <div className="delete-location-modal">
              <div className="message">Esti sigur ca vrei sa stergi locatia {locationToDelete} ?</div>
              <div className="buttons-container">
                <button className="confirm-delete" onClick={deleteLocation}>
                  Confirm
                </button>

                <button className="back" onClick={() => setLocationToDelete('')}>
                  Inapoi
                </button>
              </div>
            </div>
          </div>
        )}

        <button
          className="open-addLocation-button"
          onClick={() => {
            setOpenAddLocation(!openAddLocation);
          }}
        >
          Adauga locatie noua
        </button>
      </section>
      <button onClick={logOut} className="sign-out">
        Deconecteaza-te
      </button>
    </section>
  );
};

export default HamburgerMenu;
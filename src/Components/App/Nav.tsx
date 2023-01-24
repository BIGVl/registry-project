import { Dispatch, MouseEventHandler, SetStateAction, useState } from 'react';
import { Link } from 'react-router-dom';
import AddLocation from './AddLocation';
import HamburgerMenu from './HamburgerMenu';
import { ReactComponent as HamburgerIcon } from '../../assets/menu.svg';
import { doc, DocumentData, updateDoc } from 'firebase/firestore';
import { UserInfo } from '../../globalInterfaces';
import './Nav.css';
import { ReactComponent as Cancel } from '../../assets/cancel.svg';
import { db } from '../../firebase';

interface Props {
  locations: DocumentData[];
  setLocations: Dispatch<SetStateAction<[] | DocumentData[]>>;
  user: UserInfo;
}

const Nav = ({ locations, setLocations, user }: Props) => {
  const [openAddLocationForm, setOpenAddLocationForm] = useState<boolean>(false);
  const [openHamburger, setOpenHamburger] = useState<boolean>(false);

  const removeFromNav = async (e: any) => {
    await updateDoc(doc(db, `locations${user.uid}`, `${e.target.parentNode.id}`), {
      selected: false
    });
  };

  return (
    <>
      {openAddLocationForm ? <AddLocation setOpenAddLocation={setOpenAddLocationForm} /> : ''}

      <nav className="main-nav">
        <div className="nav-locations-container">
          {locations.map((location: DocumentData) => {
            if (location.selected) {
              let tag = location.name.charAt(0).toUpperCase() + location.name.slice(1);
              if (tag.length > 5) tag = tag.slice(0, 5) + '...';

              return (
                <div className="nav-location-bubble" key={location.name}>
                  <Link className="nav-location-link" to={`/${location.name}`}>
                    {tag}
                  </Link>
                  <Cancel className="nav-remove-location" id={location.name} onClick={removeFromNav} />
                </div>
              );
            }
          })}
        </div>
        <HamburgerIcon className="hamburger-icon" onClick={() => setOpenHamburger(!openHamburger)} />
      </nav>
      {openHamburger && (
        <HamburgerMenu
          locations={locations}
          setOpenHamburger={setOpenHamburger}
          userInfo={user}
          setOpenAddLocationForm={setOpenAddLocationForm}
        />
      )}
    </>
  );
};

export default Nav;

import { useState } from 'react';
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
  user: UserInfo;
  locationToFocus: string | undefined;
}

const Nav = ({ locations, user, locationToFocus }: Props) => {
  const [openHamburger, setOpenHamburger] = useState<boolean>(false);
  const [focusedLocation, setFocusedLocation] = useState<string>(locationToFocus ? locationToFocus : '');

  const areAllLocationsUnselected = locations.every((location) => location.selected === false);

  const removeFromNav = async (e: any) => {
    await updateDoc(doc(db, `locations${user.uid}`, `${e.target.parentNode.id}`), {
      selected: false
    });
  };

  return (
    <>
      <nav className="main-nav">
        {!areAllLocationsUnselected && (
          <div className="nav-locations-container">
            {locations.map((location: DocumentData, i) => {
              if (location.selected) {
                let tag = location.name.charAt(0).toUpperCase() + location.name.slice(1);
                if (tag.length > 5) tag = tag.slice(0, 5) + '...';
                return (
                  <div
                    className={`nav-location-bubble ${focusedLocation === location.name ? 'focused' : ''} `}
                    key={location.name}
                    onClick={() => setFocusedLocation(location.name)}
                  >
                    <Link className="nav-location-link" to={`/${location.name}`}>
                      {tag}
                    </Link>
                    <Cancel className="nav-remove-location" id={location.name} onClick={removeFromNav} />
                  </div>
                );
              }
            })}
          </div>
        )}
        <HamburgerIcon className="hamburger-icon" onClick={() => setOpenHamburger(!openHamburger)} />
      </nav>
      {openHamburger && <HamburgerMenu locations={locations} setOpenHamburger={setOpenHamburger} userInfo={user} />}
    </>
  );
};

export default Nav;

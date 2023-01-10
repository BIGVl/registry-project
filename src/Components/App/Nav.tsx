import { Dispatch, SetStateAction, useState } from 'react';
import { Link } from 'react-router-dom';
import AddLocation from './AddLocation';
import HamburgerMenu from './HamburgerMenu';
import { ReactComponent as HamburgerIcon } from '../../assets/menu.svg';
import { DocumentData } from 'firebase/firestore';
import { UserInfo } from '../../globalInterfaces';

interface Props {
  locations: DocumentData[];
  setLocations: Dispatch<SetStateAction<[] | DocumentData[]>>;
  user: UserInfo;
}

const Nav = ({ locations, setLocations, user }: Props) => {
  const [openAddLocationForm, setOpenAddLocationForm] = useState<boolean>(false);
  const [openHamburger, setOpenHamburger] = useState<boolean>(false);

  return (
    <>
      {openAddLocationForm ? <AddLocation setOpenAddLocation={setOpenAddLocationForm} /> : ''}

      <nav className="main-nav">
        {locations.map((location: DocumentData) => {
          if (location.selected) {
            const tag = location.name.charAt(0).toUpperCase() + location.name.slice(1);

            return (
              <Link key={location.name} to={`/${location.name}`}>
                {tag}
              </Link>
            );
          }
        })}

        <HamburgerIcon onClick={() => setOpenHamburger(!openHamburger)} />
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

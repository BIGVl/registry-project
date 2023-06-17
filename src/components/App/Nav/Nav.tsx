import './Nav.scss';
import { Dispatch, SetStateAction } from 'react';
import addImg from '../../../assets/add.png';
import { ReactComponent as HamburgerIcon } from '../../../assets/menu.svg';

interface Props {
  setOpenHamburger: Dispatch<SetStateAction<boolean>>;
  openHamburger: boolean;
  openForm: boolean;
  setOpenForm: Dispatch<SetStateAction<boolean>>;
}

const Nav = ({ setOpenHamburger, openHamburger, openForm, setOpenForm }: Props) => {
  return (
    <nav>
      <button
        className="add-reservation"
        aria-label="Adauga intrare"
        onClick={() => {
          openForm ? setOpenForm(false) : setOpenForm(true);

          window.scrollTo(0, 0);
        }}
      >
        <img src={addImg} alt="" />
      </button>
      <button onClick={() => setOpenHamburger(!openHamburger)} className="hamburger-button">
        <HamburgerIcon className="hamburger-icon" />
      </button>
    </nav>
  );
};

export default Nav;

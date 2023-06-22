import './Nav.scss';
import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import addImg from '../../../assets/add.png';
import { ReactComponent as HamburgerIcon } from '../../../assets/menu.svg';

interface Props {
  setOpenHamburger: Dispatch<SetStateAction<boolean>>;
  openHamburger: boolean;
  openForm: boolean;
  setOpenForm: Dispatch<SetStateAction<boolean>>;
}

const Nav = ({ setOpenHamburger, openHamburger, openForm, setOpenForm }: Props) => {
  const [errorrMessage, setErrorMessage] = useState<string>('');

  useEffect(() => {
    if (!errorrMessage) return;
    const timeout = setTimeout(() => {
      setErrorMessage('');
    }, 2000);

    return () => {
      clearTimeout(timeout);
    };
  }, [errorrMessage]);

  return (
    <div className="add-reservation-hamburger">
      {
        <button
          className="add-reservation"
          aria-label="Adauga intrare"
          onClick={() => {
            setOpenForm(!openForm);
            window.scrollTo(0, 0);
          }}
        >
          <img src={addImg} alt="" />
        </button>
      }
      <button onClick={() => setOpenHamburger(!openHamburger)} className="hamburger-button">
        <HamburgerIcon className="hamburger-icon" />
      </button>
      {errorrMessage && <div className="error-message"> {errorrMessage} </div>}
    </div>
  );
};

export default Nav;

import { signOut } from 'firebase/auth';
import { auth } from '../../firebase';
import { UserInfo } from '../../globalInterfaces';
import { ReactComponent as Close } from '../../assets/arrow-right.svg';
import './HamburgerMenu.css';

interface Props {
  setOpenAddLocationForm: (value: boolean) => void;
  userInfo: UserInfo;
  setOpenHamburger: (value: boolean) => void;
}

const HamburgerMenu = ({ setOpenAddLocationForm, userInfo, setOpenHamburger }: Props) => {
  const logOut = async () => {
    try {
      await signOut(auth);
      setOpenHamburger(false);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <section className="hamburger-menu">
      <Close onClick={(e) => setOpenHamburger(false)} />
      <p> {userInfo.name} </p>
      <p> {userInfo.email} </p>
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

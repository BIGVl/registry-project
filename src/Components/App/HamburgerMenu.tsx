import './HamburgerMenu.css';

interface Props {
  setOpenAddLocationForm: (value: boolean) => void;
}

const HamburgerMenu = ({ setOpenAddLocationForm }: Props) => {
  return (
    <section className="hamburger-menu">
      <button
        className="open-addLocation-button"
        onClick={() => {
          setOpenAddLocationForm(true);
        }}
      >
        Adauga locatie
      </button>

      <button className="sign-out">Deconecteaza-te</button>
    </section>
  );
};

export default HamburgerMenu;

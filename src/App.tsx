import { onAuthStateChanged } from 'firebase/auth';
import { collection, DocumentData, onSnapshot, query } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { Link, Route, Routes, useNavigate } from 'react-router-dom';
import './App.css';
import AddLocation from './Components/App/AddLocation';
import { LocationContext, UserIDContext } from './Contexts';
import { auth, db } from './firebase';
import DashboardPage from './Pages/Dashboard/DasboardPage';
import LoginPage from './Pages/Login/LoginPage';
import TablePage from './Pages/Table/TablePage';
import { ReactComponent as Hamburger } from './assets/menu.svg';
import HamburgerMenu from './Components/App/HamburgerMenu';

interface UserInfo {
  uid: string;
  name: string;
  email: string;
  photoURL: string | null;
}

const App = () => {
  const [locations, setLocations] = useState<DocumentData[] | []>([]);
  const [user, setUser] = useState<UserInfo>({ uid: '' });
  const [openAddLocationForm, setOpenAddLocationForm] = useState<boolean>(false);
  const [openHamburger, setOpenHamburger] = useState<boolean>(false);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubAuth = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser((prev) => {
          return { ...prev, uid: user.uid };
        });
      } else {
        navigate('/login');
      }
    });

    const unsubQuerry = onSnapshot(query(collection(db, `locations${user.uid}`)), (querySnap) => {
      querySnap.forEach((doc) => {
        setLocations((prev): DocumentData[] => {
          return [...prev, doc.data()];
        });
      });
    });

    return () => {
      unsubAuth();
      unsubQuerry();
    };
  }, [user.uid]);

  return (
    <UserIDContext.Provider value={user.uid}>
      <div className="App">
        {openAddLocationForm ? <AddLocation setOpenAddLocation={setOpenAddLocationForm} /> : ''}
        <Routes>
          <Route path="/" element={<DashboardPage />} />
          <Route path="/login" element={<LoginPage />} />
          {locations.map((location) => {
            return (
              <Route
                key={location.name}
                path={location.name}
                element={
                  <LocationContext.Provider value={location.name}>
                    <TablePage rooms={location.rooms} />
                  </LocationContext.Provider>
                }
              />
            );
          })}
          '
        </Routes>
        <nav className="main-nav">
          {locations.map((location: DocumentData) => {
            const tag = location.name.charAt(0).toUpperCase() + location.name.slice(1);
            return (
              <Link key={location.name} to={`/${location.name}`}>
                {tag}
              </Link>
            );
          })}
          <Hamburger onClick={() => setOpenHamburger(!openHamburger)} />
        </nav>
        {openHamburger && <HamburgerMenu setOpenAddLocationForm={setOpenAddLocationForm} />}
      </div>
    </UserIDContext.Provider>
  );
};

export default App;

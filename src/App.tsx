import { onAuthStateChanged } from 'firebase/auth';
import { collection, DocumentData, onSnapshot, query } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { Link, Route, Routes, useNavigate } from 'react-router-dom';
import './App.css';
import AddProperty from './Components/App/AddProperty';
import { PropertyContext, UserIDContext } from './Contexts';
import { auth, db } from './firebase';
import DashboardPage from './Pages/Dashboard/DasboardPage';
import LoginPage from './Pages/Login/LoginPage';
import TablePage from './Pages/Table/TablePage';

interface UserInfo {
  uid: string;
}

const App = () => {
  const [properties, setProperties] = useState<DocumentData[] | []>([]);
  const [openAddPropertyForm, setOpenAddPropertyForm] = useState(false);
  const [user, setUser] = useState<UserInfo>({} as UserInfo);
  const navigate = useNavigate();

  onAuthStateChanged(auth, (user) => {
    if (user) {
      setUser((prev) => {
        return { ...prev, uid: user.uid };
      });
    } else {
    }
  });

  function getProperties() {
    setProperties([]);
    const unsub = onSnapshot(query(collection(db, 'properties')), (querySnap) => {
      querySnap.forEach((doc) => {
        setProperties((prev): DocumentData[] => {
          return [...prev, doc.data()];
        });
      });
    });
  }

  //TODO Comment this out when in production (it won't break anything but is not necessary)
  /*This is used only in development to make useEffect run just once, so we could get the data from the firestore just once
  to avoid useless warnings and duplicates
  */
  let didEffectRun = false;

  useEffect(() => {
    if (didEffectRun) return;
    getProperties();
    didEffectRun = true;
  }, []);

  function openModal() {
    setOpenAddPropertyForm(true);
  }

  return (
    <>
      <UserIDContext.Provider value={user.uid}>
        {openAddPropertyForm ? <AddProperty setOpenAddProperty={setOpenAddPropertyForm} /> : ''}
        <Routes>
          <Route path="/" element={<DashboardPage />} />
          <Route path="/login" element={<LoginPage />} />
          {properties.map((property) => {
            return (
              <Route
                key={property.name}
                path={property.name}
                element={
                  <PropertyContext.Provider value={property.name}>
                    <TablePage rooms={property.rooms} />
                  </PropertyContext.Provider>
                }
              />
            );
          })}
          '
        </Routes>
        <nav className="main-nav">
          {properties.map((property) => {
            const tag = property.name.charAt(0).toUpperCase() + property.name.slice(1);
            return (
              <Link key={property.name} to={`/${property.name}`}>
                {' '}
                {tag}{' '}
              </Link>
            );
          })}
          <button onClick={openModal}>Adauga proprietate</button>
        </nav>
      </UserIDContext.Provider>
    </>
  );
};

export default App;

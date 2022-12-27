import { collection, DocumentData, onSnapshot, query } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { Link, Route, Routes } from 'react-router-dom';
import './App.css';
import AddProperty from './Components/App/AddProperty';
import PropertyContext from './Contexts/PopertyContext';
import { db } from './firebase';
import RegisterPage from './Pages/Register/RegisterPage';
import TablePage from './Pages/Table/TablePage';

const App = () => {
  const [properties, setProperties] = useState<DocumentData[] | []>([]);
  const [openAddProperty, setOpenAddProperty] = useState(false);

  function getProperties() {
    setProperties([]);
    console.log(properties);
    const unsub = onSnapshot(query(collection(db, 'properties')), (querySnap) => {
      querySnap.forEach((doc) => {
        setProperties((prev): DocumentData[] => {
          return [...prev, doc.data()];
        });
      });
    });
  }

  //TODO Comment this out when in production
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
    setOpenAddProperty(true);
  }

  return (
    <div className="App">
      {openAddProperty ? <AddProperty setOpenAddProperty={setOpenAddProperty} /> : ''}
      <Routes>
        {properties.map((property) => {
          return (
            <Route
              key={property.name}
              path={property.name}
              element={
                <PropertyContext.Provider value={property.name}>
                  <TablePage rooms={property.rooms} />
                  <RegisterPage />
                </PropertyContext.Provider>
              }
            />
          );
        })}
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
    </div>
  );
};

export default App;

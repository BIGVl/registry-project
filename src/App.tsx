import { collection, getDocs } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import './App.css';
import AddProperty from './Components/App/AddProperty';
import PropertyContext from './Contexts/PopertyContext';
import { db } from './firebase';
import RegisterPage from './Pages/Register/RegisterPage';
import TablePage from './Pages/Table/TablePage';

interface Properties {
  name: string;
  rooms: string;
}

const App = () => {
  const property = 'sura';
  const [properties, setProperties] = useState<Properties[] | []>([]);
  const [openAddProperty, setOpenAddProperty] = useState(false);

  async function getProperties() {
    const querySnapshot = await getDocs(collection(db, 'properties'));
    querySnapshot.forEach((doc) => {
      setProperties((prev: Properties[] | any) => {
        return [...prev, doc.data()];
      });
    });
  }

  useEffect(() => {
    getProperties();
  });

  function openModal() {
    setOpenAddProperty(true);
  }

  return (
    <>
      {openAddProperty ? <AddProperty setOpenAddProperty={setOpenAddProperty} /> : ''}
      <aside>
        <nav></nav>
        <button>Adauga proprietate</button>
      </aside>
      <main className="App">
        <PropertyContext.Provider value={property}>
          <TablePage rooms={10} />
          <RegisterPage />
        </PropertyContext.Provider>
      </main>
    </>
  );
};

export default App;

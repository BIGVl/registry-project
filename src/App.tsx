import { onAuthStateChanged } from 'firebase/auth';
import { useEffect, useState } from 'react';
import { Route, Routes, useNavigate } from 'react-router-dom';
import './App.css';
import { LocationContext, UserIDContext } from './Contexts';
import { auth, db } from './firebase';
import LoginPage from './Pages/Login/LoginPage';
import TablePage from './Pages/Table/TablePage';
import { UserInfo } from './globalInterfaces';
import { collection, DocumentData, onSnapshot, query } from 'firebase/firestore';
import Nav from './Components/App/Nav';

const App = () => {
  const [locations, setLocations] = useState<DocumentData[] | []>([]);
  const [userInfo, setUserInfo] = useState<UserInfo>({ uid: '', name: '', email: '', photoURL: '' });
  const navigate = useNavigate();

  useEffect(() => {
    const unsubAuth = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUserInfo((prev) => {
          return { ...prev, uid: user.uid, name: user.displayName, email: user.email, photoURL: user.photoURL };
        });
      } else {
        setUserInfo({ uid: '', name: '', email: '', photoURL: '' });
        navigate('/login');
      }
    });
    const unsubQuerry = onSnapshot(query(collection(db, `locations${userInfo.uid}`)), (querySnap) => {
      setLocations([]);

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
  }, [userInfo.uid]);

  return (
    <UserIDContext.Provider value={userInfo.uid}>
      <div className="App">
        <Routes>
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
      </div>
      {userInfo.uid && <Nav user={userInfo} locations={locations} setLocations={setLocations} />}
    </UserIDContext.Provider>
  );
};

export default App;
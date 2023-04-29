import { onAuthStateChanged } from 'firebase/auth';
import { useEffect, useState } from 'react';
import { Route, Routes, useNavigate } from 'react-router-dom';
import { LocationContext, UserIDContext } from './Contexts';
import { auth, db } from './firebase';
import LoginPage from './Pages/Login/LoginPage';
import TablePage from './Pages/Table/TablePage';
import { UserInfo } from './globalInterfaces';
import { collection, DocumentData, onSnapshot, query } from 'firebase/firestore';
import Nav from './Components/App/Nav';
import NoLocation from './Pages/NoLocations/NoLocations';

const App = () => {
  const [locations, setLocations] = useState<DocumentData[] | []>([]);
  const [userInfo, setUserInfo] = useState<UserInfo>({ uid: '', name: '', email: '', photoURL: '' });
  const navigate = useNavigate();

  //Subscribing to firebase for authentication changes and for locations
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

  //Check if there are any locations and if not redirect the user to the first-location screen
  useEffect(() => {
    if (userInfo.uid) {
      if (locations.length === 0) {
        navigate('/first-location');
      } else if (locations[0]) {
        //TODO Uncomment the navigate after you are done testing loading screen and remove the Route to test
        navigate(`/${locations[0].name}`);
      }
    }
  }, [locations]);

  return (
    <UserIDContext.Provider value={userInfo.uid}>
      <main className="App">
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/first-location" element={<NoLocation />} />
          {locations.map((location) => {
            return (
              <Route
                key={location.name}
                path={location.name}
                element={
                  <LocationContext.Provider value={location.name}>
                    <TablePage rooms={Number(location.rooms)} />
                  </LocationContext.Provider>
                }
              />
            );
          })}
          '
        </Routes>
      </main>

      {userInfo.uid && locations[0]?.name && <Nav user={userInfo} locations={locations} locationToFocus={locations[0].name} />}
    </UserIDContext.Provider>
  );
};

export default App;

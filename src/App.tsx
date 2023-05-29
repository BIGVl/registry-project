import { onAuthStateChanged } from 'firebase/auth';
import { useEffect, useState } from 'react';
import { Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import { LocationContext, UserIDContext } from './Contexts';
import { auth, db } from './firebase';
import LoginPage from './Pages/Login/LoginPage';
import TablePage from './Pages/Table/TablePage';
import { UserInfo } from './globalInterfaces';
import { collection, DocumentData, onSnapshot, query } from 'firebase/firestore';
import Nav from './components/App/Nav';
import NoLocation from './Pages/NoLocations/NoLocations';
import LoadingScreen from './components/LoadingScreen/LoadingScreen';
import CustomersList from './Pages/CustomersList/CustomersList';

const App = () => {
  const [locations, setLocations] = useState<DocumentData[] | []>([]);
  const [userInfo, setUserInfo] = useState<UserInfo>({ uid: '', name: '', email: '', photoURL: '' });
  const location = useLocation();
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
    const indexLocation = locations.find((location) => {
      return location.selected === true;
    });
    if (location.pathname === '/' && userInfo.uid) {
      if (locations.length === 0) {
        navigate('first-location');
      } else if (indexLocation !== undefined) {
        navigate(`${indexLocation.name}`);
      } else {
        navigate(`${locations[0].name}`);
      }
    }
  }, [locations]);

  return (
    <UserIDContext.Provider value={userInfo.uid}>
      <main className="App">
        <Routes>
          <Route path="/" element={<LoadingScreen />} />
          <Route path="login" element={<LoginPage />} />
          <Route path="first-location" element={<NoLocation />} />
          {locations.map((location) => {
            return (
              <>
                <Route
                  path={location.name}
                  element={
                    <LocationContext.Provider key={location.name} value={location.name}>
                      <TablePage rooms={Number(location.rooms)} />
                    </LocationContext.Provider>
                  }
                />
                <Route
                  path={`${location.name}/customer-list`}
                  element={
                    <LocationContext.Provider key={location.name} value={location.name}>
                      <CustomersList rooms={Number(location.rooms)} />
                    </LocationContext.Provider>
                  }
                />
              </>
            );
          })}
        </Routes>
      </main>

      {userInfo.uid && locations[0]?.name && <Nav user={userInfo} locations={locations} locationToFocus={locations[0].name} />}
    </UserIDContext.Provider>
  );
};

export default App;

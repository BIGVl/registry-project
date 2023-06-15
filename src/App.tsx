import { onAuthStateChanged } from 'firebase/auth';
import { useEffect, useState } from 'react';
import { Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import { LocationContext, UserIDContext } from './Contexts';
import { auth, db } from './firebase';
import LoginPage from './Pages/Login/LoginPage';
import TablePage from './Pages/Table/TablePage';
import { UserInfo } from './globalInterfaces';
import { collection, DocumentData, onSnapshot, query } from 'firebase/firestore';
import NoLocation from './Pages/NoLocations/NoLocations';
import LoadingScreen from './components/LoadingScreen/LoadingScreen';
import CustomersList from './Pages/CustomersList/CustomersList';
import { ReactComponent as HamburgerIcon } from './assets/menu.svg';
import HamburgerMenu from './components/App/HamburgerMenu/HamburgerMenu';

const App = () => {
  const [locations, setLocations] = useState<DocumentData[] | []>([]);
  const [userInfo, setUserInfo] = useState<UserInfo>({ uid: '', name: '', email: '', photoURL: '' });
  const [openHamburger, setOpenHamburger] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
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
    setIsLoading(false);

    return () => {
      unsubAuth();
      unsubQuerry();
    };
  }, [userInfo.uid]);

  //Check if there are any locations and if not redirect the user to the first-location screen
  useEffect(() => {
    const path = locations.length > 0 ? locations.find((loc) => location.pathname.includes(loc?.name)) : true;
    if (userInfo.uid && !isLoading && !path) {
      console.log('I do navigate');
      navigate(`${locations[0].name}`);
    }
  }, [locations, userInfo.uid, isLoading]);

  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <UserIDContext.Provider value={userInfo.uid}>
      <main className="App">
        {userInfo.uid && locations[0]?.name && (
          <button onClick={() => setOpenHamburger(!openHamburger)} className="hamburger-button">
            <HamburgerIcon className="hamburger-icon" />
          </button>
        )}
        <Routes>
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
        {openHamburger && <HamburgerMenu userInfo={userInfo} setOpenHamburger={setOpenHamburger} locations={locations} />}
      </main>
    </UserIDContext.Provider>
  );
};

export default App;

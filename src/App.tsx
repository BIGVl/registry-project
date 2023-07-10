import { onAuthStateChanged } from 'firebase/auth';
import { useEffect, useState } from 'react';
import { Navigate, Route, Routes, useNavigate } from 'react-router-dom';
import { LocationContext, UserIDContext } from './Contexts';
import { auth, db } from './firebase';
import LoginPage from './Pages/Login/LoginPage';
import TablePage from './Pages/Table/TablePage';
import { UserInfo } from './globalInterfaces';
import { collection, DocumentData, onSnapshot, query } from 'firebase/firestore';
import NoLocation from './Pages/NoLocations/NoLocations';
import LoadingScreen from './components/LoadingScreen/LoadingScreen';
import CustomersList from './Pages/CustomersList/CustomersList';
import HamburgerMenu from './components/App/HamburgerMenu/HamburgerMenu';
import Nav from './components/App/Nav/Nav';
import ReservationForm from './components/App/ReservationForm/ReservationForm';

const App = () => {
  const [locations, setLocations] = useState<DocumentData[] | []>([]);
  const [userInfo, setUserInfo] = useState<UserInfo | null>({ uid: '', name: '', email: '', photoURL: '' });
  const [openHamburger, setOpenHamburger] = useState<boolean>(false);
  const [openForm, setOpenForm] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const navigate = useNavigate();

  //Subscribing to firebase for authentication changes and for locations
  useEffect(() => {
    const unsubAuth = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUserInfo((prev) => {
          return { ...prev, uid: user.uid, name: user.displayName, email: user.email, photoURL: user.photoURL };
        });
      } else {
        setLocations([]);
        setUserInfo(null);
        navigate('`/login`');
      }
    });

    const unsubSnap = onSnapshot(query(collection(db, `locations${userInfo?.uid}`)), (querySnap) => {
      setLocations([]);
      querySnap.forEach((doc) => {
        setLocations((prev): DocumentData[] => {
          return [...prev, doc.data()];
        });

        locations[0] && navigate(`${locations[0].name}`);

        console.log(locations);
      });
    });

    const timerId = setTimeout(() => {
      setIsLoading(false);
    }, 800);

    return () => {
      unsubAuth();
      unsubSnap();
      clearTimeout(timerId);
    };
  }, [userInfo?.uid]);

  if (isLoading) {
    return <LoadingScreen />;
  }
  return (
    <UserIDContext.Provider value={userInfo ? userInfo.uid : null}>
      <main className="App">
        <Routes>
          <Route
            path="/"
            element={
              userInfo !== null ? (
                locations[0] && locations[0].name ? (
                  <Navigate to={`/${locations[0].name}`} replace />
                ) : (
                  <NoLocation />
                )
              ) : (
                <Navigate to="/login" replace />
              )
            }
          />
          <Route path="login" element={<LoginPage />} />
          {locations.map((location) => {
            return (
              <>
                <Route
                  path={`/${location.name}`}
                  element={
                    <LocationContext.Provider key={location.name} value={location.name}>
                      <Nav
                        setOpenHamburger={setOpenHamburger}
                        openHamburger={openHamburger}
                        openForm={openForm}
                        setOpenForm={setOpenForm}
                      />
                      <TablePage rooms={Number(location.rooms)} />
                      {openForm === true ? <ReservationForm rooms={location.rooms} setOpenForm={setOpenForm} /> : ''}
                    </LocationContext.Provider>
                  }
                />
                <Route
                  path={`${location.name}/customer-list`}
                  element={
                    <LocationContext.Provider key={location.name} value={location.name}>
                      <Nav
                        setOpenHamburger={setOpenHamburger}
                        openHamburger={openHamburger}
                        openForm={openForm}
                        setOpenForm={setOpenForm}
                      />
                      <CustomersList rooms={Number(location.rooms)} />
                    </LocationContext.Provider>
                  }
                />
              </>
            );
          })}
          <Route
            path="*"
            element={
              userInfo !== null ? (
                locations[0] && locations[0].name ? (
                  <Navigate to={`/${locations[0].name}`} replace />
                ) : (
                  <NoLocation />
                )
              ) : (
                <Navigate to="/login" replace />
              )
            }
          />
        </Routes>
        {openHamburger && <HamburgerMenu userInfo={userInfo} setOpenHamburger={setOpenHamburger} locations={locations} />}
      </main>
    </UserIDContext.Provider>
  );
};

export default App;

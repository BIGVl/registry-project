import { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import CreateUser from '../../Components/LoginPage/CreateUser';
import Login from '../../Components/LoginPage/Login';
import { UserIDContext } from '../../Contexts';
import './LoginPage.css';

const LoginPage = () => {
  const [hasAccount, setHasAccount] = useState<boolean>(true);
  const userID = useContext(UserIDContext);
  const navigate = useNavigate();

  useEffect(() => {
    userID && navigate('/');
  }, [userID]);

  return (
    <div className="login-page">
      <h2>Unealta ideala pentru ati gestiona cazarile.</h2>
      <div className="buttons-form-container">
        <div className="login-button-container">
          <button className="open-create-user" onClick={() => setHasAccount(false)}>
            Creeaza cont
          </button>
          <button className="open-login" onClick={() => setHasAccount(true)}>
            Intra in cont
          </button>
        </div>
        {hasAccount ? <Login /> : <CreateUser />}
      </div>
    </div>
  );
};

export default LoginPage;

import { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import CreateUser from '../../Components/LoginPage/CreateUserF';
import Login from '../../Components/LoginPage/Login';
import { UserIDContext } from '../../Contexts';
import './LoginPage.css';

const LoginPage = () => {
  const [hasAccount, setHasAccount] = useState<boolean>(false);
  const userID = useContext(UserIDContext);
  const navigate = useNavigate();

  useEffect(() => {
    userID && navigate('/');
  }, []);

  return (
    <div className="login-page">
      <h2>Unealta ideala pentru ati gestiona cazarile.</h2>
      <div className="open-forms-container">
        <button className="open-create-user" onClick={() => setHasAccount(false)}>
          Creeaza coont
        </button>
        <button className="open-login" onClick={() => setHasAccount(true)}>
          Intra in cont
        </button>
      </div>
      {hasAccount ? <Login /> : <CreateUser />}
    </div>
  );
};

export default LoginPage;

import { signInWithEmailAndPassword } from 'firebase/auth';
import { ChangeEvent, FormEvent, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth } from '../../firebase';

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [loginSuccess, setLoginSucess] = useState<boolean>(false);
  const navigate = useNavigate();

  //Update the state that hold the info for creating the account

  const update = (e: ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => {
      return { ...prev, [e.target.name]: e.target.value };
    });

    console.log(formData);
  };

  const signIn = async (e: FormEvent) => {
    e.preventDefault();
    try {
      const userCred = await signInWithEmailAndPassword(auth, formData.email, formData.password);
      const user = userCred.user;
      if (user) {
        navigate('/');
        setLoginSucess(true);
      }
    } catch (err) {
      const error = (err as { code: string }).code;

      switch (error) {
        case 'auth/invalid-email':
          return setErrorMessage('Emailul sau parola sunt invalide.');
        case 'auth/user-disabled':
          return setErrorMessage('Utilizatorul a fost dezactivat, pentru detalii contactati-ne prim mail la vlasq91@gmail.com');
        case 'auth/user-not-found':
          return setErrorMessage(
            'Acest email nu este asociat cu nici un cont. Daca nu aveti cont va puteti creea unul apasand pe "Creeaza cont".'
          );
        case 'auth/wrong-password':
          return setErrorMessage('Emailul sau/si parola sunt invalide.');
      }
    }
  };

  return (
    <div className="login-container">
      <form action="" className="login-form" noValidate onSubmit={signIn}>
        <label htmlFor="email">
          Email
          <input type="email" name="email" id="email" onChange={update} />
        </label>
        <label htmlFor="password">
          Password
          <input type="password" name="password" id="password" onChange={update} />
        </label>
        {errorMessage !== '' && <div className="error-message"> {errorMessage} </div>}
        <button type="submit">Login</button>
      </form>
    </div>
  );
};

export default Login;

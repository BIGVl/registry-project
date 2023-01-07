import { createUserWithEmailAndPassword } from 'firebase/auth';
import { ChangeEvent, FormEvent, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth } from '../../firebase';

interface FormData {
  fullName: string;
  email: string;
  password: string;
}

const CreateUser = () => {
  const [formData, setFormData] = useState<FormData>({} as FormData);
  const [confirmPass, setConfirmPass] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string>('');

  const navigate = useNavigate();

  const submitCreateUser = async (e: FormEvent) => {
    e.preventDefault();

    const { fullName, email, password } = formData;
    if (password !== confirmPass) return setErrorMessage('Parolele nu se potrivesc.');
    if (fullName.length < 3) return setErrorMessage('Numele trebuie sa aiba cel putin trei litere.');
    if (!email.includes('@')) return setErrorMessage('Emailul trebuie sa fie valid.');

    try {
      const userRef = await createUserWithEmailAndPassword(auth, formData.email, formData.password);
      const user = userRef.user;
      user && navigate('/');
    } catch (e) {
      const error = e as { code: string };
      switch (error.code) {
        case 'auth/email-already-in-use':
          return setErrorMessage('Emailul este deja folosit.');

        case 'auth/invalid-email':
          return setErrorMessage('Email invalid.');

        case 'auth/weak-password':
          return setErrorMessage('Parola trebuie sa aiba cel putin 6 caractere.');
      }
    }
  };
  //Update the state that hold the info for creating the account
  const update = (e: ChangeEvent<HTMLInputElement>) => {
    setFormData((prev: FormData) => {
      return { ...prev, [e.target.name]: e.target.value };
    });
    console.log(formData);
  };

  return (
    <form className="create-acc-form" action="" noValidate onSubmit={submitCreateUser}>
      <label htmlFor="full-name">
        Nume si prenume
        <input type="text" name="fullName" id="full-name" onChange={update} required />
      </label>
      <label htmlFor="email">
        Email
        <input type="email" name="email" id="email" onChange={update} required />
      </label>
      <label htmlFor="password">
        Parola
        <input type="password" name="password" id="password" onChange={update} required />
      </label>
      <label htmlFor="confirm-password">
        Confirma parola
        <input
          type="password"
          name="confirm-password"
          id="confirm-password"
          onChange={(e) => {
            setConfirmPass(e.target.value);
          }}
        />
      </label>
      {errorMessage !== '' && <div className="error-message"> {errorMessage} </div>}
      <button type="submit" aria-label="confirm creating account">
        Creeaza cont
      </button>
    </form>
  );
};

export default CreateUser;

import { FC, SyntheticEvent, useState } from 'react';
import { RegisterUI } from '@ui-pages';
import { useDispatch, useSelector } from '../../services/store';
import { TRegisterData } from '@api';
import { registerUser, getError } from '../../services/slices/user';

export const Register: FC = () => {
  const dispatch = useDispatch();
  const errorMessage = useSelector(getError);
  const [userName, setUserName] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [userPassword, setUserPassword] = useState('');

  const handleSubmit = (e: SyntheticEvent) => {
    e.preventDefault();
    const userData: TRegisterData = {
      name: userName,
      email: userEmail,
      password: userPassword
    };
    dispatch(registerUser(userData));
  };

  return (
    <RegisterUI
      errorText={errorMessage}
      email={userEmail}
      userName={userName}
      password={userPassword}
      setEmail={setUserEmail}
      setPassword={setUserPassword}
      setUserName={setUserName}
      handleSubmit={handleSubmit}
    />
  );
};

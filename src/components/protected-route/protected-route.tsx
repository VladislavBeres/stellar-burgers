import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useSelector } from '../../services/store/store';
import {
  isAuthCheckedSelector,
  getUser
} from '../../services/slices/user/user';
import { Preloader } from '../../components/ui';

type ProtectedRouteProps = {
  unAuth?: boolean;
  children: React.ReactElement;
};

export const ProtectedRoute = ({
  unAuth = false,
  children
}: ProtectedRouteProps) => {
  const isAuthChecked = useSelector(isAuthCheckedSelector);
  const user = useSelector(getUser);
  const isLoading = useSelector((state) => state.user.isLoading);
  const location = useLocation();

  if (isLoading) {
    return <Preloader />;
  }

  if (!unAuth && !isAuthChecked) {
    return <Navigate replace to='/login' state={{ from: location }} />;
  }

  if (unAuth && isAuthChecked) {
    const fromPage = location.state?.from || { pathname: '/' };
    return <Navigate replace to={fromPage} />;
  }

  return children;
};

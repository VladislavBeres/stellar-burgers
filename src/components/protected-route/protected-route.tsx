import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useSelector } from '../../services/store';
import { isAuchCheckedSelector } from '../../services/slices/user';

type ProtectedRouteProps = {
  unAuth?: boolean;
  children: React.ReactElement;
};

export const ProtectedRoute = ({
  unAuth = false,
  children
}: ProtectedRouteProps) => {
  const isAuchChecked = useSelector(isAuchCheckedSelector);
  const location = useLocation();

  if (!unAuth && !isAuchChecked) {
    return <Navigate replace to='/login' state={{ from: location }} />;
  }

  if (unAuth && isAuchChecked) {
    const fromPage = location.state?.from || { pathname: '/' };
    return <Navigate replace to={fromPage} />;
  }

  return children;
};

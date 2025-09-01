import { ProfileOrdersUI } from '@ui-pages';
import { TOrder } from '@utils-types';
import { FC, useEffect } from 'react';
import { useDispatch, useSelector } from '../../services/store';
import {
  getUserOrders,
  userOrdersList
} from '../../services/slices/userOrders';

export const ProfileOrders: FC = () => {
  /** TODO: взять переменную из стора */
  const orders: TOrder[] = useSelector(userOrdersList);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getUserOrders());
  }, []);

  return <ProfileOrdersUI orders={orders} />;
};

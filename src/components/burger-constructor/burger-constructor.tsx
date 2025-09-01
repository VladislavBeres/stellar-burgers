import { FC, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { TConstructorIngredient } from '@utils-types';
import { BurgerConstructorUI } from '@ui';

import { useDispatch, useSelector } from '../../services/store';

import { isAuchCheckedSelector } from '../../services/slices/user';
import { clearAll, selectItems } from '../../services/slices/constructor';
import {
  createOrder,
  getOrderModalData,
  getOrderRequest,
  resetOrder
} from '../../services/slices/newOrder';

export const BurgerConstructor: FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const constructorItems = useSelector(selectItems);
  const orderRequest = useSelector(getOrderRequest);
  const orderModalData = useSelector(getOrderModalData);
  const isAuth = useSelector(isAuchCheckedSelector);

  useEffect(() => {
    if (orderModalData) {
      dispatch(clearAll());
    }
  }, [orderModalData]);

  const onOrderClick = () => {
    if (!isAuth) return navigate('/login');
    if (!constructorItems.bun || orderRequest) return;
    const orderData = [
      constructorItems.bun._id,
      constructorItems.bun._id,
      ...constructorItems.ingredients.map((ingredient) => ingredient._id)
    ];
    dispatch(createOrder(orderData));
  };

  const closeOrderModal = () => {
    dispatch(resetOrder());
    navigate('/');
  };

  const price = useMemo(
    () =>
      (constructorItems.bun ? constructorItems.bun.price * 2 : 0) +
      constructorItems.ingredients.reduce(
        (s: number, v: TConstructorIngredient) => s + v.price,
        0
      ),
    [constructorItems]
  );

  return (
    <BurgerConstructorUI
      price={price}
      orderRequest={orderRequest}
      constructorItems={constructorItems}
      orderModalData={orderModalData}
      onOrderClick={onOrderClick}
      closeOrderModal={closeOrderModal}
    />
  );
};

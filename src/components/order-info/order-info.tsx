import { FC, useEffect, useMemo } from 'react';
import { Preloader } from '../ui/preloader';
import { OrderInfoUI } from '../ui/order-info';
import { TIngredient, TOrder } from '@utils-types';
import { useDispatch, useSelector } from '../../services/store';
import { getIngredients } from '../../services/slices/ingredients';
import { getOrdersFeeds } from '../../services/slices/feed';
import {
  userOrdersList,
  userOrdersByNumber,
  getUserOrderByNumber
} from '../../services/slices/userOrders';
import { useParams } from 'react-router-dom';

type TOrderInfo = {
  showHeader: boolean;
};

export const OrderInfo: FC<TOrderInfo> = ({ showHeader }) => {
  const dispatch = useDispatch();

  const orderNumber = Number(useParams().number);

  const feedOrders = useSelector(getOrdersFeeds);
  const userOrders = useSelector(userOrdersList);
  const userOrderByNumber = useSelector(userOrdersByNumber);

  const orders: TOrder[] = feedOrders.concat(userOrders, userOrderByNumber);

  const orderData = orders.find((item) => item.number === orderNumber);

  useEffect(() => {
    if (!orderData) {
      dispatch(getUserOrderByNumber(orderNumber));
    }
  }, []);

  const ingredients: TIngredient[] = useSelector(getIngredients);

  /* Готовим данные для отображения */
  const orderInfo = useMemo(() => {
    if (!orderData || !ingredients.length) return null;

    const date = new Date(orderData.createdAt);

    type TIngredientsWithCount = {
      [key: string]: TIngredient & { count: number };
    };

    const ingredientsInfo = orderData.ingredients.reduce(
      (acc: TIngredientsWithCount, item) => {
        if (!acc[item]) {
          const ingredient = ingredients.find((ing) => ing._id === item);
          if (ingredient) {
            acc[item] = {
              ...ingredient,
              count: 1
            };
          }
        } else {
          acc[item].count++;
        }

        return acc;
      },
      {}
    );

    const total = Object.values(ingredientsInfo).reduce(
      (acc, item) => acc + item.price * item.count,
      0
    );

    return {
      ...orderData,
      ingredientsInfo,
      date,
      total
    };
  }, [orderData, ingredients]);

  if (!orderInfo) {
    return <Preloader />;
  }

  return <OrderInfoUI orderInfo={orderInfo} showHeader={showHeader} />;
};

import { Preloader } from '@ui';
import { FeedUI } from '@ui-pages';
import { TOrder } from '@utils-types';
import { FC, useEffect } from 'react';

import { getAllFeeds, getOrdersFeeds } from '../../services/slices/feed/feed';
import { useDispatch, useSelector } from '../../services/store/store';

export const Feed: FC = () => {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(getAllFeeds());
  }, []);
  /** TODO: взять переменную из стора */
  const orders: TOrder[] = useSelector(getOrdersFeeds);

  const handleGetAllFeeds = () => {
    dispatch(getAllFeeds());
  };

  if (!orders.length) {
    return <Preloader />;
  }

  return <FeedUI orders={orders} handleGetFeeds={handleGetAllFeeds} />;
};

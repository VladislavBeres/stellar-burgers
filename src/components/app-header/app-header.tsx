import { FC } from 'react';
import { AppHeaderUI } from '@ui';

type TAppHeaderUIProps = {
  userName: string | undefined;
};

export const AppHeader: FC<TAppHeaderUIProps> = ({ userName }) => (
  <AppHeaderUI userName={userName} />
);

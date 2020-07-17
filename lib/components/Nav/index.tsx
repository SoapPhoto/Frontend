import React from 'react';

import { useRouter } from '@lib/router';
import {
  Item, ItemLink, Box, WrapperSsr,
} from './styles';

export interface INavItemProps {
  route: string;
}

export const Nav: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
  children,
  ...props
}) => (
  <WrapperSsr>
    <Box {...props}>
      {children}
    </Box>
  </WrapperSsr>
);

export const NavItem: React.FC<INavItemProps> = (({
  children,
  route,
}) => {
  const { pathname } = useRouter();
  const active = pathname === route;
  return (
    <Item>
      <ItemLink active={active ? 1 : 0} route={route}>
        <span>
          {children}
        </span>
      </ItemLink>
    </Item>
  );
});

import React, { useCallback, useEffect } from 'react';
import { css } from 'styled-components';
import { rem } from 'polished';

import { Avatar, EmojiText } from '@lib/components';
import { Popover } from '@lib/components/Popover';
import {
  Upload, User, Moon, Sun, Settings, LogOut,
} from '@lib/icon';
import { AccountStore } from '@lib/stores/AccountStore';
import { ThemeStore } from '@lib/stores/ThemeStore';
import { useTranslation } from '@lib/i18n/useTranslation';
import { useAccountStore, useStores } from '@lib/stores/hooks';
import { useRouter } from '@lib/router';
import { observer } from 'mobx-react';
import { IconButton, Button } from '@lib/components/Button';
import { Menu, MenuItem, MenuItemLink } from './Menu';
import {
  Href, MenuProfile, RightWrapper, UserName, SearchIcon, UploadCloudIcon,
} from './styles';
import { Notify } from './Notify';

export interface IProps {
  accountStore?: AccountStore;
  themeStore?: ThemeStore;
}

export const BtnGroup: React.FC = observer(() => {
  const { t } = useTranslation();
  const PopoverRef = React.useRef<Popover>(null);
  const { isLogin, userInfo, logout } = useAccountStore();
  const { themeStore } = useStores();
  const { pathname } = useRouter();
  const { theme, setTheme } = themeStore;
  const closeMenu = () => {
    if (PopoverRef.current) PopoverRef.current!.close();
  };
  console.log(theme);
  const handleLogout = useCallback(() => {
    closeMenu();
    logout();
  }, [logout]);
  const switchTheme = useCallback(() => {
    console.log(theme);
    setTheme(theme === 'dark' ? 'base' : 'dark');
  }, [setTheme, theme]);
  const isRedirect = [
    '/',
    '/validatoremail',
    '/login',
    '/signup',
    '/signin',
    '/signupMessage',
  ].findIndex(v => v === pathname) < 0;
  let content = (
    <>
      {
        theme === 'base' ? (
          <Moon
            onClick={switchTheme}
            css={css`margin-right: ${rem(22)};cursor: pointer;` as any}
          />
        ) : (
          <Sun
            onClick={switchTheme}
            css={css`margin-right: ${rem(22)};cursor: pointer;` as any}
          />
        )
      }
      <Href style={{ fontSize: 0 }} route={`/login${isRedirect ? `?redirectUrl=${pathname}` : ''}`}>
        <User />
      </Href>
    </>
  );
  useEffect(() => {
    closeMenu();
  }, [pathname]);
  if (isLogin && userInfo) {
    content = (
      <>
        <Notify />
        <Popover
          ref={PopoverRef}
          trigger="click"
          mobile
          contentStyle={{ padding: 0 }}
          content={(
            <Menu>
              <MenuItem>
                <MenuItemLink onClick={closeMenu} route={`/@${userInfo.username}`}>
                  <MenuProfile>
                    <Avatar
                      size={48}
                      src={userInfo!.avatar}
                    />
                    <UserName>
                      <EmojiText
                        text={userInfo.fullName}
                      />
                    </UserName>
                  </MenuProfile>
                </MenuItemLink>
              </MenuItem>
              {/* <MenuItem>
                <MenuItemLink onClick={closeMenu} route="/upload">
                  {t('menu.upload')}
                  <Upload size={18} />
                </MenuItemLink>
              </MenuItem> */}
              <MenuItem>
                <MenuItemLink onClick={closeMenu} route="/setting/profile">
                  {t('menu.setting')}
                </MenuItemLink>
              </MenuItem>
              <MenuItem>
                <MenuItemLink onClick={switchTheme}>
                  {theme === 'dark' ? t('menu.light') : t('menu.dark')}
                  {
                    theme === 'dark' ? (
                      <Sun size={18} />
                    ) : (
                      <Moon size={18} />
                    )
                  }
                </MenuItemLink>
              </MenuItem>
              <MenuItem>
                <MenuItemLink onClick={handleLogout}>
                  {t('menu.signout')}
                </MenuItemLink>
              </MenuItem>
            </Menu>
          )}
        >
          <Avatar
            src={userInfo!.avatar}
          />
        </Popover>
      </>
    );
  }
  return (
    <RightWrapper>
      <Href
        css={css`margin-right: ${rem(22)}; font-size: 0;` as any}
        route="/search"
      >
        <SearchIcon />
      </Href>
      <Href
        css={css`margin-right: ${rem(22)}; font-size: 0;` as any}
        route="/upload"
      >
        <UploadCloudIcon />
      </Href>
      {content}
    </RightWrapper>
  );
});

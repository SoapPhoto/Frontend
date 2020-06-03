declare namespace Express {
  // eslint-disable-next-line @typescript-eslint/interface-name-prefix
  export interface Request {
    locale: import('@common/enum/locale').LocaleType;
    user: import('@server/modules/user/user.entity').UserEntity | null;
  }
}

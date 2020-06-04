declare namespace Express {
  export interface Request {
    locale: import('@common/enum/locale').LocaleType;
  }
}

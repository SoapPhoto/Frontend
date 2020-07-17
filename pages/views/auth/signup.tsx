import { Formik, FormikHelpers, FormikProps } from 'formik';
import React, { useCallback, useRef } from 'react';

import { SignUpSchema } from '@lib/common/dto/auth';
import { getTitle } from '@lib/common/utils';
import { Button } from '@lib/components/Button';
import { FieldInput } from '@lib/components/Formik/FieldInput';
import { withAuth } from '@lib/components/router/withAuth';
import Toast from '@lib/components/Toast';
import {
  Title, Wrapper, Header, SubTitle,
} from '@lib/styles/views/auth';
import { rem } from 'polished';
import { useTranslation } from '@lib/i18n/useTranslation';
import { useRouter } from '@lib/router';
import { useAccountStore } from '@lib/stores/hooks';
import { EmojiText, SEO } from '@lib/components';
import { A } from '@lib/components/A';
import { FormikValidationFilter } from '@lib/common/utils/error';
import { isString } from 'lodash';

interface IValues {
  email: string;
  username: string;
  password: string;
}

const SignUp = () => {
  const formRef = useRef<FormikProps<IValues>>(null);
  const { t } = useTranslation();
  const { query } = useRouter();
  const { signup } = useAccountStore();
  const [confirmLoading, setConfirmLoading] = React.useState(false);
  const push = useCallback(() => {
    if (query.redirectUrl) {
      window.location = query.redirectUrl as any;
    } else {
      window.location = '/' as any;
    }
  }, [query.redirectUrl]);
  const handleOk = async (value: IValues, { setSubmitting }: FormikHelpers<IValues>) => {
    setConfirmLoading(true);
    setSubmitting(false);
    try {
      await signup(value);
      setSubmitting(true);
      setTimeout(() => {
        push();
      }, 400);
      Toast.success(t('auth.message.signup_success'));
    } catch (err) {
      if (isString(err.message)) {
        Toast.error(t(err.message));
      }
      const errors = FormikValidationFilter<IValues>(err);
      // eslint-disable-next-line no-unused-expressions
      formRef.current?.setErrors(errors);
      setSubmitting(false);
    } finally {
      setConfirmLoading(false);
    }
  };
  return (
    <Wrapper>
      <SEO
        title={getTitle('title.signup', t)}
        description="注册 Soap 分享创造你的生活给你的小伙伴。"
      />
      <Header>
        <Title>
          <EmojiText
            text={t('auth.title.signup')}
          />
        </Title>
        <SubTitle>
          已有账户？
          <A route="/login">登录</A>
        </SubTitle>
      </Header>
      <Formik<IValues>
        initialValues={{
          email: '',
          username: '',
          password: '',
        }}
        innerRef={formRef as any}
        onSubmit={handleOk}
        validationSchema={SignUpSchema(t)}
      >
        {({
          handleSubmit,
          isSubmitting,
        }) => (
          <form onSubmit={handleSubmit}>
            <FieldInput
              name="email"
              label={t('label.email')}
            />
            <FieldInput
              name="username"
              label={t('label.username')}
              style={{ marginTop: rem(24) }}
            />
            <FieldInput
              type="password"
              name="password"
              label={t('label.password')}
              style={{ marginTop: rem(24) }}
            />
            <Button
              loading={confirmLoading}
              style={{
                marginTop: rem(46),
                width: '100%',
              }}
              type="primary"
              htmlType="submit"
              disabled={isSubmitting}
            >
              {t('auth.btn.signup')}
            </Button>
          </form>
        )}
      </Formik>
    </Wrapper>
  );
};

export default withAuth('guest')(
  SignUp,
);

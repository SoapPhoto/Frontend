import * as React from 'react';
import { boolean, select } from '@storybook/addon-knobs';

import { storiesOf } from '@storybook/react';
import { withGlobalStyle } from '@lib/common/storybook/withGlobalStyle';
import { Plus } from 'react-feather';
import { Button } from './index';

const stories = storiesOf('Button', module);

stories
  .addDecorator(withGlobalStyle)
  .add('with Button', () => (
    <div style={{
      padding: 24,
      display: 'flex',
    }}
    >
      <Button
        loading={boolean('loading', false)}
        disabled={boolean('disabled', false)}
        danger={boolean('danger', false)}
        style={{ marginRight: 24 }}
        size={select('size', { default: undefined, small: 'small', large: 'large' }, undefined)}
      >
        test
      </Button>
      <Button
        type="primary"
        loading={boolean('loading', false)}
        disabled={boolean('disabled', false)}
        danger={boolean('danger', false)}
        style={{ marginRight: 24 }}
        size={select('size', { default: undefined, small: 'small', large: 'large' }, undefined)}
      >
        test
      </Button>
      <Button
        type="primary"
        loading={boolean('loading', false)}
        disabled={boolean('disabled', false)}
        danger={boolean('danger', false)}
        shape="circle"
        size={select('size', { default: undefined, small: 'small', large: 'large' }, undefined)}
        style={{ marginRight: 24 }}
        icon={<Plus size={24} />}
      />
      <Button
        loading={boolean('loading', false)}
        disabled={boolean('disabled', false)}
        danger={boolean('danger', false)}
        type="text"
        size={select('size', { default: undefined, small: 'small', large: 'large' }, undefined)}
      >
        文字按钮
      </Button>
    </div>
  ));

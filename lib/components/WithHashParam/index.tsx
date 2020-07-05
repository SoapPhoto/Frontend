import React, {
  useState, useCallback, useRef,
} from 'react';

import { Histore, server } from '@lib/common/utils';
import { useRouter } from '@lib/router';
import { useHashChange } from '@lib/common/hooks/useHashChange';

interface IProps {
  action: string;
  back: () => void;
  children: (visible: boolean, close: () => void) => React.ReactElement | null;
}

export const WithHashParam: React.FC<IProps> = ({ children, action }) => {
  const { back } = useRouter();
  const [visible, setVisible] = useState(false);
  const updated = useCallback(() => {
    if (window.location.hash.substr(1) === action) {
      setVisible(true);
    } else {
      setVisible(false);
    }
  }, [action]);
  useHashChange(updated);
  const close = useCallback(() => {
    const child = Histore!.get('modal');
    if (/^child/g.test(child)) {
      back();
      Histore.set('modal', `child-${action}-back`);
    } else {
      back();
    }
  }, [action, back]);
  return children(visible, close);
};

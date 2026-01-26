import { Link, LinkProps } from 'react-router-dom';
import { FC } from 'react';

interface AppLinkProps extends LinkProps {
  className?: string;
}

export const AppLink: FC<AppLinkProps> = ({ to, children, ...otherProps }) => {
  return (
    <Link to={to} {...otherProps}>
      {children}
    </Link>
  );
};

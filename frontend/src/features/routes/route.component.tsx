import type {ComponentType} from 'react';
import {useRouter} from '../../utils/hooks/useRouter.tsx';

interface RouteProps {
  path: string;
  Component: ComponentType<any>;
}

function matchPath(route: string, pathname: string) {
  const paramNames: string[] = [];

  const escaped = route.replace(/([.+?^${}()|[\]\\])/g, '\\$&');

  const regexString = escaped.replace(/:([A-Za-z0-9_]+)/g, (_, paramName) => {
    paramNames.push(paramName);
    return '([^/]+)';
  });

  const fullRegex = new RegExp(`^${regexString}$`);
  const match = pathname.match(fullRegex);

  if (!match) return {matches: false, params: {}};

  const params: Record<string, string> = {};
  paramNames.forEach((name, index) => {
    params[name] = match[index + 1];
  });

  return {matches: true, params};
}

export function Route({path, Component}: RouteProps) {
  const {pathname} = useRouter();
  const {matches, params} = matchPath(path, pathname);

  if (!matches) return null;

  return <Component params={params} />;
}

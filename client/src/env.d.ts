/// <reference types="vite/client" />

// дозволяє імпорт статичних файлів як модулів
declare module '*.svg' {
  import type * as React from 'react';
  const ReactComponent: React.FunctionComponent<React.SVGProps<SVGSVGElement> & { title?: string }>;
  export default ReactComponent;
}

declare module '*.png';
declare module '*.jpg';
declare module '*.jpeg';
declare module '*.gif';
declare module '*.webp';
declare module '*.avif';
declare module '*.json' {
  const value: any;
  export default value;
}

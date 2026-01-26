// import React, { type ReactNode, type ErrorInfo, Suspense } from 'react';
// import { PageError } from '@/widgets/PageError';

// interface ErrorBoundaryProps {
//   children: ReactNode;
// }

// interface ErrorBoundaryState {
//   hasError: boolean;
// }

// class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
//   constructor(props: ErrorBoundaryProps) {
//     super(props);
//     this.state = { hasError: false };
//   }

//   // eslint-disable-next-line n/handle-callback-err
//   static getDerivedStateFromError(error: Error): ErrorBoundaryState {
//     // Update state so the next render will show the fallback UI.
//     return { hasError: true };
//   }

//   componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
//     // You can also log the error to an error reporting service
//     console.log(error, errorInfo);
//   }

//   render(): React.ReactNode {
//     const { hasError } = this.state;
//     const { children } = this.props;

//     if (hasError) {
//       return (
//         <Suspense>
//           <PageError />
//         </Suspense>
//       );
//     }

//     return children;
//   }
// }

// export default ErrorBoundary;

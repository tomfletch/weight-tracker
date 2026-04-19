import type { ErrorInfo, ReactNode } from 'react';
import { Component } from 'react';
import { useLocation } from 'react-router-dom';
import styles from './ErrorBoundary.module.css';

type ErrorBoundaryProps = {
  children: ReactNode;
  location?: string;
};

type ErrorBoundaryState = {
  hasError: boolean;
};

class ErrorBoundaryClass extends Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  public constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  public static getDerivedStateFromError(): ErrorBoundaryState {
    return { hasError: true };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Application crashed in ErrorBoundary', error, errorInfo);
  }

  public componentDidUpdate(prevProps: ErrorBoundaryProps) {
    if (prevProps.location !== this.props.location && this.state.hasError) {
      this.setState({ hasError: false });
    }
  }

  private handleReload = () => {
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      return (
        <main className={styles.container}>
          <div className={styles.card}>
            <h1>Something went wrong</h1>
            <p>
              The app ran into an unexpected error.
              <br />
              Reload the page to try again.
            </p>
            <button
              type="button"
              className={styles.reloadButton}
              onClick={this.handleReload}
            >
              Reload app
            </button>
          </div>
        </main>
      );
    }

    return this.props.children;
  }
}

export function ErrorBoundary({ children }: { children: ReactNode }) {
  const location = useLocation();

  return (
    <ErrorBoundaryClass location={location.pathname}>
      {children}
    </ErrorBoundaryClass>
  );
}

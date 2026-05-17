import { Component, type ErrorInfo, type ReactNode } from 'react';
import { Link } from 'react-router-dom';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
}

export class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('StreamForge error:', error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        this.props.fallback ?? (
          <div className="flex min-h-[50vh] flex-col items-center justify-center gap-4 px-6 text-center">
            <h2 className="text-2xl font-semibold text-forge-glow">
              Something went wrong
            </h2>
            <p className="max-w-md text-sm text-white/60">
              We hit an unexpected error. Try refreshing or head back home.
            </p>
            <Link
              to="/"
              className="rounded-full border border-forge-green/40 bg-forge-green/10 px-6 py-2 text-sm font-medium text-forge-glow shadow-glow-sm transition hover:bg-forge-green/20"
            >
              Back to Home
            </Link>
          </div>
        )
      );
    }
    return this.props.children;
  }
}

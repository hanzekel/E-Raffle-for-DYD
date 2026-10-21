import { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
  };

  public static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Unhandled interface error:', error, errorInfo);
  }

  private handleReload = () => {
    window.location.reload();
  };

  private handleGoHome = () => {
    window.location.href = '/';
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center p-4 bg-slate-50 font-sans">
          <div className="card max-w-md w-full text-center p-8 border border-slate-200 shadow-xl bg-white">
            <div className="w-16 h-16 rounded-full bg-amber-50 border border-gold/30 text-gold flex items-center justify-center mx-auto mb-4 text-3xl">
              🕊️
            </div>
            <h1 className="text-2xl font-heading font-bold text-slate-900 mb-2">
              Something unexpected happened
            </h1>
            <p className="text-sm text-slate-600 mb-6 leading-relaxed">
              We had trouble loading this part of the website. Your registrations and tickets are safe in our vault.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button
                type="button"
                onClick={this.handleReload}
                className="btn-primary py-2.5 px-6 text-sm font-semibold"
              >
                Reload Page
              </button>
              <button
                type="button"
                onClick={this.handleGoHome}
                className="btn-secondary py-2.5 px-6 text-sm font-semibold"
              >
                Return to Home
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

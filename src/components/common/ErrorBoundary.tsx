import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
    children: ReactNode;
}

interface State {
    hasError: boolean;
    error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
    public state: State = {
        hasError: false,
        error: null
    };

    public static getDerivedStateFromError(error: Error): State {
        return { hasError: true, error };
    }

    public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        console.error('PixelPlayground Uncaught Error:', error, errorInfo);
    }

    public render() {
        if (this.state.hasError) {
            return (
                <div className="min-h-screen bg-slate-950 flex items-center justify-center p-6 text-center">
                    <div className="max-w-md w-full bg-slate-900 border border-rose-500/20 rounded-2xl p-8 shadow-2xl">
                        <div className="w-16 h-16 bg-rose-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
                            <span className="text-3xl">⚠️</span>
                        </div>
                        <h2 className="text-2xl font-bold text-white mb-2">Something went wrong</h2>
                        <p className="text-slate-400 mb-6">
                            The application encountered an unexpected error.
                            {this.state.error?.message && (
                                <code className="block mt-2 p-2 bg-slate-800 rounded text-rose-400 text-sm overflow-hidden text-ellipsis">
                                    {this.state.error.message}
                                </code>
                            )}
                        </p>
                        <button
                            onClick={() => window.location.reload()}
                            className="w-full py-3 bg-gradient-to-r from-rose-500 to-rose-600 hover:from-rose-600 hover:to-rose-700 text-white font-bold rounded-xl transition-all shadow-lg shadow-rose-500/20"
                        >
                            Reload Application
                        </button>
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}

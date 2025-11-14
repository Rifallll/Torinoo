"use client";

import React, { Component, ErrorInfo, ReactNode } from "react";
import { AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  public state: ErrorBoundaryState = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    // Update state so the next render will show the fallback UI.
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught error:", error, errorInfo);
    // You can also log error messages to an error reporting service here
    // For example: logErrorToMyService(error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      // You can render any custom fallback UI
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 p-4">
          <Card className="max-w-md w-full text-center shadow-lg border-red-500">
            <CardHeader>
              <CardTitle className="text-2xl font-bold text-red-600 flex items-center justify-center">
                <AlertCircle className="h-7 w-7 mr-3" />
                An Error Occurred!
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-gray-700 dark:text-gray-300">
              <p className="text-lg">
                Sorry, an unexpected problem occurred.
              </p>
              <p className="text-sm text-gray-500">
                We are working to fix it. Please try reloading the page.
              </p>
              {this.state.error && (
                <details className="text-left text-sm text-gray-600 dark:text-gray-400 p-2 border rounded-md bg-gray-100 dark:bg-gray-700">
                  <summary className="font-semibold cursor-pointer">Error Details</summary>
                  <pre className="mt-2 whitespace-pre-wrap break-all">
                    {this.state.error.message}
                  </pre>
                </details>
              )}
              <Button onClick={() => window.location.reload()} className="mt-4">
                Reload Page
              </Button>
            </CardContent>
          </Card>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
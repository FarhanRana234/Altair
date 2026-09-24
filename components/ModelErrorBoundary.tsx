"use client";

import { Component, type ReactNode } from "react";

type Props = {
  children: ReactNode;
  fallback?: ReactNode;
};

type State = {
  failed: boolean;
};

export default class ModelErrorBoundary extends Component<Props, State> {
  state: State = { failed: false };

  static getDerivedStateFromError(): State {
    return { failed: true };
  }

  componentDidCatch(): void {
    // Model URL failed to load — fallback is now rendered.
  }

  render() {
    if (this.state.failed && this.props.fallback) {
      return this.props.fallback;
    }
    return this.props.children;
  }
}
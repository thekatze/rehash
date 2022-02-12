import { Component } from "solid-js";

interface ReSkeletonProps {}

export const ReSkeleton: Component<ReSkeletonProps> = (props) => {
  return (
    <div className="w-full h-full animate-pulse animate-duration-1000 rounded bg-highlight-med dark:bg-dark-highlight-med"></div>
  );
};

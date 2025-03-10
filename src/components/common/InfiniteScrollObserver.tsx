import { UseInfiniteQueryResult } from "@tanstack/react-query";
import { useEffect } from "react";
import { useInView } from "react-intersection-observer";

interface InfiniteScrollObserverProps<TData, TError> {
  query: UseInfiniteQueryResult<TData, TError>;
  loadingComponent?: React.ReactNode;
  className?: string;
  rootMargin?: string;
  threshold?: number;
  disabled?: boolean;
}

function InfiniteScrollObserver<TData, TError>({
  query,
  loadingComponent,
  className = "divider",
  rootMargin = "160px",
  threshold = 0,
  disabled = false,
}: InfiniteScrollObserverProps<TData, TError>) {
  const { ref, inView } = useInView({ rootMargin, threshold });

  useEffect(() => {
    if (inView && !disabled && query.hasNextPage && !query.isFetchingNextPage) {
      console.log("fetching next page...");
      void query.fetchNextPage();
    }
  }, [inView, query, disabled]);

  if (!query.hasNextPage || disabled) {
    return null;
  }

  if (query.isFetchingNextPage && loadingComponent) {
    return <>{loadingComponent}</>;
  }

  return <div ref={ref} className={className}></div>;
}

export default InfiniteScrollObserver;

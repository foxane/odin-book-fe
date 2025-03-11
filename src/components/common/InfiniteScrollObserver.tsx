import { UseInfiniteQueryResult } from "@tanstack/react-query";
import { BotIcon } from "lucide-react";
import { useEffect } from "react";
import { useInView } from "react-intersection-observer";

interface InfiniteScrollObserverProps<TData, TError> {
  query: UseInfiniteQueryResult<TData, TError>;
  loadingComponent?: React.ReactNode;
  className?: string;
  rootMargin?: string;
  threshold?: number;
  disabled?: boolean;
  buttonMode?: boolean;
}

function InfiniteScrollObserver<TData, TError>({
  query,
  buttonMode = false,
  loadingComponent = (
    <div>
      <BotIcon className="mx-auto animate-bounce" size={40} />
      <div className="divider h-5"></div>
    </div>
  ),
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

  if (buttonMode)
    return (
      <div className="divider">
        <button
          className="btn btn-primary"
          onClick={() => {
            void query.fetchNextPage();
          }}
        >
          Load More
        </button>
      </div>
    );

  return <div ref={ref} className={className}></div>;
}

export default InfiniteScrollObserver;

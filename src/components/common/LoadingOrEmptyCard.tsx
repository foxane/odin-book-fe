import { twMerge } from "tailwind-merge";

function LoadingOrEmptyCard({ isLoading }: { isLoading: boolean }) {
  return (
    <div className="card mx-auto w-fit shadow-md">
      <div className="card-body space-y-2 text-center">
        <p
          className={twMerge(
            "text-5xl duration-200",
            isLoading && "animate-spin",
          )}
        >
          &#128511;
        </p>
        <p>{isLoading ? "Look at me spinning" : "Wow, such empty"}</p>
      </div>
    </div>
  );
}

export default LoadingOrEmptyCard;

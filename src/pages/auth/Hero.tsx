import { SquirrelIcon } from "lucide-react";
import CountUp from "react-countup";
import { twMerge } from "tailwind-merge";

interface HeroProps extends React.HTMLAttributes<HTMLDivElement> {
  userCount?: number;
}

export default function Hero({
  userCount = 100,
  className,
  ...props
}: HeroProps) {
  return (
    <div
      className={twMerge("card items-center justify-center p-2", className)}
      {...props}
    >
      <h1 className="flex items-center pb-2 text-4xl">
        Welcome to
        <span className="ps-3 pe-1 font-serif font-extrabold text-accent">
          Twittard
        </span>
        <SquirrelIcon
          size={40}
          strokeWidth={2}
          className="items-center stroke-accent"
        />
      </h1>

      <p className="mt-4 text-2xl">
        Join our community of
        <CountUp
          className="px-1 font-mono font-bold"
          useEasing={true}
          end={userCount}
          duration={5}
        />
        people!
      </p>
    </div>
  );
}

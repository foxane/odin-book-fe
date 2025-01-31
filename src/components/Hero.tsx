import { SquirrelIcon } from "lucide-react";
import CountUp from "react-countup";

interface HeroProps {
  userCount?: number;
}

export default function Hero({ userCount = 100 }: HeroProps) {
  return (
    <div className="card h-full flex-col items-center justify-center p-2 shadow-2xl">
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

      <p className="text-sm">What am i doing?</p>

      <p className="mt-4 text-2xl">
        Join our community of
        <CountUp
          className="px-1 font-mono font-bold"
          end={userCount}
          duration={5}
        />
        people!
      </p>
    </div>
  );
}

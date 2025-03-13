import { BotIcon } from "lucide-react";

function Hero() {
  return (
    <div>
      <div className="flex items-end font-serif text-4xl font-semibold">
        <BotIcon size={100} />
        <p className="mb-2">{import.meta.env.VITE_APP_NAME}</p>
      </div>
    </div>
  );
}

export default Hero;

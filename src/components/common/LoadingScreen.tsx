import { BotIcon } from "lucide-react";
import { getJoke } from "../../utils/helpers";

export default function LoadingScreen() {
  return (
    <div className="bg-base-100 absolute left-0 top-0 z-50 flex h-dvh w-screen flex-col items-center justify-center px-10">
      <p className="inline-flex items-center gap-2 font-serif text-4xl">
        {import.meta.env.VITE_APP_NAME}
        <BotIcon size={40} className="animate-bounce" />
      </p>
      <p className="label mt-5 text-wrap text-center text-sm italic">
        {getJoke()}
      </p>
    </div>
  );
}

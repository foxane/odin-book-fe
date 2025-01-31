import { User } from "lucide-react";

import GithubIcon from "../assets/github.svg";
import GoogleIcon from "../assets/google.svg";

export default function OAuthBtn() {
  return (
    <div className="flex flex-col gap-3">
      <button className="btn btn-soft">
        <User />
        Continue as Guest
      </button>

      <button className="btn border-black bg-black text-white hover:bg-accent">
        <img src={GithubIcon} />
        Continue with GitHub
      </button>

      <button className="btn border-[#e5e5e5] bg-white text-black hover:bg-accent">
        <img src={GoogleIcon} />
        Continue with Google
      </button>
    </div>
  );
}

import { ArrowLeft, OctagonXIcon } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface Props {
  text?: string;
}

export default function ErrorPage({ text = "Something went wrong" }: Props) {
  const navigate = useNavigate();

  /**
   * Send analytics here or something idk
   */

  return (
    <div className="flex flex-col items-center justify-center space-y-6 p-10">
      <div className="flex flex-col items-center space-y-1">
        <OctagonXIcon size={70} strokeWidth="2" />
        <p className="text-xl font-semibold">{text}</p>
      </div>

      <button className="btn btn-primary" onClick={() => navigate("/")}>
        <ArrowLeft />
        Go Home
      </button>

      <p></p>
    </div>
  );
}

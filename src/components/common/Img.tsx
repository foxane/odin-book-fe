import { ImageOffIcon } from "lucide-react";
import { Img as IMG, ImgProps } from "react-image";

interface Props extends Omit<ImgProps, "src"> {
  src: string | null;
}

export default function Img({ src, ...props }: Props) {
  if (!src)
    return (
      <Container>
        <ImageOffIcon size={80} className="opacity-50" />
        <p className="mt-1 text-2xl font-bold opacity-50">No image</p>
      </Container>
    );
  else
    return (
      <IMG
        src={src}
        loader={
          <Container>
            <span className="loading loading-xl opacity-50"></span>
          </Container>
        }
        unloader={
          <Container>
            <ImageOffIcon size={80} className="opacity-50" />
            <p className="mt-1 text-2xl font-bold opacity-50">Image broken</p>
          </Container>
        }
        loading="lazy"
        {...props}
      />
    );
}

function Container({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-base-200 flex h-full w-full flex-col items-center justify-center">
      {children}
    </div>
  );
}

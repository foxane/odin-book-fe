import { useEffect } from "react";

interface Props {
  image?: File;
  remove: () => void;
}

function ImagePreview({ image, remove }: Props) {
  const imageUrl = image && URL.createObjectURL(image);

  useEffect(() => {
    if (!imageUrl) return;

    return () => {
      URL.revokeObjectURL(imageUrl);
    };
  }, [imageUrl]);

  if (!image) return null;
  return (
    <div className="indicator">
      <img src={imageUrl} alt="Preview" className="h-20 w-20 object-cover" />
      <button
        onClick={remove}
        className="indicator-item badge badge-error hover cursor-pointer"
      >
        X
      </button>
    </div>
  );
}

export default ImagePreview;

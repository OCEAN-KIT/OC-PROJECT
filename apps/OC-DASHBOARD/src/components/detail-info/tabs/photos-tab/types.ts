export type PhotoPreview = {
  src: string;
  alt: string;
  label?: string;
};

export type OpenPhoto = (photo: PhotoPreview) => void;

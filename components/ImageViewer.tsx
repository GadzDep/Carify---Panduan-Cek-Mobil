import React from "react";
import ImageViewing from "react-native-image-viewing";

type ImageViewerProps = {
  images: { uri: string }[];
  imageIndex: number;
  visible: boolean;
  onRequestClose: () => void;
  FooterComponent?: React.ComponentType<any>;
};

export default function ImageViewer(props: ImageViewerProps) {
  return <ImageViewing {...props} />;
}

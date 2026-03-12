import React from "react";

type ImageViewerProps = {
  images: { uri: string }[];
  imageIndex: number;
  visible: boolean;
  onRequestClose: () => void;
  FooterComponent?: React.ComponentType<any>;
};

export default function ImageViewer(props: ImageViewerProps) {
  if (!props.visible) return null;

  // Tampilan sederhana khusus untuk browser Web agar tidak crash
  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "rgba(0,0,0,0.9)",
        zIndex: 9999,
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
      }}
      onClick={props.onRequestClose}
    >
      <img
        src={props.images[props.imageIndex]?.uri}
        style={{ maxHeight: "80vh", maxWidth: "90vw", objectFit: "contain" }}
        alt="Preview"
      />
      <div
        style={{
          position: "absolute",
          top: 20,
          right: 30,
          color: "white",
          cursor: "pointer",
          fontSize: 24,
        }}
        onClick={props.onRequestClose}
      >
        ✕
      </div>
      {props.FooterComponent && (
        <div style={{ position: "absolute", bottom: 20, width: "100%" }}>
          <props.FooterComponent imageIndex={props.imageIndex} />
        </div>
      )}
    </div>
  );
}

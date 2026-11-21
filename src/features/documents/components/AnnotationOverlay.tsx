interface AnnotationOverlayProps {
  position: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
}

export default function AnnotationOverlay({
  position,
}: AnnotationOverlayProps) {
  return (
    <div
      style={{
        position: "absolute",
        left: `${position.x * 100}%`,
        top: `${position.y * 100}%`,
        width: `${position.width * 100}%`,
        height: `${position.height * 100}%`,
        backgroundColor: "rgba(255, 230, 0, 0.4)",
        borderBottom: "2px solid rgba(220, 170, 0, 0.9)",
        pointerEvents: "none",
      }}
    />
  );
}

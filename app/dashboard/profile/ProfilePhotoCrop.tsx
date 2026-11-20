import { useEffect, useRef, useState, type PointerEvent } from "react";

const outputSize = 256;

export default function ProfilePhotoCrop({
  source,
  saving,
  saveError,
  onSave,
  onCancel,
}: {
  source: string;
  saving: boolean;
  saveError: string;
  onSave: (photo: Blob) => Promise<void>;
  onCancel: () => void;
}) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const drag = useRef<{ x: number; y: number; horizontal: number; vertical: number } | null>(null);
  const [image, setImage] = useState<HTMLImageElement | null>(null);
  const [zoom, setZoom] = useState(1);
  const [horizontal, setHorizontal] = useState(50);
  const [vertical, setVertical] = useState(50);
  const [error, setError] = useState("");
  const [preparing, setPreparing] = useState(false);
  const busy = preparing || saving;

  useEffect(() => {
    const dialog = dialogRef.current;
    dialog?.showModal();
    return () => dialog?.close();
  }, []);

  useEffect(() => {
    const photo = new Image();
    photo.onload = () => setImage(photo);
    photo.onerror = () => setError("Unable to open this photo. Try another image.");
    photo.src = source;
    return () => {
      photo.onload = null;
      photo.onerror = null;
    };
  }, [source]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas?.getContext("2d");
    if (!image || !context) return;

    const side = Math.min(image.naturalWidth, image.naturalHeight) / zoom;
    const left = (image.naturalWidth - side) * horizontal / 100;
    const top = (image.naturalHeight - side) * vertical / 100;
    context.fillStyle = "#ffffff";
    context.fillRect(0, 0, outputSize, outputSize);
    context.drawImage(image, left, top, side, side, 0, 0, outputSize, outputSize);
  }, [image, zoom, horizontal, vertical]);

  const startDrag = (event: PointerEvent<HTMLCanvasElement>) => {
    if (!image || busy || !event.isPrimary || event.button !== 0) return;
    event.currentTarget.setPointerCapture(event.pointerId);
    drag.current = { x: event.clientX, y: event.clientY, horizontal, vertical };
  };

  const moveCrop = (event: PointerEvent<HTMLCanvasElement>) => {
    if (!image || !drag.current || busy || !event.currentTarget.hasPointerCapture(event.pointerId)) return;
    const side = Math.min(image.naturalWidth, image.naturalHeight) / zoom;
    const pixelsPerScreenPixel = side / event.currentTarget.getBoundingClientRect().width;
    const applyDrag = (position: number, delta: number, room: number) =>
      room > 0 ? Math.min(100, Math.max(0, position - delta * pixelsPerScreenPixel / room * 100)) : position;

    setHorizontal(applyDrag(drag.current.horizontal, event.clientX - drag.current.x, image.naturalWidth - side));
    setVertical(applyDrag(drag.current.vertical, event.clientY - drag.current.y, image.naturalHeight - side));
  };

  const saveCrop = async () => {
    const canvas = canvasRef.current;
    if (!canvas || !image || busy) return;
    setPreparing(true);
    setError("");
    try {
      const photo = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, "image/jpeg", 0.85));
      if (!photo) {
        setError("Unable to prepare this photo. Try another image.");
        return;
      }
      await onSave(photo);
    } catch {
      setError("Unable to prepare this photo. Try another image.");
    } finally {
      setPreparing(false);
    }
  };

  return (
    <dialog
      ref={dialogRef}
      aria-labelledby="photo-crop-title"
      className="fixed inset-0 m-auto max-h-[calc(100dvh-2rem)] w-[calc(100%-2rem)] max-w-md overflow-y-auto rounded-2xl bg-white p-0 text-gray-900 shadow-2xl backdrop:bg-black/60"
      onCancel={(event) => {
        event.preventDefault();
        if (!busy) onCancel();
      }}
    >
      <header className="flex items-center justify-between border-b border-gray-200 px-5 py-4">
        <h3 id="photo-crop-title" className="text-lg font-semibold">Edit Profile Photo</h3>
        <button
          type="button"
          aria-label="Close photo editor"
          onClick={onCancel}
          disabled={busy}
          className="grid h-9 w-9 place-items-center rounded-full bg-gray-100 text-xl hover:bg-gray-200 disabled:opacity-50"
        >
          &times;
        </button>
      </header>

      <div className="space-y-4 px-5 py-4">
        {!image && !error && <p role="status" className="text-sm text-gray-600">Opening photo...</p>}
        <div hidden={!image} className="relative mx-auto w-full max-w-xs overflow-hidden rounded-lg ring-1 ring-gray-300">
          <canvas
            ref={canvasRef}
            width={outputSize}
            height={outputSize}
            aria-label="Square profile photo crop"
            aria-describedby="photo-crop-instructions"
            tabIndex={image && !busy ? 0 : -1}
            onPointerDown={startDrag}
            onPointerMove={moveCrop}
            onLostPointerCapture={() => { drag.current = null; }}
            onKeyDown={(event) => {
              const offsets: Record<string, [number, number]> = {
                ArrowLeft: [5, 0], ArrowRight: [-5, 0], ArrowUp: [0, 5], ArrowDown: [0, -5],
              };
              const offset = offsets[event.key];
              if (!offset || busy) return;
              event.preventDefault();
              setHorizontal((position) => Math.min(100, Math.max(0, position + offset[0])));
              setVertical((position) => Math.min(100, Math.max(0, position + offset[1])));
            }}
            className="block aspect-square w-full touch-none cursor-grab bg-gray-100 focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-brand-red active:cursor-grabbing"
          />
        </div>
        {image && (
          <>
            <p id="photo-crop-instructions" className="text-center text-sm text-gray-600">
              Drag the photo to reposition it. Use the arrow keys when the photo is focused.
            </p>
            <label className="mx-auto flex max-w-xs items-center gap-3 text-sm font-medium">
              Zoom
              <input
                type="range"
                min={1}
                max={3}
                step={0.05}
                value={zoom}
                disabled={busy}
                onChange={(event) => setZoom(event.currentTarget.valueAsNumber)}
                className="min-w-0 flex-1 accent-brand-red"
              />
            </label>
          </>
        )}
        {(error || saveError) && <p role="alert" className="text-sm text-red-700">{error || saveError}</p>}
      </div>

      <footer className="flex justify-end gap-3 border-t border-gray-200 px-5 py-4">
        <button type="button" onClick={onCancel} disabled={busy} className="rounded-lg px-4 py-2 font-medium text-gray-700 hover:bg-gray-100 disabled:opacity-50">
          Cancel
        </button>
        <button
          type="button"
          onClick={() => void saveCrop()}
          disabled={!image || busy}
          className="rounded-lg bg-brand-red px-4 py-2 font-semibold text-white hover:bg-brand-red-dark disabled:opacity-50"
        >
          {saving ? "Saving..." : "Save Photo"}
        </button>
      </footer>
    </dialog>
  );
}

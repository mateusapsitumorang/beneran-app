import { useState, useRef } from "react";
import { Upload, Image, Video, X, AlertCircle } from "lucide-react";

const MAKS_UKURAN_FOTO = 10 * 1024 * 1024; // 10MB
const MAKS_UKURAN_VIDEO = 100 * 1024 * 1024; // 100MB
const TIPE_FOTO = ["image/jpeg", "image/png", "image/webp", "image/gif"];
const TIPE_VIDEO = ["video/mp4", "video/webm", "video/quicktime", "video/avi"];

export default function MediaUploader({ onFileSelected, isLoading }) {
  const [dragOver, setDragOver] = useState(false);
  const [error, setError] = useState("");
  const [preview, setPreview] = useState(null);
  const [fileInfo, setFileInfo] = useState(null);
  const inputRef = useRef(null);

  function validasiFile(file) {
    const isGambar = TIPE_FOTO.includes(file.type);
    const isVideo = TIPE_VIDEO.includes(file.type);

    if (!isGambar && !isVideo) {
      return "Format tidak didukung. Gunakan JPG, PNG, WebP, MP4, atau WebM.";
    }
    if (isGambar && file.size > MAKS_UKURAN_FOTO) {
      return "Foto terlalu besar. Maksimal 10MB.";
    }
    if (isVideo && file.size > MAKS_UKURAN_VIDEO) {
      return "Video terlalu besar. Maksimal 100MB.";
    }
    return null;
  }

  function prosesFile(file) {
    setError("");
    const pesanError = validasiFile(file);
    if (pesanError) {
      setError(pesanError);
      return;
    }

    const isGambar = TIPE_FOTO.includes(file.type);
    setFileInfo({
      nama: file.name,
      ukuran: (file.size / 1024 / 1024).toFixed(2),
      tipe: isGambar ? "foto" : "video",
    });

    // Buat preview
    if (isGambar) {
      const url = URL.createObjectURL(file);
      setPreview({ url, tipe: "gambar" });
    } else {
      const url = URL.createObjectURL(file);
      setPreview({ url, tipe: "video" });
    }

    onFileSelected(file);
  }

  function handleDrop(e) {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) prosesFile(file);
  }

  function handleChange(e) {
    const file = e.target.files[0];
    if (file) prosesFile(file);
  }

  function hapusFile() {
    setPreview(null);
    setFileInfo(null);
    setError("");
    if (inputRef.current) inputRef.current.value = "";
    onFileSelected(null);
  }

  return (
    <div className="w-full">
      {!preview ? (
        // Area Drop
        <div
          onDrop={handleDrop}
          onDragOver={(e) => {
            e.preventDefault();
            setDragOver(true);
          }}
          onDragLeave={() => setDragOver(false)}
          onClick={() => inputRef.current?.click()}
          className={`border-2 border-dashed rounded-2xl p-10 text-center cursor-pointer transition-all ${
            dragOver
              ? "border-blue-400 bg-blue-50"
              : "border-slate-300 hover:border-blue-300 hover:bg-slate-50"
          }`}
        >
          <input
            ref={inputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp,video/mp4,video/webm,video/quicktime"
            onChange={handleChange}
            className="hidden"
          />

          <Upload size={40} className="text-slate-400 mx-auto mb-4" />
          <p className="font-semibold text-slate-700 mb-1">
            Drag & drop atau klik untuk pilih file
          </p>
          <p className="text-sm text-slate-400 mb-4">
            Foto (JPG, PNG, WebP) atau Video (MP4, WebM)
          </p>

          <div className="flex items-center justify-center gap-4">
            <div className="flex items-center gap-1.5 text-xs text-slate-400">
              <Image size={14} />
              Foto maks 10MB
            </div>
            <div className="w-1 h-1 rounded-full bg-slate-300" />
            <div className="flex items-center gap-1.5 text-xs text-slate-400">
              <Video size={14} />
              Video maks 100MB
            </div>
          </div>
        </div>
      ) : (
        // Preview File
        <div className="border border-slate-200 rounded-2xl overflow-hidden">
          {/* Preview media */}
          <div className="relative bg-slate-900">
            {preview.tipe === "gambar" ? (
              <img
                src={preview.url}
                alt="Preview"
                className="w-full max-h-64 object-contain"
              />
            ) : (
              <video src={preview.url} controls className="w-full max-h-64" />
            )}

            {/* Tombol hapus */}
            <button
              onClick={hapusFile}
              disabled={isLoading}
              className="absolute top-3 right-3 w-8 h-8 rounded-full bg-black/50 hover:bg-black/70 text-white flex items-center justify-center transition-colors"
            >
              <X size={16} />
            </button>
          </div>

          {/* Info file */}
          {fileInfo && (
            <div className="p-4 flex items-center gap-3 bg-white">
              {fileInfo.tipe === "foto" ? (
                <Image size={18} className="text-blue-500 flex-shrink-0" />
              ) : (
                <Video size={18} className="text-purple-500 flex-shrink-0" />
              )}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-slate-700 truncate">
                  {fileInfo.nama}
                </p>
                <p className="text-xs text-slate-400">
                  {fileInfo.ukuran} MB • {fileInfo.tipe}
                </p>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="mt-3 flex items-center gap-2 text-red-600 text-sm bg-red-50 border border-red-200 rounded-xl px-4 py-3">
          <AlertCircle size={15} className="flex-shrink-0" />
          {error}
        </div>
      )}
    </div>
  );
}

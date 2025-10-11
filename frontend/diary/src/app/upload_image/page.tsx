"use client";

import { useState } from "react";

export default function UploadPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [message, setMessage] = useState<string>("");

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleUpload = async () => {
    if (!selectedFile || !name || !email) {
      setMessage("名前・E-mail・画像をすべて入力してください。");
      return;
    }

    const formData = new FormData();
    formData.append("file", selectedFile);
    formData.append("name", name);
    formData.append("email", email);

    try {
      const response = await fetch("/image/upload", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        setMessage("アップロードが完了しました。");
        setName("");
        setEmail("");
        setSelectedFile(null);
        setPreview(null);
      } else {
        setMessage("アップロードに失敗しました。");
      }
    } catch (error) {
      console.error(error);
      setMessage("通信エラーが発生しました。");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen space-y-6">
      <h1 className="text-2xl font-semibold">あなたについて教えてください</h1>

      <div className="flex flex-col space-y-3 w-72">
        <label className="flex flex-col">
          <span className="text-sm font-medium mb-1">名前</span>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="border rounded p-2"
            placeholder="山田 太郎"
          />
        </label>

        <label className="flex flex-col">
          <span className="text-sm font-medium mb-1">E-mail</span>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="border rounded p-2"
            placeholder="example@mail.com"
          />
        </label>

        <label className="flex flex-col">
          <span className="text-sm font-medium mb-1">顔写真</span>
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="border p-2 rounded"
          />
        </label>

        {preview && (
          <img
            src={preview}
            alt="プレビュー"
            className="w-48 h-48 object-cover rounded-full border self-center"
          />
        )}

        <button
          onClick={handleUpload}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          アップロード
        </button>

        {message && <p className="text-center">{message}</p>}
      </div>
    </div>
  );
}

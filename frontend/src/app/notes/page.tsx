"use client";

import { useEffect, useState } from "react";
import { redirect } from "next/navigation";
import { useAuth } from "@/auth/useAuth";
import { getNotes, createNote } from "@/api/notes";
import { NoteDTO } from "@/types/index";

export default function NotesPage() {
  const { accessToken, setAccessToken, loading } = useAuth();
  const [notes, setNotes] = useState<NoteDTO[]>([]);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  // Load notes on page load
  useEffect(() => {
    if (!accessToken) return;

    getNotes(accessToken, setAccessToken).then(setNotes).catch(console.error);
  }, [accessToken]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!accessToken) {
    redirect("/login");
  }

  async function handleCreate() {
    const note = await createNote(title, content, accessToken, setAccessToken);

    // Optimistically update UI
    setNotes((prev) => [note, ...prev]);
    setTitle("");
    setContent("");
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans">
      <main className="flex min-h-screen w-full max-w-3xl flex-col items-center justify-between py-32 px-16 bg-white sm:items-start">
        <div className="flex flex-col items-center gap-6 text-center sm:items-start sm:text-left">
          <h1 className="max-w-xs text-3xl font-semibold leading-10 tracking-tight text-black ">
            Notes
          </h1>

          <div>
            <label
              htmlFor="title"
              className="block text-sm font-medium text-gray-700"
            >
              Title
            </label>
            <input
              id="title"
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>

          <div>
            <label
              htmlFor="content"
              className="block text-sm font-medium text-gray-700"
            >
              Content
            </label>
            <textarea
              id="content"
              required
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>

          <button
            className="w-full rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
            onClick={handleCreate}
            type="button"
          >
            Create
          </button>

          <ul>
            {notes.map((note) => (
              <li key={note.id}>
                <strong>{note.title}</strong>
                <p>{note.content}</p>
              </li>
            ))}
          </ul>

          <a href="/profile" className="font-medium text-zinc-950">
            Profile
          </a>
        </div>
      </main>
    </div>
  );
}

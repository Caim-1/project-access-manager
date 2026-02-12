"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/auth/useAuth";
import { getNotes, createNote, deleteNote } from "@/api/notes";
import { NoteDTO } from "@/types/index";

export default function NotesPage() {
  const router = useRouter();
  const { accessToken, setAccessToken, loading } = useAuth();
  const [notes, setNotes] = useState<NoteDTO[]>([]);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  // Redirect effect
  useEffect(() => {
    if (!loading && !accessToken) {
      router.push("/login");
    }
  }, [loading, accessToken, router]);

  // Load notes on page load
  useEffect(() => {
    if (!loading && accessToken) {
      getNotes(accessToken, setAccessToken).then(setNotes).catch(console.error);
    }
  }, [loading, accessToken, setAccessToken]);

  // Render logic after hooks
  if (loading) {
    return <div>Loading...</div>;
  }

  async function handleSubmit() {
    const note = await createNote(title, content, accessToken, setAccessToken);

    // Optimistically update UI
    setNotes((prev) => [note, ...prev]);
    setTitle("");
    setContent("");
  }

  async function handleDelete(noteId: string) {
    try {
      await deleteNote(noteId, accessToken, setAccessToken);
      console.log(typeof noteId);
      console.log(typeof notes[0]?.id);
      setNotes((prev) => prev.filter((n) => n.id !== noteId));
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <>
      <h1 className="max-w-xs text-3xl font-semibold leading-10 tracking-tight text-black ">
        Notes
      </h1>

      <form action={handleSubmit} className="flex flex-col gap-6">
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
          type="submit"
        >
          Create
        </button>
      </form>

      <ul>
        {notes.map((note) => (
          <li key={note.id}>
            <strong>{note.title}</strong>
            <p>{note.content}</p>
            <button type="button" onClick={() => handleDelete(note.id)}>
              Remove
            </button>
          </li>
        ))}
      </ul>

      <a href="/profile" className="font-medium text-zinc-950">
        Profile
      </a>
    </>
  );
}

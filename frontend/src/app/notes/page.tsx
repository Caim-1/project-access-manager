"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/auth/useAuth";
import { getNotes, createNote } from "@/api/notes";
import { NoteDTO } from "@/types/index";

export default function NotesPage() {
  const { accessToken, setAccessToken } = useAuth();

  const [notes, setNotes] = useState<NoteDTO[]>([]);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  // Load notes on page load
  useEffect(() => {
    if (!accessToken) return;

    getNotes(accessToken, setAccessToken).then(setNotes).catch(console.error);
  }, [accessToken]);

  async function handleCreate() {
    const note = await createNote(title, content, accessToken, setAccessToken);

    // Optimistically update UI
    setNotes((prev) => [note, ...prev]);
    setTitle("");
    setContent("");
  }

  return (
    <div>
      <h1>Notes</h1>

      <input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Title"
      />

      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Content"
      />

      <button onClick={handleCreate}>Create</button>

      <ul>
        {notes.map((note) => (
          <li key={note.id}>
            <strong>{note.title}</strong>
            <p>{note.content}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}

import { authFetch } from "@/lib/authFetch";
import { NoteDTO } from "@/types";

// Fetch all notes for logged-in user
export async function getNotes(
  accessToken: string | null,
  setAccessToken: (t: string | null) => void,
): Promise<NoteDTO[]> {
  const res = await authFetch(
    `${process.env.NEXT_PUBLIC_API_URL}/notes`,
    { method: "GET" },
    accessToken,
    setAccessToken,
  );

  if (!res.ok) {
    throw new Error("failed to get notes");
  }

  return res.json();
}

// Create a new note
export async function createNote(
  title: string,
  content: string,
  accessToken: string | null,
  setAccessToken: (t: string | null) => void,
) {
  const res = await authFetch(
    `${process.env.NEXT_PUBLIC_API_URL}/notes`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, content }),
    },
    accessToken,
    setAccessToken,
  );

  if (!res.ok) {
    throw new Error("Failed to create note");
  }

  return res.json();
}

// Update note
export async function updateNote(
  id: string,
  title: string,
  content: string,
  accessToken: string | null,
  setAccessToken: (t: string | null) => void,
) {
  const res = await authFetch(
    `${process.env.NEXT_PUBLIC_API_URL}/notes/${id}`,
    {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, content }),
    },
    accessToken,
    setAccessToken,
  );

  if (!res.ok) {
    throw new Error("Failed to update note");
  }

  return res.json();
}

// Delete note
export async function deleteNote(
  id: string,
  accessToken: string | null,
  setAccessToken: (t: string | null) => void,
) {
  const res = await authFetch(
    `${process.env.NEXT_PUBLIC_API_URL}/notes/${id}`,
    {
      method: "DELETE",
    },
    accessToken,
    setAccessToken,
  );

  if (!res.ok) {
    throw new Error("Failed to delete note");
  }

  return res.json();
}

import { createAdminClient } from "@/lib/supabase/admin";
import MessagesTable from "./MessagesTable";

export type Message = {
  id: string;
  full_name: string;
  email: string;
  i_am_a: string;
  message: string;
  status: string;
  created_at: string;
};

export default async function AdminMessagesPage() {
  const db = createAdminClient();
  const { data, error } = await db
    .from("messages")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    return (
      <div>
        <h1 className="admin-page-title">Messages</h1>
        <p style={{ color: "var(--color-error)" }}>
          Failed to load messages: {error.message}
        </p>
      </div>
    );
  }

  const messages: Message[] = data ?? [];

  return (
    <div>
      <h1 className="admin-page-title">Messages</h1>
      <p
        style={{
          color: "var(--color-text-secondary)",
          marginBottom: 24,
          fontSize: "0.9rem",
        }}
      >
        {messages.length} message{messages.length !== 1 ? "s" : ""} - most
        recent first. Click a row to view full message.
      </p>
      <MessagesTable messages={messages} />
    </div>
  );
}

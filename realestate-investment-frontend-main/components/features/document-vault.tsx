"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { API_BASE } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface VaultDoc {
  _id: string;
  title: string;
  fileUrl: string;
  fileType: string;
  createdAt: string;
}

export function DocumentVault({
  investmentId,
  investorId,
  adminMode = false
}: {
  investmentId?: string;
  investorId?: string;
  adminMode?: boolean;
}) {
  const { data } = useSession();
  const [docs, setDocs] = useState<VaultDoc[]>([]);
  const [title, setTitle] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [message, setMessage] = useState("");

  const load = async () => {
    if (!data?.accessToken) return;

    const search = investmentId ? `?investmentId=${investmentId}` : "";
    const response = await fetch(`${API_BASE}/documents${search}`, {
      headers: {
        Authorization: `Bearer ${data.accessToken}`
      },
      cache: "no-store"
    });
    const payload = await response.json();
    if (payload.success) {
      setDocs(payload.data);
    }
  };

  useEffect(() => {
    void load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data?.accessToken, investmentId]);

  const upload = async () => {
    if (!adminMode || !data?.accessToken || !file || !title || !investmentId || !investorId) return;

    const form = new FormData();
    form.append("file", file);
    form.append("title", title);
    form.append("investmentId", investmentId);
    form.append("investorId", investorId);

    const response = await fetch(`${API_BASE}/documents`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${data.accessToken}`
      },
      body: form
    });

    const payload = await response.json();
    if (!response.ok || !payload.success) {
      setMessage(payload.error?.message || "Upload failed");
      return;
    }

    setMessage("Document uploaded successfully.");
    setTitle("");
    setFile(null);
    await load();
  };

  return (
    <div className="space-y-4">
      {adminMode && (
        <div className="rounded-xl border border-white/10 bg-white/5 p-4">
          <h3 className="mb-3 text-sm font-semibold text-white">Upload document</h3>
          <div className="grid gap-3 md:grid-cols-3">
            <Input placeholder="Document title" value={title} onChange={(e) => setTitle(e.target.value)} />
            <input
              type="file"
              onChange={(e) => setFile(e.target.files?.[0] || null)}
              className="rounded-xl border border-white/15 bg-brand-navy/70 p-2 text-sm text-slate-200"
            />
            <Button onClick={upload}>Upload</Button>
          </div>
        </div>
      )}

      {message && <div className="rounded-xl bg-brand-gold/10 p-3 text-sm text-amber-100">{message}</div>}

      <div className="space-y-2">
        {docs.map((doc) => (
          <div key={doc._id} className="flex items-center justify-between rounded-xl border border-white/10 bg-white/5 p-3">
            <div>
              <p className="font-medium text-white">{doc.title}</p>
              <p className="text-xs text-slate-400">{new Date(doc.createdAt).toLocaleString()}</p>
            </div>
            <a href={`${API_BASE.replace("/api", "")}${doc.fileUrl}`} target="_blank" className="text-sm text-brand-gold">
              Open
            </a>
          </div>
        ))}
        {!docs.length && <p className="text-sm text-slate-400">No documents available.</p>}
      </div>
    </div>
  );
}

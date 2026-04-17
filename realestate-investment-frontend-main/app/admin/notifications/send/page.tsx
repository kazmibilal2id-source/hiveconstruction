"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { apiRequest } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function SendNotificationsPage() {
  const { data } = useSession();
  const [recipientId, setRecipientId] = useState("");
  const [sendToAllInvestors, setSendToAllInvestors] = useState(true);
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState("");

  const submit = async () => {
    if (!data?.accessToken || !message) return;

    try {
      await apiRequest(
        "/notifications/send",
        {
          method: "POST",
          body: JSON.stringify({
            recipientId: sendToAllInvestors ? undefined : recipientId,
            message,
            type: "admin_announcement",
            sendToAllInvestors
          })
        },
        data.accessToken
      );
      setStatus("Notification dispatched successfully.");
      setMessage("");
      setRecipientId("");
    } catch (error) {
      setStatus((error as Error).message);
    }
  };

  return (
    <div className="space-y-5">
      <h1 className="text-2xl font-bold text-white">Send Notifications</h1>
      <div className="glass-card space-y-4 p-6">
        <label className="flex items-center gap-2 text-sm text-slate-200">
          <input
            type="checkbox"
            checked={sendToAllInvestors}
            onChange={(e) => setSendToAllInvestors(e.target.checked)}
          />
          Send to all active investors
        </label>

        {!sendToAllInvestors && (
          <div>
            <Label>Recipient ID</Label>
            <Input value={recipientId} onChange={(e) => setRecipientId(e.target.value)} placeholder="Investor user ID" />
          </div>
        )}

        <div>
          <Label>Message</Label>
          <Input value={message} onChange={(e) => setMessage(e.target.value)} placeholder="Enter notification message" />
        </div>

        <Button onClick={submit}>Send</Button>
        {status && <p className="rounded-xl bg-brand-gold/10 p-2 text-sm text-amber-100">{status}</p>}
      </div>
    </div>
  );
}

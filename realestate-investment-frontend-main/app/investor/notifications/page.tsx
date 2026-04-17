"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { apiRequest } from "@/lib/api";
import { NotificationItem } from "@/lib/types";
import { Button } from "@/components/ui/button";

export default function InvestorNotificationsPage() {
  const { data } = useSession();
  const [items, setItems] = useState<NotificationItem[]>([]);

  const load = async () => {
    if (!data?.accessToken) return;
    const notifications = await apiRequest<NotificationItem[]>("/notifications", {}, data.accessToken);
    setItems(notifications);
  };

  useEffect(() => {
    void load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data?.accessToken]);

  const markRead = async (id: string) => {
    if (!data?.accessToken) return;
    await apiRequest(`/notifications/${id}/read`, { method: "PATCH" }, data.accessToken);
    await load();
  };

  return (
    <div className="space-y-5">
      <h1 className="text-2xl font-bold text-white">Notifications</h1>
      <div className="space-y-3">
        {items.map((item) => (
          <div key={item._id} className="glass-card flex items-center justify-between gap-4 p-4">
            <div>
              <p className="text-sm text-white">{item.message}</p>
              <p className="text-xs text-slate-400">{new Date(item.createdAt).toLocaleString()}</p>
            </div>
            {!item.isRead && (
              <Button variant="outline" size="sm" onClick={() => markRead(item._id)}>
                Mark read
              </Button>
            )}
          </div>
        ))}
        {!items.length && <p className="text-sm text-slate-400">No notifications yet.</p>}
      </div>
    </div>
  );
}

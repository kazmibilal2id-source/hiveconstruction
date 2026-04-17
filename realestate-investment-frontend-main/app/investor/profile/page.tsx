"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { apiRequest } from "@/lib/api";
import { User } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function InvestorProfilePage() {
  const { data } = useSession();
  const [profile, setProfile] = useState<User | null>(null);
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!data?.accessToken) return;
    apiRequest<User>("/profile", {}, data.accessToken)
      .then(setProfile)
      .catch(() => setProfile(null));
  }, [data?.accessToken]);

  const save = async () => {
    if (!data?.accessToken || !profile) return;

    try {
      const updated = await apiRequest<User>(
        "/profile",
        {
          method: "PATCH",
          body: JSON.stringify({
            fullName: profile.fullName,
            phone: profile.phone,
            address: profile.address,
            profileImage: profile.profileImage
          })
        },
        data.accessToken
      );
      setProfile(updated);
      setMessage("Profile updated successfully.");
    } catch (error) {
      setMessage((error as Error).message);
    }
  };

  if (!profile) {
    return <p className="text-slate-300">Loading profile...</p>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">My Profile</h1>
        <p className="text-slate-300">Manage your personal account details.</p>
      </div>

      <div className="glass-card space-y-4 p-6">
        <div>
          <Label>Full Name</Label>
          <Input value={profile.fullName} onChange={(e) => setProfile({ ...profile, fullName: e.target.value })} />
        </div>
        <div>
          <Label>Email</Label>
          <Input value={profile.email} disabled />
        </div>
        <div>
          <Label>Phone</Label>
          <Input value={profile.phone || ""} onChange={(e) => setProfile({ ...profile, phone: e.target.value })} />
        </div>
        <div>
          <Label>Address</Label>
          <Input value={profile.address || ""} onChange={(e) => setProfile({ ...profile, address: e.target.value })} />
        </div>
        {message && <p className="rounded-xl bg-brand-gold/10 p-3 text-sm text-amber-100">{message}</p>}
        <Button onClick={save}>Save Changes</Button>
      </div>
    </div>
  );
}

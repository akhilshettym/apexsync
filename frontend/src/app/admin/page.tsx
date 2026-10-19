"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ShieldAlert, Activity, Database, Server, ArrowLeft } from "lucide-react";

export default function AdminControlCenter() {
  const router = useRouter();
  const [health, setHealth] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchHealth() {
      try {
        const res = await fetch("http://localhost:8080/api/admin/system/health");
        if (res.ok) {
          const data = await res.json();
          setHealth(data);
        }
      } catch (err) {
        console.error("Failed to fetch system health");
      } finally {
        setLoading(false);
      }
    }
    fetchHealth();
  }, []);

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 p-6 md:p-12">
      <div className="max-w-5xl mx-auto">
        <button
          onClick={() => router.push("/")}
          className="flex items-center text-slate-400 hover:text-white mb-6 transition">
          <ArrowLeft className="w-4 h-4 mr-2" /> Back to Home
        </button>

        <h1 className="text-3xl font-extrabold mb-2">Admin Control Center</h1>
        <p className="text-slate-400 mb-8">System observability, Redis lock counts, and infrastructure metrics.</p>

        {loading && <div className="text-slate-500">Querying system metrics...</div>}

        {health && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
              <div className="flex items-center justify-between text-slate-400 mb-2">
                <span className="text-sm font-medium">System Status</span>
                <Activity className="w-5 h-5 text-emerald-400" />
              </div>
              <div className="text-2xl font-bold text-emerald-400">{health.status}</div>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
              <div className="flex items-center justify-between text-slate-400 mb-2">
                <span className="text-sm font-medium">Active Redis Locks</span>
                <Database className="w-5 h-5 text-indigo-400" />
              </div>
              <div className="text-2xl font-bold">{health.activeRedisLocks}</div>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
              <div className="flex items-center justify-between text-slate-400 mb-2">
                <span className="text-sm font-medium">JVM Memory Used</span>
                <Server className="w-5 h-5 text-amber-400" />
              </div>
              <div className="text-2xl font-bold">{health.jvmMemoryUsedMB} MB</div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}

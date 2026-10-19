"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { PlusCircle, TrendingUp, Calendar, ArrowLeft, DollarSign, Ticket } from "lucide-react";

export default function OrganizerDashboard() {
  const router = useRouter();
  const [stats, setStats] = useState({
    activeEvents: 0,
    totalTicketsSold: 0,
    totalRevenue: 0,
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  // Form state
  const [title, setTitle] = useState("");
  const [venueId, setVenueId] = useState(101);
  const [basePrice, setBasePrice] = useState(50);
  const [startTime, setStartTime] = useState("");
  const [sections, setSections] = useState([{ sectionName: "VIP", rowCount: 3, seatsPerRow: 10 }]);

  useEffect(() => {
    async function fetchStats() {
      try {
        const res = await fetch("http://localhost:8080/api/organizer/stats");
        if (res.ok) {
          const data = await res.json();
          setStats(data);
        }
      } catch (err) {
        console.error("Failed to fetch organizer stats", err);
      }
    }
    fetchStats();
  }, []);

  const handleCreateEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSuccess(false);

    try {
      const res = await fetch("http://localhost:8080/api/organizer/events", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          venueId: Number(venueId),
          basePrice: Number(basePrice),
          startTime: startTime ? new Date(startTime).toISOString() : new Date().toISOString(),
          sections,
        }),
      });

      if (!res.ok) throw new Error("Failed to create event");
      setSuccess(true);
      setTitle("");
    } catch (err) {
      alert("Error creating event");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 p-6 md:p-12">
      <div className="max-w-5xl mx-auto">
        <button
          onClick={() => router.push("/")}
          className="flex items-center text-slate-400 hover:text-white mb-6 transition">
          <ArrowLeft className="w-4 h-4 mr-2" /> Back to Home
        </button>

        <h1 className="text-3xl font-extrabold mb-8">Organizer Control Center</h1>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
            <div className="flex items-center justify-between text-slate-400 mb-2">
              <span className="text-sm font-medium">Active Events</span>
              <Calendar className="w-5 h-5 text-indigo-400" />
            </div>
            <div className="text-3xl font-bold">{stats.activeEvents}</div>
          </div>
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
            <div className="flex items-center justify-between text-slate-400 mb-2">
              <span className="text-sm font-medium">Tickets Sold</span>
              <Ticket className="w-5 h-5 text-emerald-400" />
            </div>
            <div className="text-3xl font-bold">{stats.totalTicketsSold}</div>
          </div>
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
            <div className="flex items-center justify-between text-slate-400 mb-2">
              <span className="text-sm font-medium">Total Revenue</span>
              <DollarSign className="w-5 h-5 text-amber-400" />
            </div>
            <div className="text-3xl font-bold">${stats.totalRevenue.toFixed(2)}</div>
          </div>
        </div>

        {/* Create Event Form */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8">
          <h2 className="text-xl font-bold mb-6 flex items-center">
            <PlusCircle className="w-5 h-5 mr-2 text-indigo-500" /> Create New Flash Sale Event
          </h2>

          {success && (
            <div className="bg-emerald-950/50 border border-emerald-800 p-4 rounded-lg mb-6 text-emerald-300 text-sm">
              Event and venue seating successfully generated in PostgreSQL!
            </div>
          )}

          <form onSubmit={handleCreateEvent} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-1">Event Title</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Summer Stadium Tour"
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2.5 text-slate-100 focus:outline-none focus:border-indigo-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-1">Venue ID</label>
                <input
                  type="number"
                  required
                  value={venueId}
                  onChange={(e) => setVenueId(Number(e.target.value))}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2.5 text-slate-100 focus:outline-none focus:border-indigo-500"
                />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-1">Base Price ($)</label>
                <input
                  type="number"
                  step="0.01"
                  required
                  value={basePrice}
                  onChange={(e) => setBasePrice(Number(e.target.value))}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2.5 text-slate-100 focus:outline-none focus:border-indigo-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-1">Start Time</label>
                <input
                  type="datetime-local"
                  required
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2.5 text-slate-100 focus:outline-none focus:border-indigo-500"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-medium py-3 rounded-xl transition mt-6">
              {loading ? "Generating Venue & Event..." : "Launch Event & Generate Seats"}
            </button>
          </form>
        </div>
      </div>
    </main>
  );
}

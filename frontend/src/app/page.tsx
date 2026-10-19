"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Calendar, MapPin, Ticket, ArrowRight, ShieldAlert } from "lucide-react";

interface Event {
  id: number;
  title: string;
  venueId: number;
  basePrice: number;
  startTime: string;
  status: string;
}

export default function LandingPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchEvents() {
      try {
        const res = await fetch("http://localhost:8080/api/events");
        if (!res.ok) throw new Error("Failed to fetch events from backend");
        const data = await res.json();
        setEvents(data);
      } catch (err: any) {
        setError(err.message || "Could not connect to backend server.");
      } finally {
        setLoading(false);
      }
    }
    fetchEvents();
  }, []);

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100">
      <header className="border-b border-slate-800 bg-slate-900/50 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Ticket className="w-6 h-6 text-indigo-500" />
            <span className="font-bold text-lg tracking-tight">ApexSync</span>
          </div>
          <div className="flex items-center space-x-4">
            <Link
              href="/dashboard/organizer"
              className="text-sm font-medium text-slate-400 hover:text-white transition">
              Organizer Portal
            </Link>
            <Link href="/admin" className="text-sm font-medium text-slate-400 hover:text-white transition">
              Admin
            </Link>
          </div>
        </div>
      </header>

      <section className="max-w-7xl mx-auto px-6 py-20 text-center">
        <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-6 bg-linear-to-r from-white via-slate-200 to-indigo-400 bg-clip-text text-transparent">
          High-Concurrency Event Ticketing
        </h1>
        <p className="text-slate-400 text-lg max-w-2xl mx-auto mb-10">
          Engineered for flash sales with real-time distributed seat locking, dynamic pricing, and zero booking
          conflicts.
        </p>
      </section>

      <section className="max-w-7xl mx-auto px-6 pb-24">
        <h2 className="text-2xl font-bold mb-8 border-b border-slate-800 pb-4">Upcoming Flash Sales</h2>

        {loading && <div className="text-center py-12 text-slate-500">Loading active events...</div>}

        {error && (
          <div className="bg-red-950/50 border border-red-800 p-4 rounded-lg flex items-center space-x-3 max-w-xl mx-auto text-red-300">
            <ShieldAlert className="w-5 h-5 shrink-0" />
            <span>{error} (Ensure your Spring Boot backend is running on port 8080).</span>
          </div>
        )}

        {!loading && !error && events.length === 0 && (
          <div className="text-center py-12 text-slate-500">
            No active events found. Create one via the Organizer portal.
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {events.map((event) => (
            <div
              key={event.id}
              className="bg-slate-900 border border-slate-800 rounded-xl p-6 flex flex-col justify-between hover:border-indigo-500/50 transition">
              <div>
                <div className="flex justify-between items-start mb-4">
                  <span className="px-3 py-1 bg-indigo-500/10 text-indigo-400 text-xs font-semibold rounded-full border border-indigo-500/20">
                    {event.status}
                  </span>
                  <span className="text-xl font-bold text-emerald-400">${event.basePrice.toFixed(2)}</span>
                </div>
                <h3 className="text-xl font-semibold mb-2">{event.title}</h3>
                <div className="flex items-center text-slate-400 text-sm mb-2">
                  <MapPin className="w-4 h-4 mr-2 text-slate-500" />
                  Venue ID: {event.venueId}
                </div>
                <div className="flex items-center text-slate-400 text-sm mb-6">
                  <Calendar className="w-4 h-4 mr-2 text-slate-500" />
                  {new Date(event.startTime).toLocaleString()}
                </div>
              </div>

              <Link
                href={`/event/${event.id}`}
                className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-medium py-2.5 rounded-lg flex items-center justify-center space-x-2 transition">
                <span>View Seat Map</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}

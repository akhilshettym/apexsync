"use client";

import { useEffect, useState, Suspense } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, ShieldAlert, CheckCircle2 } from "lucide-react";

interface Seat {
  id: number;
  venueId: number;
  section: string;
  rowNum: string;
  seatNum: string;
}

interface Event {
  id: number;
  title: string;
  venueId: number;
  basePrice: number;
  startTime: string;
  status: string;
}

function SeatMapContent() {
  const params = useParams();
  const router = useRouter();
  const eventId = params.id;

  const [event, setEvent] = useState<Event | null>(null);
  const [seats, setSeats] = useState<Seat[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedSeat, setSelectedSeat] = useState<Seat | null>(null);
  const [locking, setLocking] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    if (!eventId) return;

    async function loadEventData() {
      try {
        const eventRes = await fetch(`http://localhost:8080/api/events`);
        const events: Event[] = await eventRes.json();
        const currentEvent = events.find((e) => e.id === Number(eventId));
        if (!currentEvent) throw new Error("Event not found");
        setEvent(currentEvent);

        const seatsRes = await fetch(`http://localhost:8080/api/events/${eventId}/seats`);
        const seatsData: Seat[] = await seatsRes.json();
        setSeats(seatsData);
      } catch (err: any) {
        setError(err.message || "Failed to load event data");
      } finally {
        setLoading(false);
      }
    }

    loadEventData();
  }, [eventId]);

  const handleLockSeat = async (seat: Seat) => {
    setLocking(true);
    setError(null);
    try {
      const res = await fetch("http://localhost:8080/api/checkout/lock", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          seatId: seat.id,
          eventId: Number(eventId),
          userId: 1,
        }),
      });

      if (!res.ok) {
        const errText = await res.text();
        throw new Error(errText || "Seat is already locked or sold.");
      }

      const reservation = await res.json();
      setSelectedSeat(seat);
      setSuccessMessage(
        `Seat ${seat.section} - Row ${seat.rowNum} Seat ${seat.seatNum} successfully locked for 10 minutes!`,
      );
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLocking(false);
    }
  };

  if (loading)
    return (
      <div className="min-h-screen bg-slate-950 text-slate-400 flex items-center justify-center">
        Loading seat map...
      </div>
    );
  if (error && !event)
    return <div className="min-h-screen bg-slate-950 text-red-400 flex items-center justify-center">{error}</div>;

  const sections = seats.reduce(
    (acc, seat) => {
      if (!acc[seat.section]) acc[seat.section] = [];
      acc[seat.section].push(seat);
      return acc;
    },
    {} as Record<string, Seat[]>,
  );

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 p-6 md:p-12">
      <div className="max-w-6xl mx-auto">
        <button
          onClick={() => router.push("/")}
          className="flex items-center text-slate-400 hover:text-white mb-6 transition">
          <ArrowLeft className="w-4 h-4 mr-2" /> Back to Events
        </button>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold mb-1">{event?.title}</h1>
            <p className="text-slate-400 text-sm">Select an available seat to lock it for 10 minutes.</p>
          </div>
          <div className="text-right">
            <span className="text-sm text-slate-400 block">Base Price</span>
            <span className="text-2xl font-bold text-emerald-400">${event?.basePrice.toFixed(2)}</span>
          </div>
        </div>

        {error && (
          <div className="bg-red-950/50 border border-red-800 p-4 rounded-lg mb-6 flex items-center space-x-3 text-red-300">
            <ShieldAlert className="w-5 h-5 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {successMessage && (
          <div className="bg-emerald-950/50 border border-emerald-800 p-4 rounded-lg mb-6 flex items-center space-x-3 text-emerald-300">
            <CheckCircle2 className="w-5 h-5 shrink-0" />
            <div>
              <p className="font-semibold">{successMessage}</p>
              <p className="text-xs text-emerald-400 mt-1">Proceed to payment before the 10-minute timer expires.</p>
            </div>
          </div>
        )}

        <div className="w-full bg-slate-900 border border-slate-800 rounded-lg py-3 text-center text-xs font-semibold text-slate-500 uppercase tracking-widest mb-10">
          Stage / Screen Front
        </div>

        <div className="space-y-8">
          {Object.entries(sections).map(([sectionName, sectionSeats]) => (
            <div key={sectionName} className="bg-slate-900/50 border border-slate-800 rounded-xl p-6">
              <h3 className="text-lg font-semibold mb-4 text-indigo-400">{sectionName}</h3>
              <div className="grid grid-cols-5 sm:grid-cols-10 gap-2">
                {sectionSeats.map((seat) => {
                  const isSelected = selectedSeat?.id === seat.id;
                  return (
                    <button
                      key={seat.id}
                      disabled={locking || isSelected}
                      onClick={() => handleLockSeat(seat)}
                      className={`p-2 rounded text-xs font-medium transition flex flex-col items-center justify-center border ${
                        isSelected
                          ? "bg-amber-500 border-amber-400 text-slate-950 font-bold"
                          : "bg-slate-800 border-slate-700 hover:bg-indigo-600 hover:border-indigo-500 text-slate-200"
                      }`}>
                      <span>
                        {seat.rowNum}
                        {seat.seatNum}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}

export default function SeatMapPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-slate-950 text-slate-400 flex items-center justify-center">
          Loading interactive seat map...
        </div>
      }>
      <SeatMapContent />
    </Suspense>
  );
}

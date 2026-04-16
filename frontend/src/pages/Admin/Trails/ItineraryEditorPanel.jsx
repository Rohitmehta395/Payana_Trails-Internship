import React, { useCallback, useEffect, useState } from "react";
import {
  CalendarDays,
  Check,
  ChevronDown,
  ChevronUp,
  Clock,
  Hotel,
  Loader2,
  Plane,
  Plus,
  Sparkles,
  Trash2,
  UtensilsCrossed,
  X,
} from "lucide-react";
import { useAutoSave } from "../../../hooks/useAutoSave";

const createClientId = () => {
  if (typeof crypto !== "undefined" && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
};

const createEditableDay = (day = {}) => ({
  id: createClientId(),
  title: typeof day.title === "string" ? day.title : "",
  points:
    Array.isArray(day.points) && day.points.length > 0
      ? day.points.map((point) => (typeof point === "string" ? point : ""))
      : [""],
  accommodation: typeof day.accommodation === "string" ? day.accommodation : "",
  meals: typeof day.meals === "string" ? day.meals : "",
});

const normalizePersistedDays = (rawDays = []) =>
  rawDays
    .map((day) => ({
      title: typeof day?.title === "string" ? day.title.trim() : "",
      points: Array.isArray(day?.points)
        ? day.points
            .map((point) => (typeof point === "string" ? point.trim() : ""))
            .filter(Boolean)
        : [],
      accommodation:
        typeof day?.accommodation === "string" ? day.accommodation.trim() : "",
      meals: typeof day?.meals === "string" ? day.meals.trim() : "",
    }))
    .filter(
      (day) =>
        day.title || day.points.length > 0 || day.accommodation || day.meals,
    );

const buildEditableDays = (trail) => {
  const draftDays =
    Array.isArray(trail.itineraryDraft) && trail.itineraryDraft.length > 0
      ? trail.itineraryDraft
      : null;
  const sourceDays = draftDays || trail.itinerary || [];
  return sourceDays.map((day) => createEditableDay(day));
};

const buildEmptyFlights = () => ({
  domesticIntro: "",
  domesticLines: ["", "", "", ""],
  internationalIntro: "",
  arrivalAirport: "",
  arrivalOptions: ["", "", "", ""],
  departureAirport: "",
  departureOptions: ["", "", "", ""],
});

const initFlights = (trail) => {
  const f = trail.flights || {};
  const pad = (arr, len) => {
    const base = Array.isArray(arr) ? arr.map((s) => s || "") : [];
    while (base.length < len) base.push("");
    return base.slice(0, len);
  };
  return {
    domesticIntro: typeof f.domesticIntro === "string" ? f.domesticIntro : "",
    domesticLines: pad(f.domesticLines, 4),
    internationalIntro:
      typeof f.internationalIntro === "string" ? f.internationalIntro : "",
    arrivalAirport:
      typeof f.arrivalAirport === "string" ? f.arrivalAirport : "",
    arrivalOptions: pad(f.arrivalOptions, 4),
    departureAirport:
      typeof f.departureAirport === "string" ? f.departureAirport : "",
    departureOptions: pad(f.departureOptions, 4),
  };
};

const initOptionalExperiences = (trail) => {
  const arr = Array.isArray(trail.optionalExperiences)
    ? trail.optionalExperiences.map((s) => s || "")
    : [];
  while (arr.length < 6) arr.push("");
  return arr.slice(0, 6);
};

const areDaysDifferent = (left = [], right = []) =>
  JSON.stringify(normalizePersistedDays(left)) !==
  JSON.stringify(normalizePersistedDays(right));

// ─── Character Counter ─────────────────────────────────────────────────────
const CharCount = ({ value, max }) => {
  const len = (value || "").length;
  const over = len > max;
  return (
    <span
      className={`text-[10px] font-medium tabular-nums ${over ? "text-red-500" : "text-stone-400"}`}
    >
      {len}/{max}
    </span>
  );
};

// ─── Section Toggle Header ──────────────────────────────────────────────────
const SectionHeader = ({
  icon: Icon,
  title,
  subtitle,
  isOpen,
  onToggle,
  accentClass = "bg-[#4A3B2A]/8 text-[#4A3B2A]",
}) => (
  <button
    type="button"
    onClick={onToggle}
    className="flex w-full items-center justify-between gap-3 px-5 py-4 text-left transition hover:bg-stone-50/60"
  >
    <div className="flex items-center gap-3">
      <div
        className={`flex h-9 w-9 items-center justify-center rounded-xl ${accentClass}`}
      >
        <Icon size={16} />
      </div>
      <div>
        <p className="text-sm font-semibold text-stone-900">{title}</p>
        {subtitle && (
          <p className="text-[11px] text-stone-400 mt-0.5">{subtitle}</p>
        )}
      </div>
    </div>
    {isOpen ? (
      <ChevronUp size={16} className="text-stone-400 flex-shrink-0" />
    ) : (
      <ChevronDown size={16} className="text-stone-400 flex-shrink-0" />
    )}
  </button>
);

// ─── Main Component ──────────────────────────────────────────────────────────
const ItineraryEditorPanel = ({ trail, onSave, onAutoSave, onClose }) => {
  const [days, setDays] = useState(() => buildEditableDays(trail));
  const [optionalExperiences, setOptionalExperiences] = useState(() =>
    initOptionalExperiences(trail),
  );
  const [flights, setFlights] = useState(() => initFlights(trail));

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [collapsed, setCollapsed] = useState({});
  const [savedType, setSavedType] = useState(null);
  const [showOptional, setShowOptional] = useState(false);
  const [showFlights, setShowFlights] = useState(false);
  const [showDomestic, setShowDomestic] = useState(true);
  const [showInternational, setShowInternational] = useState(true);

  useEffect(() => {
    setDays(buildEditableDays(trail));
    setOptionalExperiences(initOptionalExperiences(trail));
    setFlights(initFlights(trail));
    setCollapsed({});
    setError("");
    setSavedType(null);
  }, [trail._id]);

  const persistedDraft = normalizePersistedDays(trail.itineraryDraft || []);
  const persistedLive = normalizePersistedDays(trail.itinerary || []);
  const hasServerDraft = areDaysDifferent(persistedDraft, persistedLive);
  const cleanDays = normalizePersistedDays(days);

  // Clean optional experiences — trim, keep up to 4, filter blanks before send
  const cleanOptionalExperiences = optionalExperiences.map((s) => s.trim());
  // Clean flights — trim all strings
  const cleanFlights = {
    domesticIntro: flights.domesticIntro.trim(),
    domesticLines: flights.domesticLines.map((s) => s.trim()),
    internationalIntro: flights.internationalIntro.trim(),
    arrivalAirport: flights.arrivalAirport.trim(),
    arrivalOptions: flights.arrivalOptions.map((s) => s.trim()),
    departureAirport: flights.departureAirport.trim(),
    departureOptions: flights.departureOptions.map((s) => s.trim()),
  };

  const autoSaveFn = useCallback(async () => {
    await onAutoSave(
      trail._id,
      cleanDays,
      cleanOptionalExperiences,
      cleanFlights,
    );
    setSavedType("draft");
    setError("");
  }, [
    cleanDays,
    cleanOptionalExperiences,
    cleanFlights,
    onAutoSave,
    trail._id,
  ]);

  const { isSaving: isAutoSaving, lastSaved } = useAutoSave(
    { days, optionalExperiences, flights },
    autoSaveFn,
    3000,
  );

  // ── Day handlers ─────────────────────────────────────────────────────────
  const addDay = () => {
    const nextDay = createEditableDay();
    setDays((prev) => [...prev, nextDay]);
    setCollapsed((prev) => ({ ...prev, [nextDay.id]: false }));
  };
  const removeDay = (dayId) => {
    setDays((prev) => prev.filter((day) => day.id !== dayId));
    setCollapsed((prev) => {
      const next = { ...prev };
      delete next[dayId];
      return next;
    });
  };
  const moveDay = (index, direction) => {
    setDays((prev) => {
      const targetIndex = index + direction;
      if (targetIndex < 0 || targetIndex >= prev.length) return prev;
      const next = [...prev];
      [next[index], next[targetIndex]] = [next[targetIndex], next[index]];
      return next;
    });
  };
  const toggleCollapse = (dayId) =>
    setCollapsed((prev) => {
      const currentState = prev[dayId] ?? true;
      return { ...prev, [dayId]: !currentState };
    });
  const updateDayField = (dayId, field, value) =>
    setDays((prev) =>
      prev.map((day) => (day.id === dayId ? { ...day, [field]: value } : day)),
    );
  const updatePoint = (dayId, pointIndex, value) =>
    setDays((prev) =>
      prev.map((day) => {
        if (day.id !== dayId) return day;
        const points = [...day.points];
        points[pointIndex] = value;
        return { ...day, points };
      }),
    );
  const addPoint = (dayId) =>
    setDays((prev) =>
      prev.map((day) =>
        day.id === dayId ? { ...day, points: [...day.points, ""] } : day,
      ),
    );
  const removePoint = (dayId, pointIndex) =>
    setDays((prev) =>
      prev.map((day) => {
        if (day.id !== dayId) return day;
        const nextPoints = day.points.filter(
          (_, index) => index !== pointIndex,
        );
        return { ...day, points: nextPoints.length > 0 ? nextPoints : [""] };
      }),
    );

  // ── Optional experience handlers ─────────────────────────────────────────
  const updateOptionalExperience = (index, value) =>
    setOptionalExperiences((prev) => {
      const next = [...prev];
      next[index] = value.slice(0, 300);
      return next;
    });

  // ── Flights handlers ─────────────────────────────────────────────────────
  const updateFlightField = (field, value) =>
    setFlights((prev) => ({
      ...prev,
      [field]: typeof value === "string" ? value.slice(0, 200) : value,
    }));
  const updateFlightArrayItem = (field, index, value) =>
    setFlights((prev) => {
      const arr = [...prev[field]];
      arr[index] = value.slice(0, 200);
      return { ...prev, [field]: arr };
    });

  // ── Manual save ──────────────────────────────────────────────────────────
  const handleSave = async () => {
    setSaving(true);
    setError("");
    try {
      await onSave(
        trail._id,
        cleanDays,
        cleanOptionalExperiences,
        cleanFlights,
      );
      setSavedType("saved");
      onClose();
    } catch (err) {
      setError(err.message || "Failed to save itinerary.");
    } finally {
      setSaving(false);
    }
  };

  const inputClassName =
    "w-full rounded-xl border border-stone-200 bg-white px-3 py-2.5 text-sm text-stone-700 placeholder:text-stone-400 focus:border-[#4A3B2A] focus:outline-none focus:ring-2 focus:ring-[#4A3B2A]/15";
  const textareaClassName =
    "w-full rounded-xl border border-stone-200 bg-white px-3 py-2.5 text-sm text-stone-700 placeholder:text-stone-400 focus:border-[#4A3B2A] focus:outline-none focus:ring-2 focus:ring-[#4A3B2A]/15 resize-none leading-relaxed";

  return (
    <div className="overflow-hidden rounded-[28px] border border-stone-200 bg-white shadow-[0_24px_60px_rgba(74,59,42,0.12)]">
      {/* ── Header ─────────────────────────────────────────────────────────── */}
      <div className="border-b border-white/10 bg-[linear-gradient(135deg,#3c2d1f_0%,#5f4736_52%,#7a5d49_100%)] px-6 py-5 text-white">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-white/15 bg-white/10">
                <CalendarDays size={18} />
              </div>
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-white/65">
                  Itinerary Workspace
                </p>
                <h3 className="text-lg font-semibold text-white">
                  {trail.trailName}
                </h3>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2 text-xs">
              <span className="rounded-full border border-white/15 bg-white/10 px-3 py-1.5 font-semibold text-white/90">
                {cleanDays.length} saved day{cleanDays.length === 1 ? "" : "s"}
              </span>
              <span
                className={`rounded-full border px-3 py-1.5 font-semibold ${
                  trail.status === "published"
                    ? "border-emerald-300/30 bg-emerald-400/10 text-emerald-100"
                    : "border-amber-300/30 bg-amber-400/10 text-amber-100"
                }`}
              >
                {trail.status === "published" ? "Live trail" : "Draft trail"}
              </span>
              {hasServerDraft && (
                <span className="rounded-full border border-amber-300/30 bg-amber-400/10 px-3 py-1.5 font-semibold text-amber-100">
                  Draft changes loaded
                </span>
              )}
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 lg:justify-end">
            <div className="flex min-w-[170px] items-center justify-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-2 text-xs font-semibold">
              {isAutoSaving ? (
                <>
                  <Loader2 size={13} className="animate-spin text-amber-200" />
                  <span className="text-amber-100">Saving draft...</span>
                </>
              ) : lastSaved ? (
                <>
                  <Check
                    size={13}
                    className={
                      savedType === "saved"
                        ? "text-emerald-200"
                        : "text-amber-200"
                    }
                  />
                  <span
                    className={
                      savedType === "saved"
                        ? "text-emerald-100"
                        : "text-amber-100"
                    }
                  >
                    {savedType === "saved" ? "Saved" : "Draft"} at{" "}
                    {lastSaved.toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                </>
              ) : (
                <span className="text-white/75">Draft autosave is active</span>
              )}
            </div>

            <button
              type="button"
              onClick={onClose}
              className="inline-flex h-10 w-10 items-center justify-center rounded-2xl border border-white/15 bg-white/10 text-white/80 transition hover:bg-white/15 hover:text-white"
              title="Close editor"
            >
              <X size={16} />
            </button>
          </div>
        </div>
      </div>

      {/* ── Hint bar ────────────────────────────────────────────────────────── */}
      <div className="border-b border-stone-200 bg-stone-50 px-6 py-3">
        <div className="flex flex-col gap-2 text-sm text-stone-600 md:flex-row md:items-center md:justify-between">
          <p>
            Autosave stores an admin draft. Use{" "}
            <span className="font-semibold text-stone-900">
              {trail.status === "published"
                ? "Apply to Live Itinerary"
                : "Save Itinerary"}
            </span>{" "}
            when you want this version to become the official itinerary.
          </p>
          {trail.status === "published" && (
            <span className="rounded-full border border-stone-200 bg-white px-3 py-1 text-xs font-semibold text-stone-700">
              Live version currently has {persistedLive.length} day
              {persistedLive.length === 1 ? "" : "s"}
            </span>
          )}
        </div>
      </div>

      {/* ── Scrollable body ──────────────────────────────────────────────────── */}
      <div className="max-h-[68vh] overflow-y-auto bg-[linear-gradient(180deg,#fcfbf8_0%,#f8f5f1_100%)] p-5 space-y-4">
        {/* ════════ DAY CARDS ════════ */}
        {days.length === 0 ? (
          <div className="rounded-[26px] border border-dashed border-stone-300 bg-white/90 px-6 py-10 text-center shadow-sm">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#4A3B2A]/8 text-[#4A3B2A]">
              <CalendarDays size={22} />
            </div>
            <h4 className="mt-4 text-base font-semibold text-stone-900">
              No itinerary days yet
            </h4>
            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-stone-500">
              Start with the arrival day, a transfer, or the biggest highlight
              of the trail.
            </p>
            <button
              type="button"
              onClick={addDay}
              className="mt-5 inline-flex items-center gap-2 rounded-full bg-[#4A3B2A] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#382a1e]"
            >
              <Plus size={15} />
              Add first day
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {days.map((day, index) => {
              const isCollapsed = collapsed[day.id] ?? true;
              const filledPointCount = day.points.filter((point) =>
                point.trim(),
              ).length;

              return (
                <section
                  key={day.id}
                  className="overflow-hidden rounded-[24px] border border-stone-200 bg-white shadow-[0_14px_34px_rgba(30,25,20,0.06)]"
                >
                  <div className="flex flex-col gap-4 border-b border-stone-100 px-4 py-4 sm:flex-row sm:items-center">
                    <button
                      type="button"
                      onClick={() => toggleCollapse(day.id)}
                      className="flex flex-1 items-center gap-3 text-left"
                    >
                      <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[linear-gradient(135deg,#4A3B2A_0%,#6b5240_100%)] text-sm font-bold text-white shadow-sm">
                        {index + 1}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-stone-400">
                          Day {index + 1}
                        </p>
                        <p
                          className={`truncate text-sm ${day.title.trim() ? "font-semibold text-stone-900" : "italic text-stone-400"}`}
                        >
                          {day.title.trim() || "Untitled day"}
                        </p>
                      </div>
                    </button>

                    <div className="flex flex-wrap items-center gap-2 sm:justify-end">
                      {filledPointCount > 0 && (
                        <span className="rounded-full bg-stone-100 px-2.5 py-1 text-[11px] font-semibold text-stone-700">
                          {filledPointCount} point
                          {filledPointCount === 1 ? "" : "s"}
                        </span>
                      )}
                      {day.accommodation.trim() && (
                        <span className="inline-flex items-center gap-1 rounded-full bg-blue-50 px-2.5 py-1 text-[11px] font-semibold text-blue-700">
                          <Hotel size={11} /> Stay
                        </span>
                      )}
                      {day.meals.trim() && (
                        <span className="inline-flex items-center gap-1 rounded-full bg-orange-50 px-2.5 py-1 text-[11px] font-semibold text-orange-700">
                          <UtensilsCrossed size={11} /> Meals
                        </span>
                      )}

                      <div className="ml-auto flex items-center gap-1 sm:ml-0">
                        <button
                          type="button"
                          onClick={() => moveDay(index, -1)}
                          disabled={index === 0}
                          className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-stone-200 text-stone-500 transition hover:bg-stone-50 hover:text-stone-900 disabled:cursor-not-allowed disabled:opacity-35"
                          title="Move day up"
                        >
                          <ChevronUp size={16} />
                        </button>
                        <button
                          type="button"
                          onClick={() => moveDay(index, 1)}
                          disabled={index === days.length - 1}
                          className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-stone-200 text-stone-500 transition hover:bg-stone-50 hover:text-stone-900 disabled:cursor-not-allowed disabled:opacity-35"
                          title="Move day down"
                        >
                          <ChevronDown size={16} />
                        </button>
                        <button
                          type="button"
                          onClick={() => removeDay(day.id)}
                          className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-red-200 text-red-500 transition hover:bg-red-50 hover:text-red-700"
                          title="Delete this day"
                        >
                          <Trash2 size={15} />
                        </button>
                        <button
                          type="button"
                          onClick={() => toggleCollapse(day.id)}
                          className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-stone-200 text-stone-500 transition hover:bg-stone-50 hover:text-stone-900"
                          title={isCollapsed ? "Expand day" : "Collapse day"}
                        >
                          {isCollapsed ? (
                            <ChevronDown size={16} />
                          ) : (
                            <ChevronUp size={16} />
                          )}
                        </button>
                      </div>
                    </div>
                  </div>

                  {!isCollapsed && (
                    <div className="space-y-5 px-4 pb-5 pt-4">
                      <div>
                        <label className="mb-1.5 block text-xs font-semibold uppercase tracking-[0.18em] text-stone-500">
                          Day title
                        </label>
                        <input
                          type="text"
                          value={day.title}
                          onChange={(e) =>
                            updateDayField(day.id, "title", e.target.value)
                          }
                          placeholder="Arrive, settle in, and start the first experience"
                          className={inputClassName}
                        />
                      </div>

                      <div>
                        <div className="mb-2 flex items-center justify-between gap-3">
                          <label className="block text-xs font-semibold uppercase tracking-[0.18em] text-stone-500">
                            Activity points
                          </label>
                          <button
                            type="button"
                            onClick={() => addPoint(day.id)}
                            className="inline-flex items-center gap-1 text-xs font-semibold text-[#4A3B2A] transition hover:text-[#382a1e]"
                          >
                            <Plus size={13} /> Add point
                          </button>
                        </div>
                        <div className="space-y-2.5">
                          {day.points.map((point, pointIndex) => (
                            <div
                              key={`${day.id}-point-${pointIndex}`}
                              className="flex items-center gap-2"
                            >
                              <div className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-[#4A3B2A]/8 text-[11px] font-semibold text-[#4A3B2A]">
                                {pointIndex + 1}
                              </div>
                              <input
                                type="text"
                                value={point}
                                onChange={(e) =>
                                  updatePoint(
                                    day.id,
                                    pointIndex,
                                    e.target.value,
                                  )
                                }
                                placeholder={`Highlight ${pointIndex + 1}`}
                                className={`${inputClassName} flex-1`}
                              />
                              {day.points.length > 1 && (
                                <button
                                  type="button"
                                  onClick={() =>
                                    removePoint(day.id, pointIndex)
                                  }
                                  className="inline-flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl border border-red-200 text-red-500 transition hover:bg-red-50 hover:text-red-700"
                                  title="Remove point"
                                >
                                  <X size={15} />
                                </button>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="grid gap-4 md:grid-cols-2">
                        <div>
                          <label className="mb-1.5 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-[0.18em] text-stone-500">
                            <Hotel size={12} className="text-blue-500" />{" "}
                            Accommodation
                          </label>
                          <input
                            type="text"
                            value={day.accommodation}
                            onChange={(e) =>
                              updateDayField(
                                day.id,
                                "accommodation",
                                e.target.value,
                              )
                            }
                            placeholder="Forest lodge, tented camp, heritage stay"
                            className={inputClassName}
                          />
                        </div>
                        <div>
                          <label className="mb-1.5 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-[0.18em] text-stone-500">
                            <UtensilsCrossed
                              size={12}
                              className="text-orange-500"
                            />{" "}
                            Meals
                          </label>
                          <input
                            type="text"
                            value={day.meals}
                            onChange={(e) =>
                              updateDayField(day.id, "meals", e.target.value)
                            }
                            placeholder="Breakfast, lunch, dinner"
                            className={inputClassName}
                          />
                        </div>
                      </div>
                    </div>
                  )}
                </section>
              );
            })}

            <button
              type="button"
              onClick={addDay}
              className="flex w-full items-center justify-center gap-2 rounded-[24px] border border-dashed border-[#4A3B2A]/25 bg-white/85 px-4 py-4 text-sm font-semibold text-[#4A3B2A] transition hover:border-[#4A3B2A]/45 hover:bg-[#4A3B2A]/5"
            >
              <Plus size={15} /> Add another day
            </button>
          </div>
        )}

        {/* ════════ OPTIONAL EXPERIENCES & JOURNEY ENHANCEMENTS ════════ */}
        <div className="overflow-hidden rounded-[24px] border border-stone-200 bg-white shadow-[0_14px_34px_rgba(30,25,20,0.06)]">
          <SectionHeader
            icon={Sparkles}
            title="Suggested Optional Experiences & Journey Enhancements"
            subtitle="Up to 6 lines · 300 characters each"
            isOpen={showOptional}
            onToggle={() => setShowOptional((v) => !v)}
            accentClass="bg-amber-50 text-amber-700"
          />

          {showOptional && (
            <div className="space-y-3 border-t border-stone-100 px-5 pb-5 pt-4">
              <p className="text-[11px] text-stone-400 leading-relaxed">
                Each line can mention the{" "}
                <span className="font-semibold text-stone-600">
                  Day · Location · Experience · Included / Excluded
                </span>
              </p>
              {optionalExperiences.map((line, idx) => (
                <div key={idx}>
                  <div className="mb-1 flex items-center justify-between">
                    <label className="text-xs font-semibold uppercase tracking-[0.16em] text-stone-400">
                      Line {idx + 1}
                    </label>
                    <CharCount value={line} max={300} />
                  </div>
                  <textarea
                    rows={2}
                    value={line}
                    maxLength={300}
                    onChange={(e) =>
                      updateOptionalExperience(idx, e.target.value)
                    }
                    placeholder={`e.g. Day ${idx + 1} · Kaziranga · Elephant Safari · Excluded`}
                    className={textareaClassName}
                  />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* ════════ FLIGHTS ════════ */}
        <div className="overflow-hidden rounded-[24px] border border-stone-200 bg-white shadow-[0_14px_34px_rgba(30,25,20,0.06)]">
          <SectionHeader
            icon={Plane}
            title="Voyages"
            subtitle="Domestic & International flight details"
            isOpen={showFlights}
            onToggle={() => setShowFlights((v) => !v)}
            accentClass="bg-sky-50 text-sky-700"
          />

          {showFlights && (
            <div className="space-y-0 border-t border-stone-100">
              {/* ── Domestic Flights ── */}
              <div className="border-b border-stone-100">
                <button
                  type="button"
                  onClick={() => setShowDomestic((v) => !v)}
                  className="flex w-full items-center justify-between gap-3 bg-stone-50/70 px-5 py-3 text-left transition hover:bg-stone-100/60"
                >
                  <span className="text-xs font-semibold uppercase tracking-[0.18em] text-stone-600">
                    a. DOMESTIC FLIGHTS · TRAINS · CRUISES
                  </span>
                  {showDomestic ? (
                    <ChevronUp size={14} className="text-stone-400" />
                  ) : (
                    <ChevronDown size={14} className="text-stone-400" />
                  )}
                </button>

                {showDomestic && (
                  <div className="space-y-4 px-5 pb-5 pt-4">
                    {/* Intro line */}
                    <div>
                      <div className="mb-1 flex items-center justify-between">
                        <label className="text-xs font-semibold uppercase tracking-[0.16em] text-stone-400">
                          Intro note
                        </label>
                        <CharCount value={flights.domesticIntro} max={200} />
                      </div>
                      <textarea
                        rows={2}
                        value={flights.domesticIntro}
                        maxLength={200}
                        onChange={(e) =>
                          updateFlightField("domesticIntro", e.target.value)
                        }
                        placeholder="(Included as part of your curated journey)"
                        className={textareaClassName}
                      />
                    </div>

                    {/* 4 route lines */}
                    <div className="space-y-3">
                      <p className="text-[11px] text-stone-400">
                        Each line:{" "}
                        <span className="font-semibold text-stone-600">
                          Day · Departure Location · Arrival Location
                        </span>
                      </p>
                      {flights.domesticLines.map((line, idx) => (
                        <div key={idx}>
                          <div className="mb-1 flex items-center justify-between">
                            <label className="text-xs font-semibold uppercase tracking-[0.16em] text-stone-400">
                              Line {idx + 1}
                            </label>
                            <CharCount value={line} max={200} />
                          </div>
                          <input
                            type="text"
                            value={line}
                            maxLength={200}
                            onChange={(e) =>
                              updateFlightArrayItem(
                                "domesticLines",
                                idx,
                                e.target.value,
                              )
                            }
                            placeholder={`e.g. Day ${idx + 1} · Guwahati · Dibrugarh`}
                            className={inputClassName}
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* ── International Flights ── */}
              <div>
                <button
                  type="button"
                  onClick={() => setShowInternational((v) => !v)}
                  className="flex w-full items-center justify-between gap-3 bg-stone-50/70 px-5 py-3 text-left transition hover:bg-stone-100/60"
                >
                  <span className="text-xs font-semibold uppercase tracking-[0.18em] text-stone-600">
                    b. International Flights
                  </span>
                  {showInternational ? (
                    <ChevronUp size={14} className="text-stone-400" />
                  ) : (
                    <ChevronDown size={14} className="text-stone-400" />
                  )}
                </button>

                {showInternational && (
                  <div className="space-y-5 px-5 pb-5 pt-4">
                    {/* Intro */}
                    <div>
                      <div className="mb-1 flex items-center justify-between">
                        <label className="text-xs font-semibold uppercase tracking-[0.16em] text-stone-400">
                          Intro note
                        </label>
                        <CharCount
                          value={flights.internationalIntro}
                          max={200}
                        />
                      </div>
                      <textarea
                        rows={2}
                        value={flights.internationalIntro}
                        maxLength={200}
                        onChange={(e) =>
                          updateFlightField(
                            "internationalIntro",
                            e.target.value,
                          )
                        }
                        placeholder="(Not included; personalised assistance provided for booking)"
                        className={textareaClassName}
                      />
                    </div>

                    {/* Arrival */}
                    <div className="rounded-2xl border border-stone-200 bg-stone-50/50 p-4 space-y-3">
                      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-stone-600">
                        Arrival
                      </p>
                      <div>
                        <div className="mb-1 flex items-center justify-between">
                          <label className="text-[11px] font-semibold text-stone-400">
                            Airport name
                          </label>
                          <CharCount value={flights.arrivalAirport} max={200} />
                        </div>
                        <input
                          type="text"
                          value={flights.arrivalAirport}
                          maxLength={200}
                          onChange={(e) =>
                            updateFlightField("arrivalAirport", e.target.value)
                          }
                          placeholder="e.g. Indira Gandhi International Airport, New Delhi"
                          className={inputClassName}
                        />
                      </div>
                      <div className="space-y-2.5">
                        <p className="text-[11px] text-stone-400">
                          Options (up to 4)
                        </p>
                        {flights.arrivalOptions.map((opt, idx) => (
                          <div key={idx}>
                            <div className="mb-1 flex items-center justify-between">
                              <label className="text-[11px] font-semibold text-stone-400">
                                Option {idx + 1}
                              </label>
                              <CharCount value={opt} max={200} />
                            </div>
                            <input
                              type="text"
                              value={opt}
                              maxLength={200}
                              onChange={(e) =>
                                updateFlightArrayItem(
                                  "arrivalOptions",
                                  idx,
                                  e.target.value,
                                )
                              }
                              placeholder={`Option ${idx + 1}: e.g. Direct flight from London Heathrow`}
                              className={inputClassName}
                            />
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Departure */}
                    <div className="rounded-2xl border border-stone-200 bg-stone-50/50 p-4 space-y-3">
                      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-stone-600">
                        Departure
                      </p>
                      <div>
                        <div className="mb-1 flex items-center justify-between">
                          <label className="text-[11px] font-semibold text-stone-400">
                            Airport name
                          </label>
                          <CharCount
                            value={flights.departureAirport}
                            max={200}
                          />
                        </div>
                        <input
                          type="text"
                          value={flights.departureAirport}
                          maxLength={200}
                          onChange={(e) =>
                            updateFlightField(
                              "departureAirport",
                              e.target.value,
                            )
                          }
                          placeholder="e.g. Chhatrapati Shivaji Maharaj International Airport, Mumbai"
                          className={inputClassName}
                        />
                      </div>
                      <div className="space-y-2.5">
                        <p className="text-[11px] text-stone-400">
                          Options (up to 4)
                        </p>
                        {flights.departureOptions.map((opt, idx) => (
                          <div key={idx}>
                            <div className="mb-1 flex items-center justify-between">
                              <label className="text-[11px] font-semibold text-stone-400">
                                Option {idx + 1}
                              </label>
                              <CharCount value={opt} max={200} />
                            </div>
                            <input
                              type="text"
                              value={opt}
                              maxLength={200}
                              onChange={(e) =>
                                updateFlightArrayItem(
                                  "departureOptions",
                                  idx,
                                  e.target.value,
                                )
                              }
                              placeholder={`Option ${idx + 1}: e.g. Connecting via Dubai to London Heathrow`}
                              className={inputClassName}
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ── Error ──────────────────────────────────────────────────────────────── */}
      {error && (
        <div className="border-t border-red-200 bg-red-50 px-6 py-3 text-sm font-medium text-red-700">
          {error}
        </div>
      )}

      {/* ── Footer ─────────────────────────────────────────────────────────────── */}
      <div className="flex flex-col gap-3 border-t border-stone-200 bg-white px-6 py-4 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-2 text-xs text-stone-500">
          <Clock size={13} />
          {isAutoSaving ? (
            <span className="font-medium text-amber-700">Saving draft...</span>
          ) : lastSaved ? (
            <span className="font-medium text-stone-700">
              {savedType === "saved" ? "Saved" : "Draft saved"} at{" "}
              {lastSaved.toLocaleTimeString()}
            </span>
          ) : (
            <span>Draft changes are saved automatically while you edit.</span>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={onClose}
            className="rounded-full bg-stone-100 px-4 py-2 text-sm font-medium text-stone-700 transition hover:bg-stone-200"
          >
            Close
          </button>
          <button
            type="button"
            onClick={handleSave}
            disabled={saving || isAutoSaving}
            className="inline-flex items-center gap-2 rounded-full bg-[#4A3B2A] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#382a1e] disabled:cursor-not-allowed disabled:opacity-55"
          >
            {saving ? (
              <>
                <Loader2 size={14} className="animate-spin" /> Saving...
              </>
            ) : (
              <>
                <Check size={14} />
                {trail.status === "published"
                  ? "Apply to Live Itinerary"
                  : "Save Itinerary"}
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ItineraryEditorPanel;

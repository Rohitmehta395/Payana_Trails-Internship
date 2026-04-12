import React, { useCallback, useEffect, useState } from "react";
import {
  CalendarDays,
  Check,
  ChevronDown,
  ChevronUp,
  Clock,
  Hotel,
  Loader2,
  Plus,
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
  accommodation:
    typeof day.accommodation === "string" ? day.accommodation : "",
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
        day.title ||
        day.points.length > 0 ||
        day.accommodation ||
        day.meals,
    );

const buildEditableDays = (trail) => {
  const draftDays =
    Array.isArray(trail.itineraryDraft) && trail.itineraryDraft.length > 0
      ? trail.itineraryDraft
      : null;
  const sourceDays = draftDays || trail.itinerary || [];

  return sourceDays.map((day) => createEditableDay(day));
};

const areDaysDifferent = (left = [], right = []) =>
  JSON.stringify(normalizePersistedDays(left)) !==
  JSON.stringify(normalizePersistedDays(right));

const ItineraryEditorPanel = ({ trail, onSave, onAutoSave, onClose }) => {
  const [days, setDays] = useState(() => buildEditableDays(trail));
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [collapsed, setCollapsed] = useState({});
  const [savedType, setSavedType] = useState(null);

  useEffect(() => {
    setDays(buildEditableDays(trail));
    setCollapsed({});
    setError("");
    setSavedType(null);
  }, [trail._id]);

  const persistedDraft = normalizePersistedDays(trail.itineraryDraft || []);
  const persistedLive = normalizePersistedDays(trail.itinerary || []);
  const hasServerDraft = areDaysDifferent(persistedDraft, persistedLive);
  const cleanDays = normalizePersistedDays(days);

  const autoSaveFn = useCallback(async () => {
    await onAutoSave(trail._id, cleanDays);
    setSavedType("draft");
    setError("");
  }, [cleanDays, onAutoSave, trail._id]);

  const { isSaving: isAutoSaving, lastSaved } = useAutoSave(
    days,
    autoSaveFn,
    3000,
  );

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

  const toggleCollapse = (dayId) => {
    setCollapsed((prev) => ({ ...prev, [dayId]: !prev[dayId] }));
  };

  const updateDayField = (dayId, field, value) => {
    setDays((prev) =>
      prev.map((day) => (day.id === dayId ? { ...day, [field]: value } : day)),
    );
  };

  const updatePoint = (dayId, pointIndex, value) => {
    setDays((prev) =>
      prev.map((day) => {
        if (day.id !== dayId) return day;

        const points = [...day.points];
        points[pointIndex] = value;
        return { ...day, points };
      }),
    );
  };

  const addPoint = (dayId) => {
    setDays((prev) =>
      prev.map((day) =>
        day.id === dayId ? { ...day, points: [...day.points, ""] } : day,
      ),
    );
  };

  const removePoint = (dayId, pointIndex) => {
    setDays((prev) =>
      prev.map((day) => {
        if (day.id !== dayId) return day;

        const nextPoints = day.points.filter((_, index) => index !== pointIndex);
        return { ...day, points: nextPoints.length > 0 ? nextPoints : [""] };
      }),
    );
  };

  const handleSave = async () => {
    setSaving(true);
    setError("");

    try {
      await onSave(trail._id, cleanDays);
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

  return (
    <div className="overflow-hidden rounded-[28px] border border-stone-200 bg-white shadow-[0_24px_60px_rgba(74,59,42,0.12)]">
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
                      savedType === "saved" ? "text-emerald-200" : "text-amber-200"
                    }
                  />
                  <span
                    className={
                      savedType === "saved" ? "text-emerald-100" : "text-amber-100"
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

      <div className="max-h-[68vh] overflow-y-auto bg-[linear-gradient(180deg,#fcfbf8_0%,#f8f5f1_100%)] p-5">
        {days.length === 0 ? (
          <div className="rounded-[26px] border border-dashed border-stone-300 bg-white/90 px-6 py-10 text-center shadow-sm">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#4A3B2A]/8 text-[#4A3B2A]">
              <CalendarDays size={22} />
            </div>
            <h4 className="mt-4 text-base font-semibold text-stone-900">
              No itinerary days yet
            </h4>
            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-stone-500">
              Start with the arrival day, a transfer, or the biggest highlight of
              the trail. You can keep it lightweight and build the sequence as you
              go.
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
              const isCollapsed = !!collapsed[day.id];
              const filledPointCount = day.points.filter((point) => point.trim()).length;

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
                          className={`truncate text-sm ${
                            day.title.trim()
                              ? "font-semibold text-stone-900"
                              : "italic text-stone-400"
                          }`}
                        >
                          {day.title.trim() || "Untitled day"}
                        </p>
                      </div>
                    </button>

                    <div className="flex flex-wrap items-center gap-2 sm:justify-end">
                      {filledPointCount > 0 && (
                        <span className="rounded-full bg-stone-100 px-2.5 py-1 text-[11px] font-semibold text-stone-700">
                          {filledPointCount} point{filledPointCount === 1 ? "" : "s"}
                        </span>
                      )}
                      {day.accommodation.trim() && (
                        <span className="inline-flex items-center gap-1 rounded-full bg-blue-50 px-2.5 py-1 text-[11px] font-semibold text-blue-700">
                          <Hotel size={11} />
                          Stay
                        </span>
                      )}
                      {day.meals.trim() && (
                        <span className="inline-flex items-center gap-1 rounded-full bg-orange-50 px-2.5 py-1 text-[11px] font-semibold text-orange-700">
                          <UtensilsCrossed size={11} />
                          Meals
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
                          onChange={(event) =>
                            updateDayField(day.id, "title", event.target.value)
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
                            <Plus size={13} />
                            Add point
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
                                onChange={(event) =>
                                  updatePoint(day.id, pointIndex, event.target.value)
                                }
                                placeholder={`Highlight ${pointIndex + 1}`}
                                className={`${inputClassName} flex-1`}
                              />
                              {day.points.length > 1 && (
                                <button
                                  type="button"
                                  onClick={() => removePoint(day.id, pointIndex)}
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
                            <Hotel size={12} className="text-blue-500" />
                            Accommodation
                          </label>
                          <input
                            type="text"
                            value={day.accommodation}
                            onChange={(event) =>
                              updateDayField(
                                day.id,
                                "accommodation",
                                event.target.value,
                              )
                            }
                            placeholder="Forest lodge, tented camp, heritage stay"
                            className={inputClassName}
                          />
                        </div>

                        <div>
                          <label className="mb-1.5 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-[0.18em] text-stone-500">
                            <UtensilsCrossed size={12} className="text-orange-500" />
                            Meals
                          </label>
                          <input
                            type="text"
                            value={day.meals}
                            onChange={(event) =>
                              updateDayField(day.id, "meals", event.target.value)
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
              <Plus size={15} />
              Add another day
            </button>
          </div>
        )}
      </div>

      {error && (
        <div className="border-t border-red-200 bg-red-50 px-6 py-3 text-sm font-medium text-red-700">
          {error}
        </div>
      )}

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
                <Loader2 size={14} className="animate-spin" />
                Saving...
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

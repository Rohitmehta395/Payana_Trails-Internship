import React, { useCallback, useEffect, useState } from "react";
import {
  ChevronUp,
  ChevronDown,
  Trash2,
  Plus,
  Check,
  Loader2,
  X,
  Hotel,
  UtensilsCrossed,
  GripVertical,
  CalendarDays,
  CloudUpload,
  Clock,
} from "lucide-react";
import { useAutoSave } from "../../../hooks/useAutoSave";

const ItineraryEditor = ({ trail, onSave, onAutoSave, onClose }) => {
  const buildEmpty = () => ({ title: "", points: [""], accommodation: "", meals: "" });

  const [days, setDays] = useState(() => {
    if (trail.itinerary && trail.itinerary.length > 0) {
      return trail.itinerary.map((d) => ({
        title: d.title || "",
        points: d.points && d.points.length > 0 ? d.points : [""],
        accommodation: d.accommodation || "",
        meals: d.meals || "",
      }));
    }
    return [buildEmpty()];
  });

  const [saving, setSaving]       = useState(false);
  const [error, setError]         = useState("");
  const [collapsed, setCollapsed] = useState({});
  const [savedType, setSavedType] = useState(null); // 'draft' | 'saved'

  // ── Helpers ───────────────────────────────────────────────────────
  const buildClean = (rawDays) =>
    rawDays.map((d) => ({
      title: d.title.trim(),
      points: d.points.map((p) => p.trim()).filter(Boolean),
      accommodation: d.accommodation.trim(),
      meals: d.meals.trim(),
    }));

  // ── Autosave ──────────────────────────────────────────────────────
  const autoSaveFn = useCallback(async () => {
    try {
      await onAutoSave(trail._id, buildClean(days));
      setSavedType('draft');
    } catch (err) { console.error("Itinerary autosave failed", err); }
  }, [days, trail._id, onAutoSave]);

  const { isSaving: isAutoSaving, lastSaved } = useAutoSave(days, autoSaveFn, 3000);

  // ── Day handlers ──────────────────────────────────────────────────
  const addDay = () => {
    setDays((prev) => [...prev, buildEmpty()]);
    setCollapsed((prev) => { const n = { ...prev }; delete n[days.length]; return n; });
  };

  const removeDay = (idx) => {
    setDays((prev) => prev.filter((_, i) => i !== idx));
    setCollapsed((prev) => {
      const next = {};
      Object.keys(prev).forEach((k) => {
        const ki = parseInt(k, 10);
        if (ki < idx) next[ki] = prev[k];
        else if (ki > idx) next[ki - 1] = prev[k];
      });
      return next;
    });
  };

  const moveDay = (idx, dir) =>
    setDays((prev) => {
      const arr = [...prev];
      const t = idx + dir;
      if (t < 0 || t >= arr.length) return arr;
      [arr[idx], arr[t]] = [arr[t], arr[idx]];
      return arr;
    });

  const toggleCollapse = (idx) =>
    setCollapsed((prev) => ({ ...prev, [idx]: !prev[idx] }));

  const updateDayField = (idx, field, value) =>
    setDays((prev) => { const a = [...prev]; a[idx] = { ...a[idx], [field]: value }; return a; });

  // ── Point handlers ────────────────────────────────────────────────
  const updatePoint = (di, pi, v) =>
    setDays((prev) => {
      const a = [...prev]; const pts = [...a[di].points]; pts[pi] = v;
      a[di] = { ...a[di], points: pts }; return a;
    });

  const addPoint = (di) =>
    setDays((prev) => {
      const a = [...prev];
      a[di] = { ...a[di], points: [...a[di].points, ""] }; return a;
    });

  const removePoint = (di, pi) =>
    setDays((prev) => {
      const a = [...prev];
      const pts = a[di].points.filter((_, i) => i !== pi);
      a[di] = { ...a[di], points: pts.length > 0 ? pts : [""] }; return a;
    });

  // ── Manual save ───────────────────────────────────────────────────
  const handleSave = async () => {
    setSaving(true); setError("");
    try {
      await onSave(trail._id, buildClean(days));
      setSavedType('saved');
      onClose();
    }
    catch (err) { setError(err.message || "Failed to save itinerary."); }
    finally { setSaving(false); }
  };

  // ── Shared input style ────────────────────────────────────────────
  const inp = "w-full px-3 py-2 border border-gray-200 rounded-lg text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#4A3B2A]/30 focus:border-[#4A3B2A] transition-all bg-white";

  return (
    <div className="border border-[#4A3B2A]/15 rounded-2xl bg-white shadow-xl overflow-hidden">

      {/* ── Header ───────────────────────────────────────────────── */}
      <div className="flex items-center justify-between px-6 py-4 bg-gradient-to-r from-[#4A3B2A] to-[#6B5240] text-white">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center">
            <CalendarDays size={16} />
          </div>
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-widest text-white/60 leading-none mb-0.5">
              Itinerary Editor
            </p>
            <p className="text-sm font-semibold text-white truncate max-w-[220px]">
              {trail.trailName}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Autosave status pill */}
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold
            bg-white/10 border border-white/20 min-w-[120px] justify-center">
            {isAutoSaving ? (
              <>
                <Loader2 size={12} className="animate-spin text-amber-300" />
                <span className="text-amber-300">Saving draft…</span>
              </>
            ) : lastSaved ? (
              <>
                {savedType === 'draft' ? (
                  <><Check size={12} className="text-amber-400" /><span className="text-amber-300">Draft saved {lastSaved.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</span></>
                ) : (
                  <><Check size={12} className="text-emerald-400" /><span className="text-emerald-300">Saved {lastSaved.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</span></>
                )}
              </>
            ) : (
              <>
                <CloudUpload size={12} className="text-white/50" />
                <span className="text-white/50">Autosave on</span>
              </>
            )}
          </div>

          <span className="bg-white/20 text-white text-xs font-bold px-2.5 py-1 rounded-full border border-white/10">
            {days.length} {days.length === 1 ? "Day" : "Days"}
          </span>

          <button onClick={onClose}
            className="w-7 h-7 flex items-center justify-center rounded-lg text-white/60 hover:text-white hover:bg-white/10 transition-all"
            title="Close">
            <X size={16} />
          </button>
        </div>
      </div>

      {/* ── Draft banner (shows after first autosave) ─────────────── */}
      {lastSaved && !isAutoSaving && savedType === 'draft' && (
        <div className="flex items-center gap-2 px-6 py-2.5 bg-amber-50 border-b border-amber-100">
          <Check size={13} className="text-amber-600 flex-shrink-0" />
          <p className="text-xs text-amber-700 font-medium">
            Itinerary autosaved as draft —{" "}
            <span className="font-normal">
              last saved at {lastSaved.toLocaleTimeString()}. Click <strong>Save Itinerary</strong> to confirm.
            </span>
          </p>
        </div>
      )}

      {/* ── Day cards ─────────────────────────────────────────────── */}
      <div className="p-5 space-y-3 max-h-[65vh] overflow-y-auto bg-[#FAFAF9]">
        {days.map((day, idx) => (
          <div key={idx}
            className="border border-gray-200 rounded-xl bg-white shadow-sm overflow-hidden transition-all">

            {/* Card header */}
            <div
              className="flex items-center gap-3 px-4 py-3.5 cursor-pointer select-none hover:bg-gray-50/80 transition-colors"
              onClick={() => toggleCollapse(idx)}
            >
              {/* Day number bubble */}
              <div className="flex-shrink-0 w-9 h-9 rounded-xl bg-gradient-to-br from-[#4A3B2A] to-[#6B5240] text-white text-sm font-bold flex items-center justify-center shadow-sm">
                {idx + 1}
              </div>

              <div className="flex-1 min-w-0">
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest leading-none mb-0.5">
                  Day {idx + 1}
                </p>
                <p className={`text-sm font-semibold truncate ${day.title ? "text-gray-800" : "text-gray-400 font-normal italic"}`}>
                  {day.title || "Untitled day"}
                </p>
              </div>

              {/* Day meta chips */}
              {!collapsed[idx] && (
                <div className="hidden sm:flex items-center gap-1.5 flex-shrink-0">
                  {day.points.filter(Boolean).length > 0 && (
                    <span className="text-[10px] bg-[#F3EFE9] text-[#4A3B2A] px-2 py-0.5 rounded-full font-semibold">
                      {day.points.filter(Boolean).length} point{day.points.filter(Boolean).length !== 1 ? "s" : ""}
                    </span>
                  )}
                  {day.accommodation && (
                    <span className="text-[10px] bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full font-semibold flex items-center gap-1">
                      <Hotel size={9} /> Stay
                    </span>
                  )}
                  {day.meals && (
                    <span className="text-[10px] bg-orange-50 text-orange-700 px-2 py-0.5 rounded-full font-semibold flex items-center gap-1">
                      <UtensilsCrossed size={9} /> Meals
                    </span>
                  )}
                </div>
              )}

              {/* Controls */}
              <div className="flex items-center gap-0.5 flex-shrink-0 ml-1">
                <button type="button"
                  onClick={(e) => { e.stopPropagation(); moveDay(idx, -1); }}
                  disabled={idx === 0}
                  className="w-7 h-7 flex items-center justify-center rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100 disabled:opacity-25 transition-all"
                  title="Move up">
                  <ChevronUp size={15} />
                </button>
                <button type="button"
                  onClick={(e) => { e.stopPropagation(); moveDay(idx, 1); }}
                  disabled={idx === days.length - 1}
                  className="w-7 h-7 flex items-center justify-center rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100 disabled:opacity-25 transition-all"
                  title="Move down">
                  <ChevronDown size={15} />
                </button>
                {days.length > 1 && (
                  <button type="button"
                    onClick={(e) => { e.stopPropagation(); removeDay(idx); }}
                    className="w-7 h-7 flex items-center justify-center rounded-lg text-red-400 hover:text-red-600 hover:bg-red-50 transition-all ml-0.5"
                    title="Remove day">
                    <Trash2 size={14} />
                  </button>
                )}
                <div className="w-7 h-7 flex items-center justify-center text-gray-300 ml-0.5">
                  {collapsed[idx]
                    ? <ChevronDown size={15} />
                    : <ChevronUp size={15} />}
                </div>
              </div>
            </div>

            {/* Card body */}
            {!collapsed[idx] && (
              <div className="px-4 pb-5 pt-2 space-y-4 border-t border-gray-100">

                {/* Title */}
                <div>
                  <label className="block text-xs font-bold text-gray-500 mb-1.5 uppercase tracking-wider">
                    Day Title
                  </label>
                  <input type="text"
                    placeholder="e.g. Arrive at base camp, acclimatisation walk"
                    value={day.title}
                    onChange={(e) => updateDayField(idx, "title", e.target.value)}
                    className={inp} />
                </div>

                {/* Points */}
                <div>
                  <label className="block text-xs font-bold text-gray-500 mb-2 uppercase tracking-wider">
                    Activity Points
                  </label>
                  <div className="space-y-2">
                    {day.points.map((pt, pi) => (
                      <div key={pi} className="flex gap-2 items-center">
                        <div className="flex-shrink-0 w-5 h-5 rounded-full border-2 border-[#4A3B2A]/30 flex items-center justify-center">
                          <div className="w-1.5 h-1.5 rounded-full bg-[#4A3B2A]/50" />
                        </div>
                        <input type="text"
                          placeholder={`Activity ${pi + 1}`}
                          value={pt}
                          onChange={(e) => updatePoint(idx, pi, e.target.value)}
                          className={`${inp} flex-1`} />
                        {day.points.length > 1 && (
                          <button type="button"
                            onClick={() => removePoint(idx, pi)}
                            className="flex-shrink-0 w-7 h-7 flex items-center justify-center text-red-400 hover:bg-red-50 hover:text-red-600 rounded-lg transition-all">
                            <X size={14} />
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                  <button type="button" onClick={() => addPoint(idx)}
                    className="mt-2.5 flex items-center gap-1.5 text-xs text-[#4A3B2A] font-semibold hover:underline transition-all">
                    <Plus size={13} /> Add Activity Point
                  </button>
                </div>

                {/* Inline divider */}
                <div className="border-t border-dashed border-gray-200" />

                {/* Optional fields */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="flex items-center gap-1.5 text-xs font-bold text-gray-500 mb-1.5 uppercase tracking-wider">
                      <Hotel size={12} className="text-blue-500" />
                      Accommodation
                      <span className="font-normal normal-case text-gray-400 text-[10px]">(optional)</span>
                    </label>
                    <input type="text"
                      placeholder="e.g. Forest lodge, Camping"
                      value={day.accommodation}
                      onChange={(e) => updateDayField(idx, "accommodation", e.target.value)}
                      className={inp} />
                  </div>
                  <div>
                    <label className="flex items-center gap-1.5 text-xs font-bold text-gray-500 mb-1.5 uppercase tracking-wider">
                      <UtensilsCrossed size={12} className="text-orange-500" />
                      Meals
                      <span className="font-normal normal-case text-gray-400 text-[10px]">(optional)</span>
                    </label>
                    <input type="text"
                      placeholder="e.g. Breakfast & Dinner"
                      value={day.meals}
                      onChange={(e) => updateDayField(idx, "meals", e.target.value)}
                      className={inp} />
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}

        {/* Add Day */}
        <button type="button" onClick={addDay}
          className="w-full py-3.5 border-2 border-dashed border-[#4A3B2A]/20 rounded-xl text-sm text-[#4A3B2A] font-semibold
            hover:border-[#4A3B2A]/50 hover:bg-[#4A3B2A]/5 transition-all flex items-center justify-center gap-2 group">
          <div className="w-6 h-6 rounded-full bg-[#4A3B2A]/10 group-hover:bg-[#4A3B2A]/20 flex items-center justify-center transition-all">
            <Plus size={14} className="text-[#4A3B2A]" />
          </div>
          Add Day
        </button>
      </div>

      {/* ── Error ─────────────────────────────────────────────────── */}
      {error && (
        <div className="px-6 py-2.5 bg-red-50 border-t border-red-200 flex items-center gap-2">
          <X size={13} className="text-red-500 flex-shrink-0" />
          <p className="text-xs text-red-600 font-medium">{error}</p>
        </div>
      )}

      {/* ── Footer ────────────────────────────────────────────────── */}
      <div className="px-6 py-4 bg-white border-t border-gray-100 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2 text-xs text-gray-400">
          <Clock size={12} />
          {isAutoSaving
            ? <span className="text-amber-600 font-medium">Saving draft…</span>
            : lastSaved && savedType === 'draft'
            ? <span className="text-amber-700 font-medium">Draft saved · {lastSaved.toLocaleTimeString()}</span>
            : lastSaved && savedType === 'saved'
            ? <span className="text-emerald-700 font-medium">Saved · {lastSaved.toLocaleTimeString()}</span>
            : <span>Your changes are autosaved as draft</span>}
        </div>

        <div className="flex gap-2">
          <button type="button" onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-lg transition-all">
            Cancel
          </button>
          <button type="button" onClick={handleSave}
            disabled={saving || isAutoSaving}
            className="px-5 py-2 text-sm font-semibold text-white bg-[#4A3B2A] hover:bg-[#3a2d20] disabled:opacity-50 rounded-lg transition-all shadow-sm flex items-center gap-2">
            {saving ? (
              <><Loader2 size={14} className="animate-spin" /> Saving…</>
            ) : (
              <><Check size={14} /> Save Itinerary</>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ItineraryEditor;

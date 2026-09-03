"use client";

import { useEffect, useState } from "react";
import {
  ArrowLeft,
  CalendarDays,
  Check,
  ChefHat,
  CircleDollarSign,
  Trash2,
  Users,
} from "lucide-react";
import Link from "next/link";

import { useLanguage } from "@/components/language-provider";
import { Button } from "@/components/ui/button";
import {
  deleteSavedMealPlan,
  generateMealPlan,
  getSavedMealPlans,
  saveGeneratedMealPlan,
  type GeneratedMealPlan,
} from "@/lib/api";
import { MealPlanHeader } from "@/components/meal-plan/MealPlanHeader";
import { MealPlanIntro } from "@/components/meal-plan/MealPlanIntro";

const GOALS = [
  ["balanced", "Ăn uống cân bằng", "Balanced eating"],
  ["save", "Tiết kiệm", "Save money"],
  ["gain", "Tăng cân", "Gain weight"],
  ["lose", "Giảm cân", "Lose weight"],
  ["muscle", "Tăng cơ", "Build muscle"],
];
const TASTES = [
  ["vietnamese", "Việt Nam"],
  ["asian", "Châu Á"],
  ["european", "Châu Âu"],
  ["spicy", "Cay"],
  ["low-oil", "Ít dầu"],
  ["vegetarian", "Chay"],
];

function getDate(offset: number) {
  const date = new Date();
  date.setDate(date.getDate() + offset);
  return date.toISOString().slice(0, 10);
}

function toDisplayDate(isoDate: string) {
  const [year, month, day] = isoDate.split("-");
  return year && month && day ? `${day}/${month}/${year}` : "";
}

function toIsoDate(displayDate: string) {
  const match = displayDate.match(/^(\d{2})\/(\d{2})\/(\d{4})$/);
  if (!match) return "";
  const [, day, month, year] = match;
  const date = new Date(`${year}-${month}-${day}T12:00:00`);
  return date.getFullYear() === Number(year) &&
    date.getMonth() + 1 === Number(month) &&
    date.getDate() === Number(day)
    ? `${year}-${month}-${day}`
    : "";
}

export default function MealPlanPage() {
  const { isVietnamese } = useLanguage();
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [period, setPeriod] = useState<"days" | "week" | "month">("week");
  const [servings, setServings] = useState(2);
  const [mealsPerDay, setMealsPerDay] = useState(3);
  const [dailyCalories, setDailyCalories] = useState(2000);
  const [goal, setGoal] = useState("balanced");
  const [tastes, setTastes] = useState<string[]>(["vietnamese"]);
  const [budget, setBudget] = useState(800000);
  const [availableIngredients, setAvailableIngredients] = useState("");
  const [plan, setPlan] = useState<GeneratedMealPlan | null>(null);
  const [savedPlans, setSavedPlans] = useState<GeneratedMealPlan[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [deletingPlanId, setDeletingPlanId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    queueMicrotask(() => {
      setStartDate(toDisplayDate(getDate(0)));
      setEndDate(toDisplayDate(getDate(6)));
    });
  }, []);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user") || "null") as {
      id?: string;
    } | null;
    if (!user?.id) return;
    getSavedMealPlans(user.id)
      .then(setSavedPlans)
      .catch(() => undefined);
  }, []);

  const toggleTaste = (taste: string) =>
    setTastes((current) =>
      current.includes(taste)
        ? current.filter((item) => item !== taste)
        : [...current, taste],
    );

  const changePeriod = (nextPeriod: "days" | "week" | "month") => {
    setPeriod(nextPeriod);
    const isoStartDate = toIsoDate(startDate);
    if (!isoStartDate) return;
    const date = new Date(`${isoStartDate}T12:00:00`);
    date.setDate(
      date.getDate() +
        (nextPeriod === "days" ? 2 : nextPeriod === "week" ? 6 : 29),
    );
    setEndDate(toDisplayDate(date.toISOString().slice(0, 10)));
  };

  const createPlan = async () => {
    const isoStartDate = toIsoDate(startDate);
    const isoEndDate = toIsoDate(endDate);
    if (!isoStartDate || !isoEndDate) return;
    setIsGenerating(true);
    setError(null);
    try {
      const user = JSON.parse(localStorage.getItem("user") || "null") as {
        id?: string;
      } | null;
      const result = await generateMealPlan({
        startDate: isoStartDate,
        endDate: isoEndDate,
        period,
        servings,
        mealsPerDay,
        dailyCalories,
        goal,
        tastes,
        budget,
        availableIngredients: availableIngredients
          .split(",")
          .map((item) => item.trim())
          .filter(Boolean),
        language: isVietnamese ? "vi" : "en",
        userId: user?.id,
      });
      setPlan(result);
    } catch (generationError) {
      setError(
        generationError instanceof Error
          ? generationError.message
          : "Không thể tạo kế hoạch",
      );
    } finally {
      setIsGenerating(false);
    }
  };

  const savePlan = async () => {
    if (!plan) return;
    const user = JSON.parse(localStorage.getItem("user") || "null") as {
      id?: string;
    } | null;
    if (!user?.id) {
      setError(
        isVietnamese
          ? "Vui lòng đăng nhập để lưu thực đơn."
          : "Please sign in to save this plan.",
      );
      return;
    }
    setIsSaving(true);
    setError(null);
    try {
      const savedPlan = await saveGeneratedMealPlan(plan, user.id);
      setPlan(savedPlan);
      setSavedPlans((current) => [
        savedPlan,
        ...current.filter((item) => item.id !== savedPlan.id),
      ]);
    } catch (saveError) {
      setError(
        saveError instanceof Error
          ? saveError.message
          : isVietnamese
            ? "Không thể lưu thực đơn"
            : "Could not save meal plan",
      );
    } finally {
      setIsSaving(false);
    }
  };

  const deletePlan = async (savedPlan: GeneratedMealPlan) => {
    const planId = savedPlan.id || savedPlan._id;
    const user = JSON.parse(localStorage.getItem("user") || "null") as {
      id?: string;
    } | null;
    if (!planId || !user?.id) return;
    if (
      !window.confirm(
        isVietnamese
          ? "Bạn có chắc muốn xóa thực đơn này không?"
          : "Delete this saved meal plan?",
      )
    )
      return;
    setDeletingPlanId(planId);
    setError(null);
    try {
      await deleteSavedMealPlan(planId, user.id);
      setSavedPlans((current) =>
        current.filter((item) => (item.id || item._id) !== planId),
      );
      if ((plan?.id || plan?._id) === planId) setPlan(null);
    } catch (deleteError) {
      setError(
        deleteError instanceof Error
          ? deleteError.message
          : isVietnamese
            ? "Không thể xóa thực đơn"
            : "Could not delete meal plan",
      );
    } finally {
      setDeletingPlanId(null);
    }
  };

  return (
    <main className="min-h-screen bg-[#f8f7f2] text-[#17352d]">
      <MealPlanHeader isVietnamese={isVietnamese} />

      <div className="mx-auto max-w-7xl px-5 py-10 sm:px-8 lg:px-12 lg:py-14">
        <MealPlanIntro isVietnamese={isVietnamese} />

        <div className="mt-10 grid gap-8 lg:grid-cols-[minmax(0,0.82fr)_minmax(0,1.18fr)] lg:items-start">
          <section className="rounded-3xl border border-[#dbe5dd] bg-white p-5 shadow-sm sm:p-7">
            <div className="flex items-center gap-3 border-b border-[#e4ece2] pb-5">
              <span className="flex size-10 items-center justify-center rounded-xl bg-[#17352d] text-[#f3d7a3]">
                <CalendarDays className="size-5" />
              </span>
              <div>
                <h2 className="font-serif text-2xl">
                  {isVietnamese ? "Thông tin kế hoạch" : "Plan details"}
                </h2>
                <p className="text-xs text-[#527066]">
                  {isVietnamese
                    ? "AI sẽ dùng các lựa chọn này làm nguyên tắc."
                    : "AI will use these choices as guardrails."}
                </p>
              </div>
            </div>
            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <label className="text-sm font-semibold">
                {isVietnamese ? "Từ ngày" : "Start date"}
                <input
                  type="text"
                  inputMode="numeric"
                  placeholder="dd/mm/yyyy"
                  value={startDate}
                  onChange={(event) => setStartDate(event.target.value)}
                  className="mt-2 h-11 w-full rounded-xl border border-[#c5d2cc] px-3 text-sm font-normal outline-none focus:border-[#d97742]"
                />
              </label>
              <label className="text-sm font-semibold">
                {isVietnamese ? "Đến ngày" : "End date"}
                <input
                  type="text"
                  inputMode="numeric"
                  placeholder="dd/mm/yyyy"
                  value={endDate}
                  onChange={(event) => setEndDate(event.target.value)}
                  className="mt-2 h-11 w-full rounded-xl border border-[#c5d2cc] px-3 text-sm font-normal outline-none focus:border-[#d97742]"
                />
              </label>
            </div>
            <label className="mt-5 block text-sm font-semibold">
              {isVietnamese ? "Khoảng thời gian" : "Planning window"}
              <select
                value={period}
                onChange={(event) =>
                  changePeriod(event.target.value as typeof period)
                }
                className="mt-2 h-11 w-full rounded-xl border border-[#c5d2cc] bg-white px-3 text-sm font-normal outline-none focus:border-[#d97742]"
              >
                <option value="days">
                  {isVietnamese ? "Vài ngày" : "A few days"}
                </option>
                <option value="week">
                  {isVietnamese ? "Một tuần" : "One week"}
                </option>
                <option value="month">
                  {isVietnamese ? "Một tháng" : "One month"}
                </option>
              </select>
            </label>
            <label className="mt-5 block text-sm font-semibold">
              <span className="flex items-center gap-2">
                <Users className="size-4 text-[#d97742]" />
                {isVietnamese ? "Số người ăn" : "People eating"}
              </span>
              <input
                type="number"
                min={1}
                max={20}
                value={servings}
                onChange={(event) =>
                  setServings(Math.max(1, Number(event.target.value)))
                }
                className="mt-2 h-11 w-full rounded-xl border border-[#c5d2cc] px-3 text-sm font-normal outline-none focus:border-[#d97742]"
              />
            </label>
            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              <label className="text-sm font-semibold">
                {isVietnamese ? "Số món mỗi ngày" : "Meals per day"}
                <input
                  type="number"
                  min={1}
                  max={6}
                  value={mealsPerDay}
                  onChange={(event) =>
                    setMealsPerDay(
                      Math.min(6, Math.max(1, Number(event.target.value))),
                    )
                  }
                  className="mt-2 h-11 w-full rounded-xl border border-[#c5d2cc] px-3 text-sm font-normal outline-none focus:border-[#d97742]"
                />
              </label>
              <label className="text-sm font-semibold">
                {isVietnamese ? "Kcal mỗi ngày" : "Daily calories"}
                <input
                  type="number"
                  min={500}
                  max={6000}
                  step={50}
                  value={dailyCalories}
                  onChange={(event) =>
                    setDailyCalories(
                      Math.min(6000, Math.max(500, Number(event.target.value))),
                    )
                  }
                  className="mt-2 h-11 w-full rounded-xl border border-[#c5d2cc] px-3 text-sm font-normal outline-none focus:border-[#d97742]"
                />
              </label>
            </div>
            <fieldset className="mt-6">
              <legend className="text-sm font-semibold">
                {isVietnamese ? "Mục tiêu" : "Goal"}
              </legend>
              <div className="mt-2 grid gap-2 sm:grid-cols-2">
                {GOALS.map(([value, vi, en]) => (
                  <button
                    key={value}
                    type="button"
                    onClick={() => setGoal(value)}
                    className={`rounded-xl border px-3 py-2.5 text-left text-xs font-semibold transition ${goal === value ? "border-[#17352d] bg-[#17352d] text-white" : "border-[#dbe5dd] bg-[#f8faf7] text-[#527066] hover:border-[#d97742]"}`}
                  >
                    {isVietnamese ? vi : en}
                  </button>
                ))}
              </div>
            </fieldset>
            <fieldset className="mt-6">
              <legend className="text-sm font-semibold">
                {isVietnamese ? "Khẩu vị & phong cách" : "Taste & style"}
              </legend>
              <div className="mt-2 flex flex-wrap gap-2">
                {TASTES.map(([value, label]) => (
                  <button
                    key={value}
                    type="button"
                    onClick={() => toggleTaste(value)}
                    className={`rounded-full border px-3 py-2 text-xs font-semibold transition ${tastes.includes(value) ? "border-[#d97742] bg-[#fff1df] text-[#c56537]" : "border-[#dbe5dd] text-[#527066] hover:border-[#d97742]"}`}
                  >
                    {isVietnamese ? label : value.replace("low-oil", "Low oil")}
                  </button>
                ))}
              </div>
            </fieldset>
            <label className="mt-6 block text-sm font-semibold">
              <span className="flex items-center gap-2">
                <CircleDollarSign className="size-4 text-[#d97742]" />
                {isVietnamese ? "Ngân sách tổng (VNĐ)" : "Total budget"}
              </span>
              <input
                type="number"
                min={0}
                step={50000}
                value={budget}
                onChange={(event) =>
                  setBudget(Math.max(0, Number(event.target.value)))
                }
                className="mt-2 h-11 w-full rounded-xl border border-[#c5d2cc] px-3 text-sm font-normal outline-none focus:border-[#d97742]"
              />
            </label>
            <label className="mt-6 block text-sm font-semibold">
              {isVietnamese ? "Nguyên liệu đang có" : "Ingredients on hand"}
              <textarea
                value={availableIngredients}
                onChange={(event) =>
                  setAvailableIngredients(event.target.value)
                }
                placeholder={
                  isVietnamese
                    ? "Ví dụ: trứng, rau muống, thịt gà, gạo..."
                    : "e.g. eggs, spinach, chicken, rice..."
                }
                className="mt-2 min-h-24 w-full resize-y rounded-xl border border-[#c5d2cc] px-3 py-3 text-sm font-normal outline-none focus:border-[#d97742]"
              />
            </label>
            {error && (
              <p className="mt-4 rounded-xl bg-red-50 px-3 py-2 text-sm text-red-700">
                {error}
              </p>
            )}
            <Button
              onClick={createPlan}
              disabled={isGenerating || !startDate || !endDate}
              className="mt-6 h-12 w-full gap-2 bg-[#d97742] text-white hover:bg-[#bf6132]"
            >
              <ChefHat className="size-5" />
              {isGenerating
                ? isVietnamese
                  ? "AI đang lên thực đơn..."
                  : "AI is planning..."
                : isVietnamese
                  ? "Tạo kế hoạch bằng AI"
                  : "Generate with AI"}
            </Button>
          </section>

          <section className="min-h-[560px] rounded-3xl bg-[#17352d] p-5 text-white shadow-xl sm:p-7">
            {!plan && !isGenerating && (
              <div className="flex min-h-[500px] flex-col items-center justify-center text-center">
                <div className="flex size-16 items-center justify-center rounded-2xl bg-[#f3d7a3] text-[#17352d]">
                  <CalendarDays className="size-8" />
                </div>
                <h2 className="mt-6 font-serif text-3xl">
                  {isVietnamese
                    ? "Lịch ăn của bạn sẽ ở đây"
                    : "Your meal calendar lives here"}
                </h2>
                <p className="mt-3 max-w-sm text-sm leading-6 text-white/65">
                  {isVietnamese
                    ? "Điền thông tin bên trái để AI sắp xếp các bữa ăn theo từng ngày."
                    : "Fill in the details on the left and AI will arrange every meal by day."}
                </p>
              </div>
            )}
            {isGenerating && (
              <div className="flex min-h-[500px] flex-col items-center justify-center text-center">
                <span className="size-12 animate-spin rounded-full border-4 border-white/20 border-t-[#f3d7a3]" />
                <h2 className="mt-6 font-serif text-3xl">
                  {isVietnamese ? "Đang nấu ý tưởng..." : "Cooking up ideas..."}
                </h2>
                <p className="mt-3 text-sm text-white/65">
                  {isVietnamese
                    ? "AI đang cân đối khẩu vị, ngân sách và nguyên liệu."
                    : "Balancing taste, budget, and ingredients."}
                </p>
              </div>
            )}
            {plan && (
              <div>
                <div className="flex flex-col justify-between gap-4 border-b border-white/15 pb-6 sm:flex-row sm:items-end">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#f3d7a3]">
                      {plan.id
                        ? isVietnamese
                          ? "Thực đơn đã lưu"
                          : "Saved meal plan"
                        : isVietnamese
                          ? "Bản xem trước"
                          : "Preview"}
                    </p>
                    <h2 className="mt-2 font-serif text-3xl">
                      {plan.days.length}{" "}
                      {isVietnamese ? "ngày ăn ngon" : "days of good eating"}
                    </h2>
                  </div>
                  <div className="flex flex-wrap gap-2 text-xs text-white/75">
                    <span className="rounded-full bg-white/10 px-3 py-1.5">
                      {plan.servings} {isVietnamese ? "người" : "servings"}
                    </span>
                    <span className="rounded-full bg-white/10 px-3 py-1.5">
                      {plan.mealsPerDay}{" "}
                      {isVietnamese ? "món/ngày" : "meals/day"}
                    </span>
                    <span className="rounded-full bg-white/10 px-3 py-1.5">
                      {plan.dailyCalories.toLocaleString()} kcal/day
                    </span>
                  </div>
                </div>
                <div className="mt-6 space-y-5">
                  {plan.days.map((day) => (
                    <article
                      key={day.date}
                      className="rounded-2xl border border-white/10 bg-white/5 p-4"
                    >
                      <div className="flex items-center justify-between gap-3">
                        <h3 className="font-semibold">
                          {new Date(`${day.date}T12:00:00`).toLocaleDateString(
                            isVietnamese ? "vi-VN" : "en-US",
                            { weekday: "long", month: "short", day: "numeric" },
                          )}
                        </h3>
                        <span className="text-xs text-[#f3d7a3]">
                          {day.meals.reduce(
                            (sum, meal) => sum + meal.calories,
                            0,
                          )}{" "}
                          kcal
                        </span>
                      </div>
                      <div className="mt-3 grid gap-2 sm:grid-cols-3">
                        {day.meals.map((meal) => (
                          <div
                            key={`${day.date}-${meal.mealType}`}
                            className="rounded-xl bg-[#0f2922] p-3"
                          >
                            <p className="text-[10px] font-bold uppercase tracking-wider text-[#f3d7a3]">
                              {meal.mealType}
                            </p>
                            <p className="mt-1 text-sm font-semibold text-white">
                              {meal.name}
                            </p>
                            <p className="mt-1 line-clamp-2 text-xs leading-5 text-white/55">
                              {meal.description}
                            </p>
                            <p className="mt-2 text-[11px] text-white/45">
                              {meal.ingredients.join(", ")}
                            </p>
                          </div>
                        ))}
                      </div>
                    </article>
                  ))}
                </div>
                {!plan.id && (
                  <button
                    type="button"
                    onClick={savePlan}
                    disabled={isSaving}
                    className="mt-6 flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-[#f3d7a3] px-4 text-sm font-bold text-[#17352d] transition hover:bg-[#f8e3bb] disabled:cursor-wait disabled:opacity-70"
                  >
                    <Check className="size-4" />
                    {isSaving
                      ? isVietnamese
                        ? "Đang lưu..."
                        : "Saving..."
                      : isVietnamese
                        ? "Lưu thực đơn"
                        : "Save meal plan"}
                  </button>
                )}
                {plan.id && (
                  <div className="mt-6 flex items-center gap-2 rounded-xl bg-[#f3d7a3] px-4 py-3 text-sm font-semibold text-[#17352d]">
                    <Check className="size-4" />
                    {isVietnamese
                      ? "Thực đơn đã được lưu."
                      : "Meal plan saved."}
                  </div>
                )}
              </div>
            )}
          </section>
        </div>
        {savedPlans.length > 0 && (
          <section className="mt-8 max-w-3xl">
            <div className="mb-3 flex items-center justify-between">
              <h2 className="font-serif text-2xl">
                {isVietnamese ? "Thực đơn đã lưu" : "Saved meal plans"}
              </h2>
              <Link
                href="/profile"
                className="text-sm font-semibold text-[#d97742] hover:underline"
              >
                {isVietnamese ? "Xem hồ sơ" : "View profile"}
              </Link>
            </div>
            <div className="grid gap-2 sm:grid-cols-2">
              {savedPlans.map((savedPlan) => (
                <div
                  key={savedPlan.id}
                  className="flex items-center gap-2 rounded-xl border border-[#dbe5dd] bg-white px-4 py-3 text-left shadow-sm transition hover:border-[#d97742]"
                >
                  <button
                    type="button"
                    onClick={() => setPlan(savedPlan)}
                    className="min-w-0 flex-1 text-left"
                  >
                    <span className="block text-sm font-bold">
                      {savedPlan.startDate} - {savedPlan.endDate}
                    </span>
                    <span className="mt-1 block text-xs text-[#527066]">
                      {savedPlan.days.length} {isVietnamese ? "ngày" : "days"} ·{" "}
                      {savedPlan.mealsPerDay}{" "}
                      {isVietnamese ? "món/ngày" : "meals/day"}
                    </span>
                  </button>
                  <button
                    type="button"
                    title={isVietnamese ? "Xóa thực đơn" : "Delete meal plan"}
                    aria-label={isVietnamese ? "Xóa thực đơn" : "Delete meal plan"}
                    onClick={() => deletePlan(savedPlan)}
                    disabled={deletingPlanId === (savedPlan.id || savedPlan._id)}
                    className="flex size-9 shrink-0 items-center justify-center rounded-lg text-[#b4573b] transition hover:bg-[#fff0eb] disabled:cursor-wait disabled:opacity-50"
                  >
                    <Trash2 className="size-4" />
                  </button>
                  <ArrowLeft className="size-4 shrink-0 rotate-180 text-[#d97742]" />
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </main>
  );
}

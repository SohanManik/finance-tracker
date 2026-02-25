import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../lib/supabase";
import { useAuth } from "../../lib/AuthContext";
import ProgressBar from "./ProgressBar";
import Step1Welcome from "./steps/Step1Welcome";
import Step2Employment from "./steps/Step2Employment";
import Step3CreditCards from "./steps/Step3CreditCards";
import Step4Subscriptions from "./steps/Step4Subscriptions";
import Step5Goals from "./steps/Step5Goals";
import Step6Complete from "./steps/Step6Complete";

const TOTAL_STEPS = 6;

const DEFAULT_CATEGORIES = [
  "Rent & Housing",
  "Food & Dining",
  "Groceries",
  "Shopping",
  "Entertainment",
  "Subscriptions",
  "Transportation",
  "Gas",
  "Health & Medical",
  "Education",
  "Travel",
  "Personal Care",
  "Gifts",
  "Sports Betting",
  "Income",
  "Venmo & Zelle",
  "Miscellaneous",
];

const SKIPPABLE_STEPS = [1, 3, 4, 5]; // Step 2 (employment) is required

export default function Onboarding() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [data, setData] = useState({
    full_name: "",
    goal: "",
    employment_type: "hourly",
    employer_name: "",
    pay_rate: "",
    pay_frequency: "",
    take_home: "",
    credit_cards: [],
    subscriptions: [],
    goal_name: "",
    goal_amount: "",
    goal_date: "",
  });

  function parseCurrency(value) {
    if (!value) return null;
    const cleaned = String(value).replace(/[$,\s]/g, "");
    const num = parseFloat(cleaned);
    return isNaN(num) ? null : num;
  }

  function updateData(fields) {
    setData((prev) => ({ ...prev, ...fields }));
  }

  function canProceed() {
    if (step === 2) {
      return data.employer_name.trim() && data.pay_frequency;
    }
    return true;
  }

  async function handleFinish() {
    setSaving(true);
    setError("");

    try {
      const userId = user.id;

      // 1. Create user record
      await supabase.from("users").upsert({
        id: userId,
        email: user.email,
        full_name: data.full_name || user.email.split("@")[0],
      });

      // 2. Seed default categories
      const categoryRows = DEFAULT_CATEGORIES.map((name) => ({
        user_id: userId,
        name,
        is_default: true,
      }));
      await supabase.from("categories").upsert(categoryRows, {
        onConflict: "user_id,name",
        ignoreDuplicates: true,
      });

      // 3. Save employment record
      if (data.employer_name && data.pay_frequency) {
        const { data: freqData } = await supabase
          .from("pay_frequencies")
          .select("id")
          .eq("name", data.pay_frequency)
          .single();

        const { data: empTypeData } = await supabase
          .from("employment_types")
          .select("id")
          .eq("name", data.employment_type)
          .single();

        await supabase.from("employment").insert({
          user_id: userId,
          employer_name: data.employer_name,
          employment_type_id: empTypeData?.id,
          pay_frequency_id: freqData?.id,
          start_date: new Date().toISOString().split("T")[0],
          hourly_rate:
            data.employment_type === "hourly"
              ? parseCurrency(data.pay_rate)
              : null,
          annual_salary:
            data.employment_type === "salaried"
              ? parseCurrency(data.pay_rate)
              : null,
        });
      }

      // 4. Save credit cards
      if (data.credit_cards.length > 0) {
        const cardRows = data.credit_cards.map((card) => ({
          user_id: userId,
          nickname: card.nickname,
          issuer: card.issuer,
        }));
        await supabase.from("credit_cards").insert(cardRows);
      }

      // 5. Save subscriptions as recurring transactions
      if (data.subscriptions.length > 0) {
        const { data: freqData } = await supabase
          .from("frequencies")
          .select("id")
          .eq("name", "monthly")
          .single();

        const subRows = data.subscriptions
          .filter((s) => s.amount)
          .map((sub) => {
            const today = new Date();
            const nextDate = new Date(
              today.getFullYear(),
              today.getMonth(),
              parseInt(sub.due_day) || 1,
            );
            if (nextDate < today) nextDate.setMonth(nextDate.getMonth() + 1);

            return {
              user_id: userId,
              name: sub.name,
              amount: parseFloat(sub.amount),
              frequency_id: freqData?.id,
              next_occurrence_date: nextDate.toISOString().split("T")[0],
              is_subscription: true,
              is_active: true,
            };
          });

        if (subRows.length > 0) {
          await supabase.from("recurring_transactions").insert(subRows);
        }
      }

      // 6. Save savings goal
      if (data.goal_name && data.goal_amount) {
        await supabase.from("financial_goals").insert({
          user_id: userId,
          name: data.goal_name,
          target_amount: parseCurrency(data.goal_amount),
          target_date: data.goal_date || null,
          current_amount: 0,
        });
      }

      // 7. Mark onboarding complete in user metadata
      await supabase.auth.updateUser({
        data: { onboarding_complete: true },
      });

      navigate("/");
    } catch (err) {
      console.error("Onboarding error:", err);
      setError("Something went wrong. Please try again.");
    }

    setSaving(false);
  }

  function handleNext() {
    if (step < TOTAL_STEPS) {
      setStep(step + 1);
    } else {
      handleFinish();
    }
  }

  function handleBack() {
    if (step > 1) setStep(step - 1);
  }

  const steps = {
    1: <Step1Welcome data={data} onUpdate={updateData} />,
    2: <Step2Employment data={data} onUpdate={updateData} />,
    3: <Step3CreditCards data={data} onUpdate={updateData} />,
    4: <Step4Subscriptions data={data} onUpdate={updateData} />,
    5: <Step5Goals data={data} onUpdate={updateData} />,
    6: <Step6Complete data={data} />,
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center p-4"
      style={{ backgroundColor: "#17252A" }}
    >
      <div className="w-full max-w-lg">
        <div
          className="rounded-xl border p-8"
          style={{ backgroundColor: "#0D1F22", borderColor: "#2B7A78" }}
        >
          <ProgressBar current={step} total={TOTAL_STEPS} />

          {/* Step content */}
          <div className="mb-8">{steps[step]}</div>

          {/* Error */}
          {error && (
            <p className="text-sm text-red-400 mb-4 text-center">{error}</p>
          )}

          {/* Navigation buttons */}
          <div className="flex gap-3">
            {step > 1 && (
              <button
                type="button"
                onClick={handleBack}
                className="flex-1 py-2 rounded-lg text-sm font-medium transition-colors"
                style={{
                  backgroundColor: "#17252A",
                  border: "1px solid #2B7A78",
                  color: "#3AAFA9",
                }}
              >
                Back
              </button>
            )}

            {SKIPPABLE_STEPS.includes(step) && step !== TOTAL_STEPS && (
              <button
                type="button"
                onClick={() => setStep(step + 1)}
                className="py-2 px-4 rounded-lg text-sm transition-colors"
                style={{ color: "#2B7A78" }}
              >
                Skip
              </button>
            )}

            <button
              type="button"
              onClick={handleNext}
              disabled={!canProceed() || saving}
              className="flex-1 py-2 rounded-lg text-sm font-medium transition-colors disabled:opacity-40"
              style={{ backgroundColor: "#2B7A78", color: "#FEFFFF" }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.backgroundColor = "#3AAFA9")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.backgroundColor = "#2B7A78")
              }
            >
              {saving
                ? "Setting up your account..."
                : step === TOTAL_STEPS
                  ? "Take me to my dashboard"
                  : "Continue"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

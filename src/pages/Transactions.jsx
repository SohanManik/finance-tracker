import { useState, useEffect } from "react";
import { supabase } from "../lib/supabase";
import { useAuth } from "../lib/AuthContext";
import { useTheme } from "../lib/ThemeContext";

export default function Transactions() {
  const { user } = useAuth();
  const { theme } = useTheme();
  const USER_ID = user?.id;

  const [categories, setCategories] = useState([]);
  const [creditCards, setCreditCards] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [showCustomCategory, setShowCustomCategory] = useState(false);
  const [customCategory, setCustomCategory] = useState("");
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    transaction_date: new Date().toISOString().split("T")[0],
    amount: "",
    merchant_name: "",
    category_id: "",
    credit_card_id: "",
    transaction_type: "expense",
    notes: "",
  });

  useEffect(() => {
    if (USER_ID) {
      fetchCategories();
      fetchCreditCards();
      fetchExpenses();
    }
  }, [USER_ID]);

  async function fetchCategories() {
    const { data, error } = await supabase
      .from("categories")
      .select("*")
      .eq("user_id", USER_ID)
      .eq("is_deleted", false)
      .order("name");

    if (error) console.error("Categories error:", error.message);

    if (data && data.length === 0) {
      const defaults = [
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
      const rows = defaults.map((name) => ({
        user_id: USER_ID,
        name,
        is_default: true,
      }));
      const { data: seeded } = await supabase
        .from("categories")
        .insert(rows)
        .select();
      if (seeded)
        setCategories(seeded.sort((a, b) => a.name.localeCompare(b.name)));
    } else if (data) {
      setCategories(data);
    }
  }

  async function fetchCreditCards() {
    const { data, error } = await supabase
      .from("credit_cards")
      .select("*")
      .eq("user_id", USER_ID)
      .eq("is_deleted", false)
      .order("nickname");
    if (error) console.error("Credit cards error:", error.message);
    if (data) setCreditCards(data);
  }

  async function fetchExpenses() {
    const { data, error } = await supabase
      .from("expenses")
      .select("*, categories(name), credit_cards(nickname)")
      .eq("user_id", USER_ID)
      .eq("is_deleted", false)
      .order("transaction_date", { ascending: false });
    if (error) console.error("Expenses error:", error.message);
    if (data) setExpenses(data);
  }

  async function handleAddCustomCategory() {
    if (!customCategory.trim()) return;
    const { data, error } = await supabase
      .from("categories")
      .insert({
        user_id: USER_ID,
        name: customCategory.trim(),
        is_default: false,
      })
      .select()
      .single();
    if (error) {
      console.error("Error adding category:", error.message);
    } else {
      setCategories(
        [...categories, data].sort((a, b) => a.name.localeCompare(b.name)),
      );
      setForm({ ...form, category_id: data.id });
      setCustomCategory("");
      setShowCustomCategory(false);
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);

    const { error } = await supabase.from("expenses").insert({
      user_id: USER_ID,
      transaction_date: form.transaction_date,
      amount: parseFloat(form.amount),
      merchant_name: form.merchant_name,
      category_id: form.category_id || null,
      credit_card_id: form.credit_card_id || null,
      notes: form.notes || null,
    });

    if (error) {
      console.error("Error saving transaction:", error.message);
    } else {
      setForm({
        transaction_date: new Date().toISOString().split("T")[0],
        amount: "",
        merchant_name: "",
        category_id: "",
        credit_card_id: "",
        transaction_type: "expense",
        notes: "",
      });
      setShowForm(false);
      fetchExpenses();
    }
    setLoading(false);
  }

  async function handleDelete(id) {
    const { error } = await supabase
      .from("expenses")
      .update({ is_deleted: true })
      .eq("id", id)
      .eq("user_id", USER_ID);

    if (error) {
      console.error("Delete error:", error.message);
    } else {
      setExpenses(expenses.filter((e) => e.id !== id));
    }
  }

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold" style={{ color: theme.textPrimary }}>
          Transactions
        </h1>
        <button
          onClick={() => setShowForm(!showForm)}
          className="px-4 py-2 rounded-lg text-sm font-medium transition-colors"
          style={{ backgroundColor: theme.accent, color: theme.textPrimary }}
          onMouseEnter={(e) =>
            (e.currentTarget.style.backgroundColor = theme.accentHover)
          }
          onMouseLeave={(e) =>
            (e.currentTarget.style.backgroundColor = theme.accent)
          }
        >
          {showForm ? "Cancel" : "+ Add Transaction"}
        </button>
      </div>

      {showForm && (
        <div
          className="rounded-xl p-6 mb-8 border"
          style={{ backgroundColor: theme.bg, borderColor: theme.accent }}
        >
          <h2
            className="text-lg font-semibold mb-6"
            style={{ color: theme.textPrimary }}
          >
            New Transaction
          </h2>

          <div className="flex gap-2 mb-6">
            {["expense", "income"].map((type) => (
              <button
                key={type}
                type="button"
                onClick={() => setForm({ ...form, transaction_type: type })}
                className="px-4 py-1.5 rounded-full text-sm font-medium transition-colors capitalize"
                style={{
                  backgroundColor:
                    form.transaction_type === type
                      ? type === "expense"
                        ? theme.expenseBg
                        : theme.incomeBg
                      : theme.bgSecondary,
                  color:
                    form.transaction_type === type
                      ? theme.textPrimary
                      : theme.accentHover,
                  border: `1px solid ${
                    form.transaction_type === type
                      ? type === "expense"
                        ? theme.expense
                        : theme.income
                      : theme.accent
                  }`,
                }}
              >
                {type}
              </button>
            ))}
          </div>

          <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1">
              <label className="text-sm" style={{ color: theme.accentHover }}>
                Date
              </label>
              <input
                type="date"
                name="transaction_date"
                value={form.transaction_date}
                onChange={handleChange}
                required
                className="rounded-lg px-3 py-2 text-sm focus:outline-none"
                style={{
                  backgroundColor: theme.bgSecondary,
                  border: `1px solid ${theme.accent}`,
                  color: theme.textSecondary,
                }}
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-sm" style={{ color: theme.accentHover }}>
                Amount ($)
              </label>
              <input
                type="number"
                name="amount"
                value={form.amount}
                onChange={handleChange}
                placeholder="0.00"
                step="0.01"
                min="0"
                required
                className="rounded-lg px-3 py-2 text-sm focus:outline-none"
                style={{
                  backgroundColor: theme.bgSecondary,
                  border: `1px solid ${theme.accent}`,
                  color: theme.textSecondary,
                }}
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-sm" style={{ color: theme.accentHover }}>
                {form.transaction_type === "income" ? "Source" : "Merchant"}
              </label>
              <input
                type="text"
                name="merchant_name"
                value={form.merchant_name}
                onChange={handleChange}
                placeholder={
                  form.transaction_type === "income"
                    ? "e.g. General Dynamics"
                    : "e.g. Chipotle"
                }
                required
                className="rounded-lg px-3 py-2 text-sm focus:outline-none"
                style={{
                  backgroundColor: theme.bgSecondary,
                  border: `1px solid ${theme.accent}`,
                  color: theme.textSecondary,
                }}
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-sm" style={{ color: theme.accentHover }}>
                Category
              </label>
              {showCustomCategory ? (
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={customCategory}
                    onChange={(e) => setCustomCategory(e.target.value)}
                    placeholder="New category name"
                    className="flex-1 rounded-lg px-3 py-2 text-sm focus:outline-none"
                    style={{
                      backgroundColor: theme.bgSecondary,
                      border: `1px solid ${theme.accent}`,
                      color: theme.textSecondary,
                    }}
                  />
                  <button
                    type="button"
                    onClick={handleAddCustomCategory}
                    className="px-3 py-2 rounded-lg text-sm font-medium"
                    style={{
                      backgroundColor: theme.accent,
                      color: theme.textPrimary,
                    }}
                  >
                    Add
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowCustomCategory(false)}
                    className="px-3 py-2 rounded-lg text-sm"
                    style={{
                      backgroundColor: theme.bgSecondary,
                      border: `1px solid ${theme.accent}`,
                      color: theme.accentHover,
                    }}
                  >
                    Cancel
                  </button>
                </div>
              ) : (
                <div className="flex gap-2">
                  <select
                    name="category_id"
                    value={form.category_id}
                    onChange={handleChange}
                    className="flex-1 rounded-lg px-3 py-2 text-sm focus:outline-none"
                    style={{
                      backgroundColor: theme.bgSecondary,
                      border: `1px solid ${theme.accent}`,
                      color: theme.textSecondary,
                    }}
                  >
                    <option value="">Select a category</option>
                    {categories.map((cat) => (
                      <option
                        key={cat.id}
                        value={cat.id}
                        style={{
                          backgroundColor: theme.bgSecondary,
                          color: theme.textSecondary,
                        }}
                      >
                        {cat.name}
                      </option>
                    ))}
                  </select>
                  <button
                    type="button"
                    onClick={() => setShowCustomCategory(true)}
                    className="px-3 py-2 rounded-lg text-sm whitespace-nowrap"
                    style={{
                      backgroundColor: theme.bgSecondary,
                      border: `1px solid ${theme.accent}`,
                      color: theme.accentHover,
                    }}
                  >
                    + Custom
                  </button>
                </div>
              )}
            </div>

            {form.transaction_type === "expense" && (
              <div className="flex flex-col gap-1 col-span-2">
                <label className="text-sm" style={{ color: theme.accentHover }}>
                  Credit Card (optional)
                </label>
                <select
                  name="credit_card_id"
                  value={form.credit_card_id}
                  onChange={handleChange}
                  className="rounded-lg px-3 py-2 text-sm focus:outline-none"
                  style={{
                    backgroundColor: theme.bgSecondary,
                    border: `1px solid ${theme.accent}`,
                    color: theme.textSecondary,
                  }}
                >
                  <option value="">Cash / Debit / Other</option>
                  {creditCards.map((card) => (
                    <option key={card.id} value={card.id}>
                      {card.nickname}
                    </option>
                  ))}
                </select>
                {creditCards.length === 0 && (
                  <p
                    className="text-xs mt-1"
                    style={{ color: theme.textMuted }}
                  >
                    No credit cards added yet. Add them from the Credit Cards
                    page.
                  </p>
                )}
              </div>
            )}

            <div className="flex flex-col gap-1 col-span-2">
              <label className="text-sm" style={{ color: theme.accentHover }}>
                Notes (optional)
              </label>
              <input
                type="text"
                name="notes"
                value={form.notes}
                onChange={handleChange}
                placeholder="Any extra details..."
                className="rounded-lg px-3 py-2 text-sm focus:outline-none"
                style={{
                  backgroundColor: theme.bgSecondary,
                  border: `1px solid ${theme.accent}`,
                  color: theme.textSecondary,
                }}
              />
            </div>

            <div className="col-span-2 flex justify-end">
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-2 rounded-lg text-sm font-medium transition-colors disabled:opacity-50"
                style={{
                  backgroundColor: theme.accent,
                  color: theme.textPrimary,
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.backgroundColor = theme.accentHover)
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.backgroundColor = theme.accent)
                }
              >
                {loading ? "Saving..." : "Save Transaction"}
              </button>
            </div>
          </form>
        </div>
      )}

      <div
        className="rounded-xl overflow-hidden border"
        style={{
          borderColor: theme.accent,
          backgroundColor: theme.bgSecondary,
        }}
      >
        {expenses.length === 0 ? (
          <div
            className="p-12 text-center"
            style={{ color: theme.accentHover }}
          >
            No transactions yet. Add your first one above.
          </div>
        ) : (
          <table className="w-full">
            <thead>
              <tr className="border-b" style={{ borderColor: theme.accent }}>
                <th
                  className="text-left text-xs font-medium px-6 py-4"
                  style={{ color: theme.accentHover }}
                >
                  Date
                </th>
                <th
                  className="text-left text-xs font-medium px-6 py-4"
                  style={{ color: theme.accentHover }}
                >
                  Merchant
                </th>
                <th
                  className="text-left text-xs font-medium px-6 py-4"
                  style={{ color: theme.accentHover }}
                >
                  Category
                </th>
                <th
                  className="text-left text-xs font-medium px-6 py-4"
                  style={{ color: theme.accentHover }}
                >
                  Payment
                </th>
                <th
                  className="text-right text-xs font-medium px-6 py-4"
                  style={{ color: theme.accentHover }}
                >
                  Amount
                </th>
                <th className="px-6 py-4" />
              </tr>
            </thead>
            <tbody>
              {expenses.map((expense) => (
                <tr
                  key={expense.id}
                  className="border-b transition-colors group"
                  style={{ borderColor: theme.borderFaint }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.backgroundColor = theme.borderFaint)
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.backgroundColor = "transparent")
                  }
                >
                  <td
                    className="px-6 py-4 text-sm font-medium"
                    style={{ color: theme.textPrimary }}
                  >
                    {new Date(expense.transaction_date).toLocaleDateString()}
                  </td>
                  <td
                    className="px-6 py-4 text-sm font-medium"
                    style={{ color: theme.textPrimary }}
                  >
                    {expense.merchant_name}
                  </td>
                  <td
                    className="px-6 py-4 text-sm font-medium"
                    style={{ color: theme.accentHover }}
                  >
                    {expense.categories?.name || "Uncategorized"}
                  </td>
                  <td
                    className="px-6 py-4 text-sm font-medium"
                    style={{ color: theme.textPrimary }}
                  >
                    {expense.credit_cards?.nickname || "Cash / Debit"}
                  </td>
                  <td
                    className="px-6 py-4 text-sm text-right font-medium"
                    style={{ color: theme.expense }}
                  >
                    -${parseFloat(expense.amount).toFixed(2)}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button
                      onClick={() => handleDelete(expense.id)}
                      className="text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity"
                      style={{
                        color: theme.expense,
                        backgroundColor: theme.expenseBg + "50",
                      }}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

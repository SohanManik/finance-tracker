export default function Step6Complete({ data }) {
  const cardCount = data.credit_cards?.length || 0;
  const subCount = data.subscriptions?.length || 0;

  return (
    <div>
      <div className="text-center mb-8">
        <div className="text-6xl mb-4">🎉</div>
        <h2 className="text-2xl font-bold mb-2" style={{ color: "#FEFFFF" }}>
          You're all set, {data.full_name?.split(" ")[0] || "there"}!
        </h2>
        <p className="text-sm" style={{ color: "#3AAFA9" }}>
          Here's a summary of what we set up for you.
        </p>
      </div>

      <div className="flex flex-col gap-3 mb-8">
        {/* Goal */}
        <div
          className="flex items-center gap-4 px-4 py-3 rounded-xl"
          style={{ backgroundColor: "#17252A", border: "1px solid #2B7A7860" }}
        >
          <span className="text-2xl">📊</span>
          <div>
            <p className="text-xs" style={{ color: "#3AAFA9" }}>
              Primary goal
            </p>
            <p className="text-sm font-medium" style={{ color: "#FEFFFF" }}>
              {data.goal || "Not set"}
            </p>
          </div>
        </div>

        {/* Employment */}
        <div
          className="flex items-center gap-4 px-4 py-3 rounded-xl"
          style={{ backgroundColor: "#17252A", border: "1px solid #2B7A7860" }}
        >
          <span className="text-2xl">💼</span>
          <div>
            <p className="text-xs" style={{ color: "#3AAFA9" }}>
              Employment
            </p>
            <p className="text-sm font-medium" style={{ color: "#FEFFFF" }}>
              {data.employer_name || "Not set"} —{" "}
              {data.pay_frequency || "Not set"}
            </p>
          </div>
        </div>

        {/* Credit cards */}
        <div
          className="flex items-center gap-4 px-4 py-3 rounded-xl"
          style={{ backgroundColor: "#17252A", border: "1px solid #2B7A7860" }}
        >
          <span className="text-2xl">💳</span>
          <div>
            <p className="text-xs" style={{ color: "#3AAFA9" }}>
              Credit cards
            </p>
            <p className="text-sm font-medium" style={{ color: "#FEFFFF" }}>
              {cardCount > 0
                ? `${cardCount} card${cardCount > 1 ? "s" : ""} added`
                : "None added"}
            </p>
          </div>
        </div>

        {/* Subscriptions */}
        <div
          className="flex items-center gap-4 px-4 py-3 rounded-xl"
          style={{ backgroundColor: "#17252A", border: "1px solid #2B7A7860" }}
        >
          <span className="text-2xl">🔄</span>
          <div>
            <p className="text-xs" style={{ color: "#3AAFA9" }}>
              Subscriptions
            </p>
            <p className="text-sm font-medium" style={{ color: "#FEFFFF" }}>
              {subCount > 0
                ? `${subCount} subscription${subCount > 1 ? "s" : ""} tracked`
                : "None added"}
            </p>
          </div>
        </div>

        {/* Savings goal */}
        {data.goal_name && (
          <div
            className="flex items-center gap-4 px-4 py-3 rounded-xl"
            style={{
              backgroundColor: "#17252A",
              border: "1px solid #2B7A7860",
            }}
          >
            <span className="text-2xl">🎯</span>
            <div>
              <p className="text-xs" style={{ color: "#3AAFA9" }}>
                Savings goal
              </p>
              <p className="text-sm font-medium" style={{ color: "#FEFFFF" }}>
                {data.goal_name}
                {data.goal_amount
                  ? ` — $${parseFloat(data.goal_amount.replace(/[$,\s]/g, "")).toLocaleString()}`
                  : ""}
              </p>
            </div>
          </div>
        )}

        {/* Categories */}
        <div
          className="flex items-center gap-4 px-4 py-3 rounded-xl"
          style={{ backgroundColor: "#17252A", border: "1px solid #2B7A7860" }}
        >
          <span className="text-2xl">🏷️</span>
          <div>
            <p className="text-xs" style={{ color: "#3AAFA9" }}>
              Default categories
            </p>
            <p className="text-sm font-medium" style={{ color: "#FEFFFF" }}>
              17 categories seeded automatically
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

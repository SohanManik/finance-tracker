const PAY_FREQUENCIES = [
  { label: "Weekly", value: "weekly" },
  { label: "Biweekly", value: "biweekly" },
  { label: "Semi-monthly", value: "semi_monthly" },
  { label: "Monthly", value: "monthly" },
];

export default function Step2Employment({ data, onUpdate }) {
  return (
    <div>
      <div className="text-center mb-8">
        <div className="text-5xl mb-4">💼</div>
        <h2 className="text-2xl font-bold mb-2" style={{ color: "#FEFFFF" }}>
          How do you get paid?
        </h2>
        <p className="text-sm" style={{ color: "#3AAFA9" }}>
          This helps us track your income accurately.
        </p>
      </div>

      <div className="flex flex-col gap-4">
        {/* Employment type toggle */}
        <div className="flex flex-col gap-1">
          <label className="text-sm" style={{ color: "#3AAFA9" }}>
            Employment type
          </label>
          <div className="flex gap-2">
            {["hourly", "salaried"].map((type) => (
              <button
                key={type}
                type="button"
                onClick={() => onUpdate({ employment_type: type })}
                className="flex-1 py-2 rounded-lg text-sm font-medium capitalize transition-colors"
                style={{
                  backgroundColor:
                    data.employment_type === type ? "#2B7A78" : "#17252A",
                  border: `1px solid ${data.employment_type === type ? "#3AAFA9" : "#2B7A78"}`,
                  color: data.employment_type === type ? "#FEFFFF" : "#DEF2F1",
                }}
              >
                {type}
              </button>
            ))}
          </div>
        </div>

        {/* Employer name */}
        <div className="flex flex-col gap-1">
          <label className="text-sm" style={{ color: "#3AAFA9" }}>
            Employer name
          </label>
          <input
            type="text"
            value={data.employer_name || ""}
            onChange={(e) => onUpdate({ employer_name: e.target.value })}
            placeholder="e.g. General Dynamics"
            className="rounded-lg px-3 py-2 text-sm focus:outline-none"
            style={{
              backgroundColor: "#17252A",
              border: "1px solid #2B7A78",
              color: "#DEF2F1",
            }}
          />
        </div>

        {/* Pay rate */}
        <div className="flex flex-col gap-1">
          <label className="text-sm" style={{ color: "#3AAFA9" }}>
            {data.employment_type === "hourly"
              ? "Hourly rate"
              : "Annual salary"}
          </label>
          <input
            type="text"
            value={data.pay_rate || ""}
            onChange={(e) => onUpdate({ pay_rate: e.target.value })}
            placeholder={
              data.employment_type === "hourly" ? "e.g. $29.00" : "e.g. $75,000"
            }
            className="rounded-lg px-3 py-2 text-sm focus:outline-none"
            style={{
              backgroundColor: "#17252A",
              border: "1px solid #2B7A78",
              color: "#DEF2F1",
            }}
          />
        </div>

        {/* Pay frequency */}
        <div className="flex flex-col gap-1">
          <label className="text-sm" style={{ color: "#3AAFA9" }}>
            How often are you paid?
          </label>
          <div className="grid grid-cols-2 gap-2">
            {PAY_FREQUENCIES.map((freq) => (
              <button
                key={freq.value}
                type="button"
                onClick={() => onUpdate({ pay_frequency: freq.value })}
                className="py-2 rounded-lg text-sm font-medium transition-colors"
                style={{
                  backgroundColor:
                    data.pay_frequency === freq.value ? "#2B7A78" : "#17252A",
                  border: `1px solid ${data.pay_frequency === freq.value ? "#3AAFA9" : "#2B7A78"}`,
                  color:
                    data.pay_frequency === freq.value ? "#FEFFFF" : "#DEF2F1",
                }}
              >
                {freq.label}
              </button>
            ))}
          </div>
        </div>

        {/* Take home pay */}
        <div className="flex flex-col gap-1">
          <label className="text-sm" style={{ color: "#3AAFA9" }}>
            Approximate take-home per paycheck
          </label>
          <input
            type="text"
            value={data.take_home || ""}
            onChange={(e) => onUpdate({ take_home: e.target.value })}
            placeholder="e.g. $2,000.00"
            className="rounded-lg px-3 py-2 text-sm focus:outline-none"
            style={{
              backgroundColor: "#17252A",
              border: "1px solid #2B7A78",
              color: "#DEF2F1",
            }}
          />
        </div>
      </div>
    </div>
  );
}

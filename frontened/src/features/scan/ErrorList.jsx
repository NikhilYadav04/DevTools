import SpinnerMini from "../../ui/SpinnerMini";

export default function ErrorList({
  errorLinks,
  selectedErrors,
  setSelectedErrors,
  handleReplacement,
  replacing,
}) {
  return (
    <div>
      <h3>Select Error Links</h3>
      {errorLinks.map((link, index) => (
        <div key={index}>
          <input
            type="checkbox"
            checked={selectedErrors.includes(link)}
            onChange={(e) => {
              const checked = e.target.checked;
              setSelectedErrors((prev) =>
                checked ? [...prev, link] : prev.filter((l) => l !== link)
              );
            }}
          />
          <label>{link.url}</label>
        </div>
      ))}
      <button onClick={handleReplacement} disabled={replacing}>
        {replacing ? (
          <>
            <SpinnerMini />
            <p>Replacing...</p>
          </>
        ) : (
          "Get Gemini Replacements"
        )}
      </button>
    </div>
  );
}

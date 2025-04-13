import { useHistory } from "../features/history/useHistory";
import Spinner from "../ui/Spinner";

export default function History() {
  const { data, isLoading, isError } = useHistory();

  if (isLoading) return <Spinner />;
  if (isError) return <p>Error loading history</p>;

  if (!data || !data.history) {
    return <p>No history found</p>;
  }

  return (
    <div>
      <h2>History</h2>

      {data.history.length === 0 ? (
        <p>No history found</p>
      ) : (
        <ul>
          {data.history.map((entry, index) => (
            <li key={index}>
              <p>
                <strong>Input Link:</strong> {entry.userLink}
              </p>
              <p>
                <strong>Correct Links:</strong> {entry.correctLinks.join(", ")}
              </p>
              <p>
                <strong>Error Links:</strong> {entry.errorLinks.join(", ")}
              </p>
              <p>
                <strong>Replaced Links:</strong>{" "}
                {entry.replacedLinks.join(", ")}
              </p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

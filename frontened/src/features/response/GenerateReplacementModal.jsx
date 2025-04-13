import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import styled from "styled-components";
import Modal from "../../ui/Modal";
import { useGeminiReplacement } from "../../hooks/useLinks";
import { setLinks } from "../../services/linkSlice";

// Styled Components
const Button = styled.button`
  padding: 10px 15px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  margin-top: 10px;
  margin-right: 10px;

  &:disabled {
    background-color: var(--color-grey-300);
    cursor: not-allowed;
  }
`;

const Spinner = styled.div`
  border: 4px solid var(--color-grey-300);
  border-top: 4px solid var(--color-primary);
  border-radius: 50%;
  width: 30px;
  height: 30px;
  animation: spin 0.8s linear infinite;
  margin: 10px auto;

  @keyframes spin {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
`;

export default function GenerateReplacementModal() {
  const dispatch = useDispatch();
  const { errorLinks } = useSelector((state) => state.links);
  const [selectedErrors, setSelectedErrors] = useState([]);
  const [replacedLinks, setReplacedLinks] = useState([]);
  const [loading, setLoading] = useState(false);

  const { mutate: fetchReplacements } = useGeminiReplacement((data) => {
    let rawResponse = data?.response?.response || "";
    rawResponse = rawResponse.replace(/^```javascript\n|\n```$/g, "").trim();
    let parsedData;

    try {
      parsedData = JSON.parse(rawResponse);
    } catch (error) {
      console.error("Failed to parse JSON response:", error);
      setLoading(false);
      return;
    }

    const filteredLinks = parsedData.filter(
      (link) => link.trim().toLowerCase() !== "no"
    );

    setReplacedLinks(filteredLinks);
    dispatch(
      setLinks((state) => ({
        ...state.links,
        replacedLinks: filteredLinks,
      }))
    );
    setLoading(false);
  });

  const handleReplacement = () => {
    if (selectedErrors.length === 0) {
      alert("Please select at least one error link.");
      return;
    }
    setLoading(true); // Start loading
    fetchReplacements({ errorLinks: selectedErrors });
  };

  const toggleSelection = (link) => {
    setSelectedErrors((prev) =>
      prev.some((selected) => selected.url === link.url)
        ? prev.filter((selected) => selected.url !== link.url)
        : [...prev, link]
    );
  };

  const handleSelectAll = () => {
    if (selectedErrors.length === errorLinks.length) {
      setSelectedErrors([]); 
    } else {
      setSelectedErrors([...errorLinks]); 
    }
  };

  return (
    <Modal>
      <Modal.Open opens="generateLinks">
        <Button>Generate Replacement Links</Button>
      </Modal.Open>

      <Modal.Window name="generateLinks">
        {({ onCloseModal }) => (
          <>
            <h2>Generate Replacement Links</h2>

            <Button onClick={handleSelectAll}>
              {selectedErrors.length === errorLinks.length
                ? "Deselect All"
                : "Select All"}
            </Button>

            <table>
              <thead>
                <tr>
                  <th>Select</th>
                  <th>Error Links</th>
                </tr>
              </thead>
              <tbody>
                {errorLinks?.map((link, index) => (
                  <tr key={index}>
                    <td>
                      <input
                        type="checkbox"
                        checked={selectedErrors.some(
                          (selected) => selected.url === link.url
                        )}
                        onChange={() => toggleSelection(link)}
                      />
                    </td>
                    <td>{link.url}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            <Button onClick={handleReplacement} disabled={loading}>
              {loading ? "Generating..." : "Get Replacements"}
            </Button>

            {loading && <Spinner />}

            {!loading && replacedLinks.length > 0 && (
              <div>
                <h3>Replaced Links</h3>
                <ul>
                  {replacedLinks.map((link, index) => (
                    <li key={index}>{link}</li>
                  ))}
                </ul>
              </div>
            )}

            <Button onClick={onCloseModal}>Close</Button>
          </>
        )}
      </Modal.Window>
    </Modal>
  );
}

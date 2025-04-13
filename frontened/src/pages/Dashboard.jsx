import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import LinkTable from "../features/dashboard/LinkTable";
import GenerateReplacementModal from "../features/response/GenerateReplacementModal";
import styled from "styled-components";
import DashboardHeader from "../features/dashboard/DashboardHeader";
import Modal from "../ui/Modal";
import Spinner from "../ui/Spinner";
import { useGeminiReplacement } from "../hooks/useLinks";
import { setLinks } from "../services/linkSlice";
import Heading from "../ui/Heading";

const GridContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px;
  margin-top: 20px;
`;

const StyledSpan = styled.span`
  display: flex;
  justify-content: center;
  margin: 20px 0 0 0;
`;

const Button = styled.button`
  padding: 10px 15px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  background-color: ${(props) => (props.disabled ? "#ccc" : "#007bff")};
  color: ${(props) => (props.disabled ? "#666" : "#fff")};
`;

const ErrorListContainer = styled.div`
  margin: 10px 0;
`;

export default function Dashboard() {
  const dispatch = useDispatch();
  const linksState = useSelector((state) => state.links);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedErrorLinks, setSelectedErrorLinks] = useState([]);

  const { mutate: fetchReplacements } = useGeminiReplacement((data) => {
    if (!data?.response?.response) {
      console.error("Invalid API response structure:", data);
      setLoading(false);
      return;
    }

    let rawResponse = data.response.response
      .replace(/^```javascript\n|\n```$/g, "")
      .trim();

    let parsedData;
    try {
      parsedData = JSON.parse(rawResponse);
    } catch (error) {
      console.error("Failed to parse JSON response:", error, rawResponse);
      setLoading(false);
      return;
    }

    if (!Array.isArray(parsedData)) {
      console.error("Expected an array, got:", parsedData);
      setLoading(false);
      return;
    }

    dispatch(
      setLinks({
        ...linksState,
        replacedLinks: parsedData,
        errorLinks: [],
      })
    );

    console.log("Updated replacedLinks:", parsedData);
    setLoading(false);
  });

  const handleOpenModal = () => {
    setIsModalOpen(true);
    setSelectedErrorLinks([]);
  };

  const handleSelectErrorLink = (link) => {
    setSelectedErrorLinks((prev) =>
      prev.includes(link) ? prev.filter((l) => l !== link) : [...prev, link]
    );
  };

  const handleRegenerateLinks = () => {
    if (selectedErrorLinks.length === 0) return;
    setLoading(true);
    fetchReplacements({ errorLinks: selectedErrorLinks });
  };

  return (
    <div>
      <Heading as="h1">Dashboard</Heading>
      <DashboardHeader />

      <StyledSpan>
        <Button onClick={handleOpenModal} disabled={loading}>
          {loading ? "Generating..." : "Generate Replacement Links"}
        </Button>
      </StyledSpan>

      {isModalOpen && (
        <Modal>
          <Modal.Window
            name="generateLinks"
            onClose={() => setIsModalOpen(false)}
          >
            {loading ? (
              <Spinner />
            ) : (
              <>
                {linksState.errorLinks && linksState.errorLinks.length > 0 ? (
                  <div>
                    <h3>Select Error Links to Regenerate</h3>
                    <ErrorListContainer>
                      <ul>
                        {linksState.errorLinks.map((link, index) => (
                          <li key={index}>
                            <input
                              type="checkbox"
                              checked={selectedErrorLinks.includes(link)}
                              onChange={() => handleSelectErrorLink(link)}
                              disabled={loading}
                            />
                            {link.url}
                          </li>
                        ))}
                      </ul>
                    </ErrorListContainer>
                    <Button
                      onClick={handleRegenerateLinks}
                      disabled={selectedErrorLinks.length === 0 || loading}
                    >
                      {loading ? "Generating..." : "Regenerate Links"}
                    </Button>
                  </div>
                ) : (
                  <GenerateReplacementModal
                    replacedLinks={linksState.replacedLinks}
                  />
                )}
              </>
            )}
          </Modal.Window>
        </Modal>
      )}

      <GridContainer>
        <LinkTable
          title="Success Links"
          links={linksState.successLinks || []}
        />
        <LinkTable title="Error Links" links={linksState.errorLinks || []} />
        <LinkTable
          title="Internal Links"
          links={linksState.internalLinks || []}
        />
        <LinkTable
          title="External Links"
          links={linksState.externalLinks || []}
        />
      </GridContainer>
    </div>
  );
}

import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useScanWebsite } from "../hooks/useLinks";
import { useNavigate } from "react-router-dom";
import ScanForm from "../features/scan/ScanForm";
import { toast } from "react-toastify";
import { setLinks } from "../services/linkSlice";
import { setMaxPage, setCategory, setUserLink } from "../services/homeSlice"; // ✅ FIXED
import Spinner from "../ui/Spinner";
import Heading from "../ui/Heading";
import styled from "styled-components";

const PageWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 3rem 2rem;
  min-height: 90vh;
  background: #f9f9f9;
`;

const ControlsWrapper = styled.div`
  background: #ffffff;
  border-radius: 16px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.06);
  padding: 2rem;
  width: 100%;
  max-width: 600px;
  margin-bottom: 2rem;
`;

const ControlGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin-bottom: 1.5rem;

  @media (min-width: 640px) {
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
  }
`;

const Label = styled.label`
  font-weight: 600;
  color: #333;
  min-width: 100px;
`;

const Select = styled.select`
  padding: 0.6rem 1rem;
  border-radius: 8px;
  border: 1px solid #ccc;
  width: 100%;
  max-width: 200px;
`;

const Input = styled.input`
  padding: 0.6rem 1rem;
  border-radius: 8px;
  border: 1px solid #ccc;
  width: 100%;
  max-width: 200px;
`;

export default function Home() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [userLink, setUserLinkLocal] = useState(""); // renamed local useState for clarity

  const maxPage = useSelector((state) => state.home.maxPage);
  const category = useSelector((state) => state.home.category);
  const user = useSelector((state) => state.auth.user);
  const userEmail = user?.email;

  const { scanWebsite, isScanning } = useScanWebsite((data) => {
    dispatch(
      setLinks({
        successLinks: data.successLinks || [],
        errorLinks: data.errorLinks || [],
        replacedLinks: data.replacedLinks || [],
        internalLinks: data.internalLinks || [],
        externalLinks: data.externalLinks || [],
      })
    );
    dispatch(setUserLink(userLink));
    navigate("/dashboard");
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    const urlPattern = /^(ftp|http|https):\/\/[^ "]+$/;

    if (!userLink.trim() || !urlPattern.test(userLink.trim())) {
      toast.error("Please enter a valid URL.");
      return;
    }

    if (!userEmail) {
      toast.error("User email not found. Please log in again.");
      return;
    }

    // ✅ SET REDUX FIRST!
    dispatch(setUserLink(userLink));

    // ✅ THEN CALL scanWebsite
    scanWebsite({ userLink, maxPage, category });

    // ✅ FINALLY CLEAR THE INPUT
    setUserLinkLocal("");
  };

  return (
    <PageWrapper>
      {isScanning && <Spinner />}

      <Heading as="h1">🔗 Link Fixer</Heading>

      <ControlsWrapper>
        <ControlGroup>
          <Label htmlFor="category">Category:</Label>
          <Select
            id="category"
            value={category}
            onChange={(e) => dispatch(setCategory(e.target.value))}
          >
            <option value="true">True</option>
            <option value="false">False</option>
          </Select>
        </ControlGroup>

        <ControlGroup>
          <Label htmlFor="maxPage">Max Page:</Label>
          <Input
            id="maxPage"
            type="number"
            min="1"
            value={maxPage}
            onChange={(e) => dispatch(setMaxPage(Number(e.target.value)))}
          />
        </ControlGroup>
      </ControlsWrapper>

      <ScanForm
        userLink={userLink}
        setUserLink={setUserLinkLocal}
        handleSubmit={handleSubmit}
        isScanning={isScanning}
      />
    </PageWrapper>
  );
}

import { useState } from "react";
import styled from "styled-components";
import { toast } from "react-toastify";
import { useNotifyWebsite } from "../hooks/useLinks";
import { useSelector } from "react-redux";
import Spinner from "../ui/Spinner";
import Heading from "../ui/Heading";

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 10rem;
  padding: 4rem 2rem;
`;

const Form = styled.div`
  background: white;
  padding: 2rem;
  border-radius: 20px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  max-width: 400px;
  width: 100%;
`;

const Label = styled.label`
  font-size: 1.7rem;
  font-weight: 500;
  margin-bottom: 1rem;
  display: block;
  color: #444;
`;

const StyledInput = styled.input`
  width: 100%;
  height: 45px;
  border-radius: 12px;
  padding: 10px 15px;
  font-size: 1.5rem;
  margin-top: 0.5rem;
  border: 1px solid #ccc;
  margin-bottom: 1.5rem;

  &:focus {
    outline: none;
    border-color: #007bff;
    box-shadow: 0 0 0 2px rgba(0, 123, 255, 0.1);
  }
`;

const Button = styled.button`
  width: 100%;
  padding: 12px 20px;
  border-radius: 12px;
  font-size: 1.5rem;
  background-color: ${(props) => (props.disabled ? "#ccc" : "#007bff")};
  color: white;
  border: none;
  cursor: ${(props) => (props.disabled ? "not-allowed" : "pointer")};
  transition: background 0.3s ease;

  &:hover {
    background-color: ${(props) => (props.disabled ? "#ccc" : "#0056b3")};
  }
`;

export default function Notify() {
  const [futureDate, setFutureDate] = useState("");

  const userLink = useSelector((state) => state.home.userLink);
  const userEmail = useSelector((state) => state.auth.user?.email);
  const maxPage = useSelector((state) => state.home.maxPage);
  const category = useSelector((state) => state.home.category);

  const calculateMinutes = () => {
    if (!futureDate) {
      toast.error("Please select a valid future time.");
      return null;
    }

    const selectedTime = Date.parse(futureDate);
    if (isNaN(selectedTime)) {
      toast.error("Invalid date format.");
      return null;
    }

    const currentTime = Date.now();
    const diffMinutes = Math.floor((selectedTime - currentTime) / 60000);

    if (diffMinutes < 1) {
      toast.error("Time must be at least 1 minute in the future.");
      return null;
    }

    return diffMinutes.toString();
  };

  const { notifyWebsite, isNotifying } = useNotifyWebsite();

  const handleNotify = () => {
    const futureMinutes = calculateMinutes();

    if (futureMinutes === null) return;

    const payload = {
      futureMinutes: String(futureMinutes),
      userLink: String(userLink),
      // email: String(userEmail),
      email: String("kartikagarwal9119063420@gmail.com"),
      maxPage: String(maxPage),
      category: String(category),
    };

    notifyWebsite(payload, {
      onSuccess: () => {
        setFutureDate("");
      },
    });
  };

  return (
    <Wrapper>
      <Heading as="h2">🔔 Notify Me Later</Heading>
      <Form>
        {isNotifying && <Spinner />}
        <Label htmlFor="futureDate">Select Future Time:</Label>
        <StyledInput
          id="futureDate"
          type="datetime-local"
          value={futureDate}
          onChange={(e) => setFutureDate(e.target.value)}
          disabled={isNotifying}
        />
        <Button onClick={handleNotify} disabled={isNotifying || !futureDate}>
          {isNotifying ? "Sending..." : "Send Notification"}
        </Button>
      </Form>
    </Wrapper>
  );
}

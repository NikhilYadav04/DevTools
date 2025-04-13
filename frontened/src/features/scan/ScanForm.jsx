import styled from "styled-components";

const StyledDiv = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
`;

const StyledInput = styled.input`
  width: 30vw;
  height: 8vh;
  border-radius: 100px;
  padding: 10px 15px 10px 15px;
`;

const StyledButton = styled.button`
  width: 10vw;
  height: 8vh;
  border-radius: 100px;
  padding: 10px 15px 10px 15px;
`;

export default function ScanForm({
  userLink,
  setUserLink,
  handleSubmit,
  isScanning,
}) {
  return (
    <StyledDiv>
      <StyledInput
        type="text"
        value={userLink}
        onChange={(e) => setUserLink(e.target.value)}
        placeholder="Enter main link"
      />
      {userLink.length > 0 && (
        <StyledButton onClick={handleSubmit} disabled={isScanning}>
          Submit
        </StyledButton>
      )}
    </StyledDiv>
  );
}

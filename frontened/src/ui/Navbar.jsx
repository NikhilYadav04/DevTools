import React from "react";
import { Link, useLocation } from "react-router-dom";
import styled from "styled-components";
import { useSelector } from "react-redux";

const NavWrapper = styled.nav`
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: #f8f9fa;
  padding: 1rem 2rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
`;

const NavGroup = styled.div`
  display: flex;
  gap: 1.5rem;
`;

const StyledLink = styled(Link)`
  font-weight: 600;
  color: #333;
  text-decoration: none;
  padding: 0.5rem 1rem;
  border-radius: 6px;
  transition: background 0.2s;

  &:hover {
    background: #e2e6ea;
  }

  &.active {
    color: #007bff;
  }

  &.disabled {
    pointer-events: none;
    color: #aaa;
  }
`;

const AuthButton = styled.button`
  background: none;
  border: none;
  font-weight: 600;
  color: #007bff;
  cursor: pointer;
`;

export default function Navbar() {
  const location = useLocation();
  const user = useSelector((state) => state.auth.user);

  return (
    <NavWrapper>
      <NavGroup>
        <StyledLink
          to="/home"
          className={location.pathname === "/home" ? "active" : ""}
        >
          Home
        </StyledLink>
        <StyledLink
          to="/dashboard"
          className={location.pathname === "/dashboard" ? "active" : ""}
        >
          Dashboard
        </StyledLink>
        <StyledLink
          to="/notify"
          className={location.pathname === "/notify" ? "active" : ""}
        >
          Notify
        </StyledLink>
      </NavGroup>

      <div>
        {user ? (
          <AuthButton onClick={() => console.log("Logout logic here")}>
            Logout
          </AuthButton>
        ) : (
          <Link to="/login">
            <AuthButton>Login</AuthButton>
          </Link>
        )}
      </div>
    </NavWrapper>
  );
}

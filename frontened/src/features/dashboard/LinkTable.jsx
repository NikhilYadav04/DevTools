import { useState } from "react";
import styled from "styled-components";
import Table from "../../ui/Table";
import LinkRow from "./LinkRow";

const ITEMS_PER_PAGE = 5;

const TableContainer = styled.div`
  width: 100%;
  max-width: 700px; 
  height: 400px; 
  display: flex;
  flex-direction: column;
  background-color: var(--color-grey-50);
  padding: 1rem;
  border-radius: var(--border-radius-md);
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  margin-left: auto;
  margin-right: auto;
`;

const ScrollableTable = styled.div`
  flex: 1;
  overflow-y: auto;

  &::-webkit-scrollbar {
    display: none;
  }

  scrollbar-width: none;
`;

const PaginationControls = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 10px;
  gap: 10px;
`;

const PaginationButton = styled.button`
  padding: 5px 10px;
  border: none;
  background-color: var(--color-grey-200);
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;

  &:disabled {
    background-color: var(--color-grey-300);
    cursor: not-allowed;
  }
`;

export default function LinkTable({ title, links }) {
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = Math.ceil(links.length / ITEMS_PER_PAGE);

  const currentLinks = links.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  return (
    <TableContainer>
      <h3>{title}</h3>
      <ScrollableTable>
        <Table columns="1fr">
          <Table.Header>
            <div>URL</div>
          </Table.Header>
          <Table.Body
            data={currentLinks}
            render={(link) => <LinkRow link={link} key={link.url} />}
          />
        </Table>
      </ScrollableTable>
      <PaginationControls>
        <PaginationButton
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
        >
          Prev
        </PaginationButton>
        <span>
          Page {currentPage} of {totalPages}
        </span>
        <PaginationButton
          onClick={() =>
            setCurrentPage((prev) => Math.min(prev + 1, totalPages))
          }
          disabled={currentPage === totalPages}
        >
          Next
        </PaginationButton>
      </PaginationControls>
    </TableContainer>
  );
}

import { useSelector } from "react-redux";
import styled from "styled-components";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
} from "recharts";

const HeaderContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 1.5rem 2rem;
  background-color: var(--color-grey-100);
  border-radius: var(--border-radius-md);
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
`;

const GraphsContainer = styled.div`
  display: flex;
  justify-content: center;
  gap: 20px;
  width: 100%;
  max-width: 900px;
`;

const GraphWrapper = styled.div`
  flex: 1;
  height: 250px;
  background-color: var(--color-grey-50);
  padding: 1rem;
  border-radius: var(--border-radius-md);
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  display: flex;
  align-items: center;
  justify-content: center;
`;

const Spinner = styled.div`
  border: 4px solid var(--color-grey-300);
  border-top: 4px solid var(--color-primary);
  border-radius: 50%;
  width: 40px;
  height: 40px;
  animation: spin 0.8s linear infinite;

  @keyframes spin {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
`;

export default function DashboardHeader() {
  const linksState = useSelector((state) => state.links);
  const { successLinks, errorLinks, internalLinks, externalLinks, loading } =
    linksState;

  if (loading) {
    return (
      <HeaderContainer>
        <h2>Loading Link Data...</h2>
        <Spinner />
      </HeaderContainer>
    );
  }

  if (!successLinks || !errorLinks || !internalLinks || !externalLinks) {
    return (
      <HeaderContainer>
        <h2>No Data Available</h2>
      </HeaderContainer>
    );
  }

  const linkData = [
    { name: "Success", value: successLinks.length, color: "#22c55e" },
    { name: "Error", value: errorLinks.length, color: "#ef4444" },
    { name: "Internal", value: internalLinks.length, color: "#3b82f6" },
    { name: "External", value: externalLinks.length, color: "#eab308" },
  ];

  return (
    <HeaderContainer>
      <h2>Link Overview</h2>
      <GraphsContainer>
        {/* Bar Chart */}
        <GraphWrapper>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={linkData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" tick={{ fontSize: 12, fill: "#374151" }} />
              <YAxis
                tick={{ fontSize: 12, fill: "#374151" }}
                allowDecimals={false}
              />
              <Tooltip />
              <Legend />
              <Bar dataKey="value" radius={[8, 8, 0, 0]} barSize={40}>
                {linkData.map((entry, index) => (
                  <Cell key={index} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </GraphWrapper>

        <GraphWrapper>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={linkData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={80}
                label
              >
                {linkData.map((entry, index) => (
                  <Cell key={index} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </GraphWrapper>
      </GraphsContainer>
    </HeaderContainer>
  );
}

import { useEffect, useState } from "react";
import { Button } from "flowbite-react";

type Order = "asc" | "desc";
type OrderBy = "login" | "location" | "email" | "company";

const SavedCandidatesTable = () => {
  const [candidates, setCandidates] = useState<any[]>([]);
  const [filter, setFilter] = useState<string>("");
  const [order, setOrder] = useState<Order>("asc");
  const [orderBy, setOrderBy] = useState<OrderBy>("login");

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("candidates") || "[]");
    setCandidates(stored);
  }, []);

  const handleReject = (login: string) => {
    const updated = candidates.filter((c) => c.login !== login);
    setCandidates(updated);
    localStorage.setItem("candidates", JSON.stringify(updated));
  };

  const handleSort = (column: OrderBy) => {
    if (orderBy === column) {
      setOrder(order === "asc" ? "desc" : "asc");
    } else {
      setOrderBy(column);
      setOrder("asc");
    }
  };

  const filteredCandidates = candidates
    .filter((c) => c.login.toLowerCase().includes(filter.toLowerCase()))
    .sort((a, b) => {
      const aValue = (a[orderBy] || "").toLowerCase();
      const bValue = (b[orderBy] || "").toLowerCase();
      if (aValue < bValue) return order === "asc" ? -1 : 1;
      if (aValue > bValue) return order === "asc" ? 1 : -1;
      return 0;
    });

  if (filteredCandidates.length === 0) {
    return (
      <div className="mt-4">
        <input
          type="text"
          placeholder="Filter by name"
          value={filter}
          onChange={e => setFilter(e.target.value)}
          className="mb-2 px-2 py-1 border rounded"
        />
        <p className="text-center">No candidates selected.</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto mt-8">
      <input
        type="text"
        placeholder="Filter by name"
        value={filter}
        onChange={e => setFilter(e.target.value)}
        className="mb-2 px-2 py-1 border rounded"
      />
      <table className="min-w-full text-sm text-left text-gray-500 dark:text-gray-400 border">
        <thead className="bg-gray-700 text-white">
          <tr>
            <th className="px-4 py-2">Image</th>
            <th className="px-4 py-2 cursor-pointer" onClick={() => handleSort("login")}>
              Name {orderBy === "login" && (order === "asc" ? "▲" : "▼")}
            </th>
            <th className="px-4 py-2 cursor-pointer" onClick={() => handleSort("location")}>
              Location {orderBy === "location" && (order === "asc" ? "▲" : "▼")}
            </th>
            <th className="px-4 py-2 cursor-pointer" onClick={() => handleSort("email")}>
              Email {orderBy === "email" && (order === "asc" ? "▲" : "▼")}
            </th>
            <th className="px-4 py-2 cursor-pointer" onClick={() => handleSort("company")}>
              Company {orderBy === "company" && (order === "asc" ? "▲" : "▼")}
            </th>
            <th className="px-4 py-2">Bio</th>
            <th className="px-4 py-2">Reject</th>
          </tr>
        </thead>
        <tbody>
          {filteredCandidates.map((c) => (
            <tr key={c.login} className="border-b">
              <td className="px-4 py-2">
                <img src={c.avatar_url || "noCandidate.jpg"} alt={c.login} className="w-12 h-12 rounded-full" />
              </td>
              <td className="px-4 py-2">{c.login}</td>
              <td className="px-4 py-2">{c.location || "No location"}</td>
              <td className="px-4 py-2">{c.email || "No email"}</td>
              <td className="px-4 py-2">{c.company || "No company"}</td>
              <td className="px-4 py-2">{c.bio || "No bio"}</td>
              <td className="px-4 py-2">
                <Button color="red" size="xs" onClick={() => handleReject(c.login)}>
                  Reject
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default SavedCandidatesTable;
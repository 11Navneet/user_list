import React, { useState, useEffect } from "react";

function UserList() {
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState(
    localStorage.getItem("pastSearchTerm") || ""
  );
  const [sortOrder, setSortOrder] = useState("asc");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const response = await fetch(
          "https://jsonplaceholder.typicode.com/users"
        );
        const data = await response.json();
        setUsers(data);
      } catch (error) {
        setError(`Error fetching users: ${error.message}`);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const filteredUsers = users.filter((user) =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const sortedUsers = sortOrder === "asc" ? [...filteredUsers].sort((a, b) => (a.name > b.name ? 1 : -1)) : [...filteredUsers].sort((a, b) => (a.name < b.name ? 1 : -1));

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    localStorage.setItem("pastSearchTerm", e.target.value);
  };

  const handleSortChange = () => {
    setSortOrder(sortOrder === "asc" ? "desc" : "asc");
  };

  return (
    <div className="user-list-div">
      <h1>User List</h1>
      <div className="user-list-input-div">
        {isLoading ? (
          <p>Loading users...</p>
        ) : error ? (
          <p className="error-message">Error: {error}</p>
        ) : (
          <>
            <input
              type="text"
              placeholder="Search by name"
              value={searchTerm}
              onChange={handleSearchChange}
            />
            <button onClick={handleSortChange}>
              Sort by {sortOrder === "asc" ? "Descending" : "Ascending"}
            </button>
          </>
        )}
      </div>
      <ul className="user-list">
        {sortedUsers.map((user, index) => (
          <li key={user.id}>
            {index + 1}. {user.name} - {user.email}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default UserList;

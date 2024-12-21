import { useNavigate } from "react-router-dom";
import "./List.css";
import { useEffect, useState } from "react";
import axios from "axios";
import { FaEdit, FaTrashAlt, FaPlus } from "react-icons/fa";

const Lists = () => {
  const accessToken = localStorage.getItem("accessToken");
  const navigate = useNavigate();
  const [lists, setLists] = useState([]);
  const [selectedMovies, setSelectedMovies] = useState([]);

  const getMovies = () => {
    axios
      .get("/movies")
      .then((response) => {
        console.log(response.data);
        setLists(response.data);
      })
      .catch((error) => {
        console.error("Error fetching movies:", error);
        alert("Failed to fetch movies. Please try again.");
      });
  };

  useEffect(() => {
    getMovies();
  }, []);

  const handleDelete = (id) => {
    const isConfirm = window.confirm(
      "Are you sure you want to delete this data?"
    );
    if (isConfirm) {
      axios
        .delete(`/movies/${id}`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        })
        .then(() => {
          setLists((prevLists) => prevLists.filter((movie) => movie.id !== id));
          alert("Movie deleted successfully!");
        })
        .catch((error) => {
          console.error("Error deleting movie:", error);
          alert("Failed to delete the movie. Please try again.");
        });
    }
  };

  const handleEdit = (id) => {
    navigate(`/main/movies/form/${id}`);
  };

  const handleSelectRow = (id) => {
    setSelectedMovies((prevSelected) =>
      prevSelected.includes(id)
        ? prevSelected.filter((movieId) => movieId !== id)
        : [...prevSelected, id]
    );
  };

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedMovies(lists.map((movie) => movie.id));
    } else {
      setSelectedMovies([]);
    }
  };

  const handleBatchDelete = () => {
    const isConfirm = window.confirm(
      "Are you sure you want to delete the selected movies?"
    );
    if (isConfirm && selectedMovies.length > 0) {
      selectedMovies.forEach((id) => {
        axios
          .delete(`/movies/${id}`, {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          })
          .then(() => {
            setLists((prevLists) =>
              prevLists.filter((movie) => !selectedMovies.includes(movie.id))
            );
          })
          .catch((error) => {
            console.error("Error deleting movie:", error);
            alert("Failed to delete the movie. Please try again.");
          });
      });
      alert("Selected movies deleted successfully!");
      setSelectedMovies([]);
    }
  };

  return (
    <div className="lists-container">
      <div className="create-container">
        <button
          className="delete batch-action"
          type="button"
          onClick={handleBatchDelete}
          disabled={selectedMovies.length === 0}
        >
          <FaTrashAlt />
        </button>
        <button
          className="create"
          type="button"
          onClick={() => navigate("/main/movies/form")}
        >
          <FaPlus />
        </button>
      </div>

      <div className="table-container">
        <table className="movie-lists">
          <thead>
            <tr>
              <th>
                <input
                  type="checkbox"
                  onChange={handleSelectAll}
                  checked={selectedMovies.length === lists.length}
                />
              </th>
              <th>ID</th>
              <th>Title</th>
              <th>Date Created</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {lists.map((movie) => (
              <tr key={movie.id}>
                <td>
                  <input
                    type="checkbox"
                    checked={selectedMovies.includes(movie.id)}
                    onChange={() => handleSelectRow(movie.id)}
                  />
                </td>
                <td className="id-cell">{movie.id}</td>
                <td className="title-cell">
                  <img
                    src={movie.posterPath}
                    alt="Movie Poster"
                    className="movie-poster"
                  />
                  {movie.title}
                </td>
                <td className="date-cell">
                  {movie.dateCreated
                    ? new Date(movie.dateCreated).toLocaleDateString()
                    : "N/A"}
                </td>

                <td className="action-cell">
                  <button
                    className="edit"
                    type="button"
                    onClick={() => handleEdit(movie.id)}
                  >
                    <FaEdit />
                  </button>
                  <button
                    className="delete"
                    type="button"
                    onClick={() => handleDelete(movie.id)}
                  >
                    <FaTrashAlt />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Lists;

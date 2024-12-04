import { useEffect, useState } from "react";
import { useMovieContext } from "../../../../context/MovieContext";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import "./View.css";

function View() {
  const { movie, setMovie } = useMovieContext();
  const { movieId } = useParams();
  const navigate = useNavigate();
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);

  useEffect(() => {
    if (movieId) {
      axios
        .get(`/movies/${movieId}`)
        .then((response) => {
          setMovie(response.data);
        })
        .catch((error) => {
          console.error(error);
          navigate("/");
        });
    }
  }, [movieId, setMovie, navigate]);

  useEffect(() => {
    if (movie?.photos?.length > 1) {
      const interval = setInterval(() => {
        setCurrentPhotoIndex((prevIndex) =>
          prevIndex === movie.photos.length - 1 ? 0 : prevIndex + 1
        );
      }, 3000); // 3 seconds slide interval

      return () => clearInterval(interval);
    }
  }, [movie]);

  return (
    <div className="view-container">
      {movie ? (
        <>
          <h1 className="movie-title">{movie.title}</h1>

          {movie.photos && movie.photos.length > 0 && (
            <div className="photo-slider">
              <img
                src={movie.photos[currentPhotoIndex].url}
                alt="Movie Photo"
                className="movie-photo"
              />
            </div>
          )}

          <div className="movie-details">
            <h3 className="movie-overview">{movie.overview}</h3>
          </div>

          {movie.casts && movie.casts.length > 0 ? (
            <div className="section">
              <h2>Cast & Crew</h2>
              <ul className="cast-list">
                {movie.casts.map((cast, index) => (
                  <li key={index}>{cast.name}</li>
                ))}
              </ul>
            </div>
          ) : (
            <p>No cast information available</p>
          )}

          {movie.videos && movie.videos.length > 0 ? (
            <div className="section">
              <h2>Video</h2>
              <div className="video-container">
                <video controls width="100%">
                  <source src={movie.videos[0].url} type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
              </div>
            </div>
          ) : (
            <p>No videos available</p>
          )}
        </>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
}

export default View;

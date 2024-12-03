import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import MovieCards from "../../../../components/MovieCards/MovieCards"; // Import with an uppercase M
import { useMovieContext } from "../../../../context/MovieContext";
import "./Home.css";

const Home = () => {
  const navigate = useNavigate();
  const [featuredMovie, setFeaturedMovie] = useState(null);
  const { movieList, setMovieList, setMovie } = useMovieContext();

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const response = await axios.get("/movies");
        setMovieList(response.data);
        const randomIndex = Math.floor(Math.random() * response.data.length);
        setFeaturedMovie(response.data[randomIndex]);
      } catch (error) {
        console.error(error);
      }
    };
    fetchMovies();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      if (movieList.length) {
        const randomIndex = Math.floor(Math.random() * movieList.length);
        setFeaturedMovie(movieList[randomIndex]);
      }
    }, 5000);
    return () => clearInterval(interval);
  }, [movieList]);

  return (
    <div className="home-container">
      {featuredMovie && movieList.length ? (
        <div className="featured-movie-container">
          <div
            className="featured-movie-backdrop"
            style={{
              background: `url(${
                featuredMovie.backdropPath !==
                "https://image.tmdb.org/t/p/original/undefined"
                  ? featuredMovie.backdropPath
                  : featuredMovie.posterPath
              }) no-repeat center center / cover`,
            }}
          >
            <span className="featured-movie-title">{featuredMovie.title}</span>
          </div>
        </div>
      ) : (
        <div className="featured-movie-loader"></div>
      )}
      <div className="movie-list-grid">
        {movieList.map((movie) => (
          <MovieCards
            key={movie.id}
            movie={movie}
            onClick={() => {
              navigate(`/view/${movie.id}`);
              setMovie(movie);
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default Home;

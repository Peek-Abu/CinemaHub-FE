import { useState, useEffect } from "react";
import * as reelsClient from "../MongoDBClients/reelsClient.js";
import { FaTrash } from "react-icons/fa";

function ReelModal({ setModal, selectedReel, reels, setReels }) {
    const [formData, setFormData] = useState(selectedReel);

    useEffect(() => {setFormData(selectedReel) }, [selectedReel]); // Add selectedReel to dependency array

    const handleDelete =  (id) => {
        formData.movies = formData.movies.filter((movie) => movie._id !== id);
        setFormData({
            ...formData,
            movies: formData.movies
        })
        console.log(formData)
    }

    const handleDeleteReel = async () => {
        await reelsClient.deleteReel(selectedReel._id);
        setModal(false);
    }

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        // Get only IDs of movies
        const movieIds = formData.movies.map((movie) => movie._id);
        setFormData({ ...formData, movies: movieIds });
        const response = await reelsClient.updateReel(selectedReel._id, formData);
        console.log(response)
        setModal(false);

    };

    return (
        <div className="container mt-2">
            <h1 className="text-center">Editing Reel "{selectedReel.title}"</h1>
            <div>
                <div className="my-2">
                    <label htmlFor="title" className="form-label">
                        <h5>Title: </h5>
                    </label>
                    <input
                        type="text"
                        className="form-control"
                        id="title"
                        name="title"
                        value={formData.title}
                        onChange={handleChange}
                        required
                    />
                </div>

                <h5> Movies: </h5>

                <div className="mb-3 list-group">
                    {formData.movies.map(
                        (movie) => (
                            <div className="list-group-item">
                                {movie.title}
                                <button
                                    className={"wd-min-height-50 btn float-end"}
                                    onClick={() => handleDelete(movie._id)}
                                >
                                    <FaTrash size={40} color={"red"} />
                                </button>
                            </div>
                        )
                    )}
                </div>
                <button className="float-end btn btn-success" onClick={handleSubmit}>Submit</button>
                <button className="float-end btn btn-danger me-2" onClick={() => handleDeleteReel()}>Delete Reel</button>
            </div>

        </div>
    );
}

export default ReelModal;

import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
const apiUrl = import.meta.env.VITE_BASE_API_URL;
import "/src/App.css";

export default function PostList() {
  const defaultFormData = {
    title: "",
    content: "",
    image: "",
    categoryId: "",
    tags: [],
    published: false,
    userId: 1,
  };

  const [formData, setFormData] = useState(defaultFormData);
  const [posts, setPosts] = useState([]);
  const [editingIndex, setEditingIndex] = useState(null);

  const [tags, setTags] = useState([]);
  const [categories, setCategories] = useState([]);

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchCategories = async () => {
    try {
      const { data } = await axios.get(`${apiUrl}/categories`);
      setCategories(data);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  const fetchTags = async () => {
    try {
      const { data } = await axios.get(`${apiUrl}/tags`);
      setTags(data);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  const fetchPosts = async (page = currentPage) => {
    try {
      const { data } = await axios.get(`${apiUrl}/posts?page=${page}`); // Modificata la richiesta API
      setPosts(data.data);
      // setCurrentPage(data.page);
      setTotalPages(data.totalPages);
    } catch (error) {
      console.error("Error fetching posts:", error);
    }
  };

  useEffect(() => {
    fetchCategories();
    fetchTags();
  }, []);

  useEffect(() => {
    fetchPosts(currentPage);
  }, [currentPage]);

  const handleField = (name, value) => {
    setFormData((data) => ({ ...data, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingIndex !== null) {
        await updatePost(editingIndex, formData);
      } else {
        await axios.post(`${apiUrl}/posts`, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
      }
      setFormData(defaultFormData);
      setEditingIndex(null);
      fetchPosts(currentPage);
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };

  const removePost = async (id) => {
    try {
      await axios.delete(`${apiUrl}/posts/${id}`);
      setPosts((postsArray) => {
        return postsArray.filter((post) => post.id !== id);
      });
    } catch (error) {
      console.error("Error deleting post:", error);
    }
  };

  const updatePost = async (updatedPost) => {
    try {
      const response = await axios.put(
        `${apiUrl}/posts/${updatedPost.id}`,
        updatedPost
      );
      const updatedPostFromServer = response.data; // Assumendo che il backend restituisca il post aggiornato
      setPosts(
        posts.map((post) =>
          post.id === updatedPostFromServer.id ? updatedPostFromServer : post
        )
      );
      setEditingIndex(null);
    } catch (error) {
      console.error("Error updating post:", error);
    }
  };

  const startEditing = (index) => {
    setEditingIndex(index);
  };

  const handleUpdate = async (index) => {
    const updatedPost = posts[index];
    await updatePost(updatedPost);
  };

  const goToNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage((prevPage) => {
        const nextPage = prevPage + 1;
        return nextPage;
      });
    }
  };

  const goToPreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage((prevPage) => {
        const prevPageNumber = prevPage - 1;
        return prevPageNumber;
      });
    }
  };

  return (
    <>
      <section className="form-section">
        <form onSubmit={handleSubmit}>
          <div className="form-element">
            <label htmlFor="title" className="title">
              Titolo Post
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => handleField("title", e.target.value)}
              required
            />
          </div>
          <div className="form-element content">
            <label htmlFor="content">Contenuto</label>
            <textarea
              name="content"
              id="content"
              cols="30"
              rows="10"
              value={formData.content}
              onChange={(e) => handleField("content", e.target.value)}
              required
            ></textarea>
          </div>
          <div className="form-element image">
            <label htmlFor="image">Immagine</label>
            <input
              type="text"
              name="image"
              id="image"
              value={formData.image}
              onChange={(e) => handleField("image", e.target.value)}
            />
          </div>
          <div className="form-element category">
            <label htmlFor="category">Categoria</label>
            <select
              name="category"
              id="category"
              value={formData.categoryId}
              onChange={(e) => handleField("categoryId", e.target.value)}
            >
              {categories?.length &&
                categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
            </select>
          </div>
          <div className="form-element tags">
            <label htmlFor="tags">Tags</label>
            {tags?.length &&
              tags?.map((tag, index) => (
                <div key={index}>
                  <input
                    type="checkbox"
                    id={`tag-${index}`}
                    name="tags"
                    value={tag.id}
                    checked={formData.tags.includes(tag.id)}
                    onChange={(e) => {
                      const newTags = formData.tags.includes(tag.id)
                        ? formData.tags.filter((t) => t !== tag.id)
                        : [...formData.tags, tag.id];
                      handleField("tags", newTags);
                    }}
                  />
                  <label htmlFor={`tag-${index}`}>{tag.name}</label>
                </div>
              ))}
          </div>
          <button type="submit">
            {editingIndex !== null ? "Update" : "Submit"}
          </button>
        </form>
        <div className="title-container">
          <button onClick={fetchPosts}>Fetch Post</button>
          {posts.length > 0 && (
            <>
              <h2>I Post sono:</h2>
              <section className="list">
                {posts.map((post, index) => (
                  <article key={`post${index}`} className="title-item">
                    <span>Titolo:</span>
                    <h2>
                      <Link to={`/posts/${post.id}`}>{post.title}</Link>
                    </h2>
                    <span>Contenuto:</span>
                    <p>{post.content}</p>
                    <span>Tags:</span>
                    {post.tags &&
                      post.tags.map((tag, index) => (
                        <p key={index}>{tag.name}</p>
                      ))}
                    <span>Immagine:</span>
                    <img src={post.image} alt={post.title} />
                    <br />
                    <span>Categoria:</span>
                    <p>{post.category.name}</p>
                    <button
                      onClick={() => startEditing(post.id)}
                      className="edit-button"
                    >
                      Edita
                    </button>
                    <button
                      onClick={() => removePost(post.id)}
                      className="delete-button"
                    >
                      Cancella
                    </button>
                  </article>
                ))}
              </section>
              <div className="pagination">
                <button
                  type="button"
                  onClick={goToPreviousPage}
                  disabled={currentPage <= 1}
                >
                  Precedente
                </button>
                <span>
                  Pagina {currentPage} di {totalPages}
                </span>
                <button
                  type="button"
                  onClick={goToNextPage}
                  disabled={currentPage >= totalPages}
                >
                  Prossima
                </button>
              </div>
            </>
          )}
        </div>
      </section>
    </>
  );
}

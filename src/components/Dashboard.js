import React, { useState, useEffect } from 'react';
import API from '../services/api';
import './Dashboard.css';

const Dashboard = () => {
  const [posts, setPosts] = useState([]);
  const [newPost, setNewPost] = useState('');
  const [commentInputs, setCommentInputs] = useState({});
  const user = JSON.parse(localStorage.getItem('user'));

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await API.get(`/posts/user/${user.id}`);
        setPosts(response.data);
      } catch (err) {
        console.error('Error fetching posts:', err);
      }
    };

    fetchPosts();
  }, [user.id]);

  const handleAddPost = async () => {
    if (!newPost.trim()) return;
    try {
      const response = await API.post('/posts', { content: newPost });
      setPosts([response.data, ...posts]);
      setNewPost('');
    } catch (err) {
      console.error('Error adding post:', err);
    }
  };

  const handleAddComment = async (postId) => {
    const content = commentInputs[postId];
    if (!content.trim()) return;

    try {
      const response = await API.post(`/posts/${postId}/comments`, { content });
      setPosts(posts.map(post => post._id === postId ? { ...post, comments: [...post.comments, response.data] } : post));
      setCommentInputs({ ...commentInputs, [postId]: '' });
    } catch (err) {
      console.error('Error adding comment:', err);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/';
  };

  return (
    <div className="dashboard-container">
      {/* Navbar */}
      <div className="navbar">
        <div className="navbar-brand">TwiText</div>
        <button className="logout-button" onClick={handleLogout}>
          Logout
        </button>
      </div>

      <div className="dashboard-content">
        <h1>Welcome, {user.name}</h1>
        <h3>Your email: {user.email}</h3>

        {/* Create Post */}
        <textarea
          placeholder="Write something..."
          value={newPost}
          onChange={(e) => setNewPost(e.target.value)}
        />
        <button onClick={handleAddPost}>Post</button>

        {/* Display Posts */}
        {posts.map((post) => (
          <div key={post._id} className="post-card">
            <p>{post.content}</p>
            <p>Created at: {new Date(post.createdAt).toLocaleString()}</p>
            <div className="comment-section">
              <h4>Comments:</h4>
              {post.comments.map((comment) => (
                <p key={comment._id}>{comment.content}</p>
              ))}
              <input
                type="text"
                placeholder="Add a comment"
                value={commentInputs[post._id] || ''}
                onChange={(e) => setCommentInputs({ ...commentInputs, [post._id]: e.target.value })}
              />
              <button onClick={() => handleAddComment(post._id)}>Comment</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;

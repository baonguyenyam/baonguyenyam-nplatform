'use client';

import { useState } from 'react';
import { createPost, deletePost } from '@/lib/admin-actions';

export default function PostManager() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);

  // Handle creating new post using Server Action
  async function handleCreatePost(formData: FormData) {
    setLoading(true);
    try {
      const result = await createPost(formData);
      
      if (result.success) {
        alert('Post created successfully!');
        // Refresh posts list or redirect
        window.location.reload();
      } else {
        alert(`Error: ${result.message}`);
      }
    } catch (error) {
      alert('Failed to create post');
    } finally {
      setLoading(false);
    }
  }

  // Handle deleting post using Server Action
  async function handleDeletePost(postId: string) {
    if (!confirm('Are you sure you want to delete this post?')) return;
    
    setLoading(true);
    try {
      const result = await deletePost(postId);
      
      if (result.success) {
        alert('Post deleted successfully!');
        // Remove from local state or refresh
        setPosts(posts.filter((post: any) => post.id !== postId));
      } else {
        alert(`Error: ${result.message}`);
      }
    } catch (error) {
      alert('Failed to delete post');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Post Manager (Server Actions)</h1>
      
      {/* Create Post Form */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">Create New Post</h2>
        <form action={handleCreatePost} className="space-y-4">
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700">
              Title
            </label>
            <input
              type="text"
              id="title"
              name="title"
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            />
          </div>
          
          <div>
            <label htmlFor="content" className="block text-sm font-medium text-gray-700">
              Content
            </label>
            <textarea
              id="content"
              name="content"
              rows={4}
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            />
          </div>
          
          <div>
            <label htmlFor="categoryId" className="block text-sm font-medium text-gray-700">
              Category ID (optional)
            </label>
            <input
              type="number"
              id="categoryId"
              name="categoryId"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            />
          </div>
          
          <button
            type="submit"
            disabled={loading}
            className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
          >
            {loading ? 'Creating...' : 'Create Post'}
          </button>
        </form>
      </div>

      {/* Posts List */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold mb-4">Posts</h2>
        
        {posts.length === 0 ? (
          <p className="text-gray-500">No posts available. Create one above!</p>
        ) : (
          <div className="space-y-4">
            {posts.map((post: any) => (
              <div key={post.id} className="border rounded-lg p-4 flex justify-between items-start">
                <div>
                  <h3 className="font-semibold">{post.title}</h3>
                  <p className="text-gray-600 text-sm">{post.content}</p>
                  <p className="text-gray-400 text-xs mt-2">ID: {post.id}</p>
                </div>
                <button
                  onClick={() => handleDeletePost(post.id)}
                  disabled={loading}
                  className="text-red-600 hover:text-red-800 disabled:opacity-50"
                >
                  Delete
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
      
      {/* Usage Instructions */}
      <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-blue-800 mb-2">
          Server Actions Benefits
        </h3>
        <ul className="text-blue-700 space-y-1">
          <li>✅ Reduces serverless function count</li>
          <li>✅ Better performance with direct server access</li>
          <li>✅ Automatic error handling and validation</li>
          <li>✅ Built-in security with server-side execution</li>
          <li>✅ Simplified data mutations without API routes</li>
        </ul>
        
        <div className="mt-4 text-sm text-blue-600">
          <p><strong>Before:</strong> 30+ API routes = 30+ serverless functions</p>
          <p><strong>After:</strong> Server Actions + Core APIs = &lt;12 serverless functions</p>
        </div>
      </div>
    </div>
  );
}

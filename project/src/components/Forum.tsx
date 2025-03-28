import React, { useState, useEffect } from 'react';
import { collection, addDoc, query, orderBy, limit, getDocs, startAfter, Timestamp } from 'firebase/firestore';
import { db } from '../firebase';
import { ForumPost as ForumPostType } from '../types/alert';
import { ForumPost } from './ForumPost';
import { useAuth } from '../contexts/AuthContext';
import { 
  UserCircleIcon, 
  PlusIcon, 
  TagIcon, 
  MapPinIcon,
  XMarkIcon,
  EyeSlashIcon
} from '@heroicons/react/24/outline';

const POSTS_PER_PAGE = 5;

export const Forum: React.FC = () => {
  const [posts, setPosts] = useState<ForumPostType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastVisible, setLastVisible] = useState<any>(null);
  const [hasMore, setHasMore] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    isAnonymous: false,
    includeLocation: false,
    tags: [] as string[]
  });
  const [currentTag, setCurrentTag] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user } = useAuth();
  const [userLocation, setUserLocation] = useState<{lat: number, lng: number, address: string} | null>(null);

  // Get initial posts
  useEffect(() => {
    const fetchPosts = async () => {
      setIsLoading(true);
      try {
        const postsQuery = query(
          collection(db, 'forumPosts'),
          orderBy('timestamp', 'desc'),
          limit(POSTS_PER_PAGE)
        );
        
        const snapshot = await getDocs(postsQuery);
        if (snapshot.empty) {
          setPosts([]);
          setHasMore(false);
        } else {
          const fetchedPosts = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
            timestamp: doc.data().timestamp?.toDate() || new Date(),
            comments: (doc.data().comments || []).map((comment: any) => ({
              ...comment,
              timestamp: comment.timestamp?.toDate() || new Date()
            }))
          })) as ForumPostType[];
          
          setPosts(fetchedPosts);
          setLastVisible(snapshot.docs[snapshot.docs.length - 1]);
          setHasMore(snapshot.docs.length === POSTS_PER_PAGE);
        }
      } catch (error) {
        console.error("Error fetching posts:", error);
        setError("Failed to load posts. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchPosts();
  }, []);

  // Get user location if needed
  useEffect(() => {
    if (formData.includeLocation && !userLocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          try {
            const response = await fetch(
              `https://nominatim.openstreetmap.org/reverse?format=json&lat=${position.coords.latitude}&lon=${position.coords.longitude}`
            );
            const data = await response.json();
            setUserLocation({
              lat: position.coords.latitude,
              lng: position.coords.longitude,
              address: data.display_name
            });
          } catch (error) {
            console.error('Error getting address:', error);
          }
        },
        (error) => {
          console.error('Error getting location:', error);
        }
      );
    }
  }, [formData.includeLocation, userLocation]);

  const loadMorePosts = async () => {
    if (!lastVisible) return;
    
    setIsLoading(true);
    try {
      const postsQuery = query(
        collection(db, 'forumPosts'),
        orderBy('timestamp', 'desc'),
        startAfter(lastVisible),
        limit(POSTS_PER_PAGE)
      );
      
      const snapshot = await getDocs(postsQuery);
      if (snapshot.empty) {
        setHasMore(false);
      } else {
        const newPosts = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          timestamp: doc.data().timestamp?.toDate() || new Date(),
          comments: (doc.data().comments || []).map((comment: any) => ({
            ...comment,
            timestamp: comment.timestamp?.toDate() || new Date()
          }))
        })) as ForumPostType[];
        
        setPosts(prev => [...prev, ...newPosts]);
        setLastVisible(snapshot.docs[snapshot.docs.length - 1]);
        setHasMore(snapshot.docs.length === POSTS_PER_PAGE);
      }
    } catch (error) {
      console.error("Error loading more posts:", error);
      setError("Failed to load more posts. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddTag = () => {
    if (currentTag.trim() && !formData.tags.includes(currentTag.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, currentTag.trim()]
      }));
      setCurrentTag('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const handleCreatePost = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      setShowLoginPrompt(true);
      return;
    }
    
    if (!formData.title.trim()) {
      setError("Please enter a title");
      return;
    }
    
    if (!formData.content.trim()) {
      setError("Please enter some content");
      return;
    }
    
    setIsSubmitting(true);
    setError(null);
    
    try {
      const newPost = {
        title: formData.title,
        content: formData.content,
        authorId: user.uid,
        authorName: user.displayName || 'User',
        isAnonymous: formData.isAnonymous,
        timestamp: new Date(),
        location: formData.includeLocation && userLocation ? userLocation : undefined,
        tags: formData.tags,
        likes: 0,
        comments: []
      };
      
      const docRef = await addDoc(collection(db, 'forumPosts'), {
        ...newPost,
        timestamp: Timestamp.fromDate(new Date())
      });
      
      const createdPost: ForumPostType = {
        ...newPost,
        id: docRef.id,
        comments: []
      };
      
      setPosts(prev => [createdPost, ...prev]);
      setShowCreateForm(false);
      setFormData({
        title: '',
        content: '',
        isAnonymous: false,
        includeLocation: false,
        tags: []
      });
    } catch (error) {
      console.error("Error creating post:", error);
      setError("Failed to create post. Please try again later.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleNewPostClick = () => {
    if (!user) {
      setShowLoginPrompt(true);
    } else {
      setShowCreateForm(true);
    }
  };

  // Generate sample posts for demo purposes
  const generateSamplePosts = async () => {
    try {
      const samplePosts = [
        {
          title: "Suspicious activity in downtown area",
          content: "I noticed a group of people acting suspiciously around Main Street and 5th Avenue. They were looking into car windows and testing door handles. Has anyone else seen this?",
          authorId: "sample1",
          authorName: "ConcernedCitizen",
          isAnonymous: false,
          timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
          location: {
            lat: 40.7128,
            lng: -74.0060,
            address: "Main Street, Downtown"
          },
          tags: ["safety", "suspicious"],
          likes: 5,
          comments: [
            {
              id: "c1",
              content: "I saw them too! I called the police and they said they would send a patrol.",
              authorId: "sample2",
              authorName: "SafetyFirst",
              isAnonymous: false,
              timestamp: new Date(Date.now() - 1000 * 60 * 60 * 1), // 1 hour ago
              likes: 2
            }
          ]
        },
        {
          title: "Harassment incident near Central Park",
          content: "I wanted to anonymously report that I witnessed someone being verbally harassed near the south entrance of Central Park around 5pm today. The victim seemed very distressed. Police were called but I'm not sure what happened after.",
          authorId: "sample3",
          authorName: "ParkVisitor",
          isAnonymous: true,
          timestamp: new Date(Date.now() - 1000 * 60 * 60 * 5), // 5 hours ago
          location: {
            lat: 40.7645,
            lng: -73.9742,
            address: "Central Park South Entrance"
          },
          tags: ["harassment", "safety"],
          likes: 8,
          comments: []
        },
        {
          title: "Need advice on dealing with threatening neighbor",
          content: "I've been experiencing issues with a neighbor who has been making threatening comments whenever I leave my apartment. I don't want to escalate the situation but I'm concerned for my safety. Any advice on how to handle this?",
          authorId: "sample4",
          authorName: "Anonymous",
          isAnonymous: true,
          timestamp: new Date(Date.now() - 1000 * 60 * 60 * 12), // 12 hours ago
          tags: ["threats", "advice", "neighbors"],
          likes: 12,
          comments: [
            {
              id: "c2",
              content: "Document everything with times and dates. Report to building management if applicable, and consider filing a police report to create a paper trail.",
              authorId: "sample5",
              authorName: "LegalHelper",
              isAnonymous: false,
              timestamp: new Date(Date.now() - 1000 * 60 * 60 * 10), // 10 hours ago
              likes: 4
            },
            {
              id: "c3",
              content: "I had a similar situation. Try to avoid being alone when entering or leaving your apartment, and maybe consider a security camera.",
              authorId: "sample6",
              authorName: "Anonymous",
              isAnonymous: true,
              timestamp: new Date(Date.now() - 1000 * 60 * 60 * 8), // 8 hours ago
              likes: 3
            }
          ]
        }
      ];
      
      for (const post of samplePosts) {
        await addDoc(collection(db, 'forumPosts'), {
          ...post,
          timestamp: Timestamp.fromDate(post.timestamp),
          comments: post.comments.map(comment => ({
            ...comment,
            timestamp: Timestamp.fromDate(comment.timestamp)
          }))
        });
      }
      
      // Refresh posts
      window.location.reload();
    } catch (error) {
      console.error("Error generating sample posts:", error);
      setError("Failed to generate sample posts.");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-white">Community Forum</h2>
        <div className="flex space-x-3">
          {!showCreateForm && !showLoginPrompt && (
            <button
              onClick={handleNewPostClick}
              className="flex items-center space-x-1 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
            >
              <PlusIcon className="w-5 h-5" />
              <span>New Post</span>
            </button>
          )}
          {/* Only show this in development or for admins */}
          {process.env.NODE_ENV === 'development' && (
            <button
              onClick={generateSamplePosts}
              className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-500 transition-colors"
            >
              Generate Samples
            </button>
          )}
        </div>
      </div>
      
      {/* Login Prompt */}
      {showLoginPrompt && (
        <div className="glass-effect rounded-lg p-6 mb-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-semibold text-white">Login Required</h3>
            <button
              onClick={() => setShowLoginPrompt(false)}
              className="text-gray-400 hover:text-white transition-colors"
            >
              <XMarkIcon className="w-6 h-6" />
            </button>
          </div>
          
          <div className="text-center py-6">
            <UserCircleIcon className="w-16 h-16 text-primary/50 mx-auto mb-4" />
            <p className="text-gray-300 mb-6">
              You need to be logged in to create posts or comment on the forum.
            </p>
            <div className="flex justify-center space-x-4">
              <a 
                href="/login" 
                className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
              >
                Log In
              </a>
              <a 
                href="/signup" 
                className="px-6 py-2 bg-white/10 text-white rounded-lg hover:bg-white/20 transition-colors"
              >
                Sign Up
              </a>
              <button
                onClick={() => setShowLoginPrompt(false)}
                className="px-6 py-2 text-gray-300 hover:text-white transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Create Post Form */}
      {showCreateForm && (
        <div className="glass-effect rounded-lg p-6 mb-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-semibold text-white">Create New Post</h3>
            <button
              onClick={() => setShowCreateForm(false)}
              className="text-gray-400 hover:text-white transition-colors"
            >
              <XMarkIcon className="w-6 h-6" />
            </button>
          </div>
          
          {error && (
            <div className="mb-4 p-3 bg-red-500/20 border border-red-500 rounded-lg">
              <p className="text-red-500 text-sm">{error}</p>
            </div>
          )}
          
          <form onSubmit={handleCreatePost}>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Title
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="Enter a descriptive title..."
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Content
                </label>
                <textarea
                  value={formData.content}
                  onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="Share your thoughts, question or concern..."
                  rows={5}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Tags
                </label>
                <div className="flex space-x-2">
                  <div className="flex-grow relative">
                    <input
                      type="text"
                      value={currentTag}
                      onChange={(e) => setCurrentTag(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          handleAddTag();
                        }
                      }}
                      className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary"
                      placeholder="Add tags (press Enter to add)..."
                    />
                    <TagIcon className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                  </div>
                  <button
                    type="button"
                    onClick={handleAddTag}
                    className="px-4 py-2 bg-white/10 text-white rounded-lg hover:bg-white/20 transition-colors"
                  >
                    Add
                  </button>
                </div>
                
                {formData.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {formData.tags.map((tag, index) => (
                      <span 
                        key={index} 
                        className="px-3 py-1 bg-primary/20 text-primary rounded-full text-sm flex items-center"
                      >
                        {tag}
                        <button
                          type="button"
                          onClick={() => handleRemoveTag(tag)}
                          className="ml-2 text-primary/70 hover:text-primary"
                        >
                          <XMarkIcon className="w-4 h-4" />
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </div>
              
              <div className="flex flex-col space-y-3 sm:flex-row sm:space-y-0 sm:space-x-6">
                <label className="flex items-center space-x-2 text-gray-300">
                  <input
                    type="checkbox"
                    checked={formData.isAnonymous}
                    onChange={() => setFormData(prev => ({ ...prev, isAnonymous: !prev.isAnonymous }))}
                    className="rounded border-white/20 text-primary focus:ring-primary"
                  />
                  <div className="flex items-center space-x-1">
                    <EyeSlashIcon className="w-5 h-5" />
                    <span>Post anonymously</span>
                  </div>
                </label>
                
                <label className="flex items-center space-x-2 text-gray-300">
                  <input
                    type="checkbox"
                    checked={formData.includeLocation}
                    onChange={() => setFormData(prev => ({ ...prev, includeLocation: !prev.includeLocation }))}
                    className="rounded border-white/20 text-primary focus:ring-primary"
                  />
                  <div className="flex items-center space-x-1">
                    <MapPinIcon className="w-5 h-5" />
                    <span>Include my location</span>
                  </div>
                </label>
              </div>
              
              {formData.includeLocation && userLocation && (
                <div className="p-3 bg-white/5 rounded-lg">
                  <div className="flex items-center text-gray-300 text-sm">
                    <MapPinIcon className="w-4 h-4 mr-2 text-primary" />
                    <span>{userLocation.address}</span>
                  </div>
                </div>
              )}
              
              <div className="flex justify-end space-x-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowCreateForm(false)}
                  className="px-4 py-2 text-gray-300 hover:text-white transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting || !formData.title.trim() || !formData.content.trim()}
                  className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? 'Creating...' : 'Create Post'}
                </button>
              </div>
            </div>
          </form>
        </div>
      )}
      
      {/* Posts List */}
      {isLoading && posts.length === 0 ? (
        <div className="text-center py-12">
          <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full mx-auto"></div>
          <p className="mt-4 text-gray-400">Loading posts...</p>
        </div>
      ) : error && posts.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-red-400">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
          >
            Try Again
          </button>
        </div>
      ) : posts.length === 0 ? (
        <div className="text-center py-12 glass-effect rounded-lg">
          <p className="text-gray-300 mb-4">No posts yet. Be the first to start a discussion!</p>
          <button
            onClick={() => setShowCreateForm(true)}
            className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
          >
            Create Post
          </button>
        </div>
      ) : (
        <div>
          {posts.map(post => (
            <ForumPost 
              key={post.id} 
              post={post}
              onCommentAdded={() => {
                // Refresh posts
                window.location.reload();
              }} 
            />
          ))}
          
          {hasMore && (
            <div className="text-center mt-6">
              <button
                onClick={loadMorePosts}
                disabled={isLoading}
                className="px-6 py-2 bg-white/10 text-white rounded-lg hover:bg-white/20 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? 'Loading...' : 'Load More'}
              </button>
            </div>
          )}
          
          {!hasMore && posts.length > 0 && (
            <p className="text-center text-gray-400 mt-6">No more posts to load</p>
          )}
        </div>
      )}
    </div>
  );
}; 
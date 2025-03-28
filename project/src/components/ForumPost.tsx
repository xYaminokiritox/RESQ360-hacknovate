import React, { useState } from 'react';
import { ForumPost as ForumPostType, ForumComment } from '../types/alert';
import { 
  UserCircleIcon, 
  ChatBubbleLeftIcon, 
  HeartIcon, 
  MapPinIcon, 
  ShareIcon,
  PaperAirplaneIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';
import { HeartIcon as HeartIconSolid } from '@heroicons/react/24/solid';
import { motion, AnimatePresence } from 'framer-motion';
import { doc, updateDoc, arrayUnion, Timestamp } from 'firebase/firestore';
import { db } from '../firebase';
import { useAuth } from '../contexts/AuthContext';

interface ForumPostProps {
  post: ForumPostType;
  onCommentAdded?: () => void;
}

export const ForumPost: React.FC<ForumPostProps> = ({ post, onCommentAdded }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [commentText, setCommentText] = useState('');
  const [isAnonymousComment, setIsAnonymousComment] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);
  const { user } = useAuth();

  const handleAddComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim() || !user) return;

    setIsSubmitting(true);
    try {
      const newComment: Omit<ForumComment, 'id'> = {
        content: commentText,
        authorId: user.uid,
        authorName: isAnonymousComment ? 'Anonymous' : user.displayName || 'User',
        isAnonymous: isAnonymousComment,
        timestamp: new Date(),
        likes: 0
      };

      // Update the post document with the new comment
      await updateDoc(doc(db, 'forumPosts', post.id), {
        comments: arrayUnion({
          ...newComment,
          id: Date.now().toString(), // Simple client-side ID generation
          timestamp: Timestamp.fromDate(new Date()) // Convert to Firestore timestamp
        })
      });

      setCommentText('');
      if (onCommentAdded) onCommentAdded();
    } catch (error) {
      console.error('Error adding comment:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLike = async () => {
    if (!user) {
      setShowLoginPrompt(true);
      return;
    }
    
    setIsLiked(!isLiked);
    try {
      await updateDoc(doc(db, 'forumPosts', post.id), {
        likes: isLiked ? post.likes - 1 : post.likes + 1
      });
    } catch (error) {
      console.error('Error updating likes:', error);
      // Revert the UI state on error
      setIsLiked(!isLiked);
    }
  };

  const handleExpandComments = () => {
    if (!user && !isExpanded) {
      setShowLoginPrompt(true);
      return;
    }
    
    setIsExpanded(!isExpanded);
  };

  const formatDate = (date: Date) => {
    const now = new Date();
    const diff = Math.floor((now.getTime() - date.getTime()) / 1000);
    
    if (diff < 60) return `${diff} seconds ago`;
    if (diff < 3600) return `${Math.floor(diff / 60)} minutes ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)} hours ago`;
    if (diff < 604800) return `${Math.floor(diff / 86400)} days ago`;
    
    return date.toLocaleDateString();
  };

  return (
    <motion.div 
      className="glass-effect rounded-lg p-4 mb-4"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      {/* Login Prompt */}
      {showLoginPrompt && (
        <div className="absolute inset-0 bg-gray-900/90 backdrop-blur-sm z-10 rounded-lg flex items-center justify-center">
          <div className="text-center p-6 max-w-sm">
            <button 
              onClick={() => setShowLoginPrompt(false)}
              className="absolute top-2 right-2 text-gray-400 hover:text-white"
            >
              <XMarkIcon className="w-6 h-6" />
            </button>
            <UserCircleIcon className="w-16 h-16 text-primary/50 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">Login Required</h3>
            <p className="text-gray-300 mb-6">
              Please log in to interact with forum posts and comments.
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
            </div>
          </div>
        </div>
      )}

      {/* Post Header */}
      <div className="flex justify-between items-start mb-3">
        <div className="flex items-center space-x-2">
          <UserCircleIcon className="w-8 h-8 text-gray-400" />
          <div>
            <p className="font-medium text-white">
              {post.isAnonymous ? 'Anonymous' : post.authorName}
            </p>
            <p className="text-xs text-gray-400">{formatDate(post.timestamp)}</p>
          </div>
        </div>
        {post.tags.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {post.tags.map((tag, index) => (
              <span 
                key={index} 
                className="px-2 py-1 text-xs rounded-full bg-primary/20 text-primary"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Post Title */}
      <h3 className="text-xl font-semibold text-white mb-2">{post.title}</h3>

      {/* Post Content */}
      <p className="text-gray-300 mb-4">{post.content}</p>

      {/* Post Location */}
      {post.location && (
        <div className="flex items-center text-sm text-gray-400 mb-4">
          <MapPinIcon className="w-4 h-4 mr-1" />
          <span>{post.location.address}</span>
        </div>
      )}

      {/* Post Actions */}
      <div className="flex items-center justify-between pt-2 border-t border-gray-700">
        <button 
          className="flex items-center space-x-1 text-gray-400 hover:text-primary transition-colors"
          onClick={handleLike}
        >
          {isLiked ? (
            <HeartIconSolid className="w-5 h-5 text-red-500" />
          ) : (
            <HeartIcon className="w-5 h-5" />
          )}
          <span>{post.likes} likes</span>
        </button>
        
        <button 
          className="flex items-center space-x-1 text-gray-400 hover:text-primary transition-colors"
          onClick={handleExpandComments}
        >
          <ChatBubbleLeftIcon className="w-5 h-5" />
          <span>{post.comments.length} comments</span>
        </button>
        
        <button className="flex items-center space-x-1 text-gray-400 hover:text-primary transition-colors">
          <ShareIcon className="w-5 h-5" />
          <span>Share</span>
        </button>
      </div>

      {/* Comments Section */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div 
            className="mt-4 pt-4 border-t border-gray-700"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            {/* Comment Form */}
            {user ? (
              <form onSubmit={handleAddComment} className="mb-4">
                <div className="flex space-x-2">
                  <div className="flex-shrink-0">
                    <UserCircleIcon className="w-8 h-8 text-gray-400" />
                  </div>
                  <div className="flex-grow">
                    <div className="relative">
                      <input
                        type="text"
                        value={commentText}
                        onChange={(e) => setCommentText(e.target.value)}
                        placeholder="Add a comment..."
                        className="w-full p-2 pr-10 bg-white/10 rounded-lg border border-gray-700 placeholder-gray-500 text-white focus:outline-none focus:ring-1 focus:ring-primary"
                      />
                      <button
                        type="submit"
                        disabled={isSubmitting || !commentText.trim()}
                        className="absolute right-2 top-2 text-gray-400 hover:text-primary disabled:text-gray-600"
                      >
                        <PaperAirplaneIcon className="w-5 h-5" />
                      </button>
                    </div>
                    <div className="flex items-center mt-2">
                      <label className="flex items-center space-x-2 text-sm text-gray-400">
                        <input
                          type="checkbox"
                          checked={isAnonymousComment}
                          onChange={() => setIsAnonymousComment(!isAnonymousComment)}
                          className="rounded border-gray-700 text-primary focus:ring-primary"
                        />
                        <span>Comment anonymously</span>
                      </label>
                    </div>
                  </div>
                </div>
              </form>
            ) : (
              <div className="mb-4 p-3 bg-white/5 rounded-lg text-center">
                <p className="text-gray-400 text-sm">
                  <a href="/login" className="text-primary hover:underline">Log in</a> to add a comment
                </p>
              </div>
            )}

            {/* Comments List */}
            <div className="space-y-3">
              {post.comments.length === 0 ? (
                <p className="text-center text-gray-500 text-sm py-2">No comments yet. Be the first to comment!</p>
              ) : (
                post.comments
                  .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
                  .map((comment) => (
                    <div key={comment.id} className="bg-white/5 p-3 rounded-lg">
                      <div className="flex items-start space-x-2">
                        <UserCircleIcon className="w-6 h-6 text-gray-400 flex-shrink-0 mt-1" />
                        <div className="flex-grow">
                          <div className="flex items-center justify-between">
                            <p className="font-medium text-white text-sm">
                              {comment.isAnonymous ? 'Anonymous' : comment.authorName}
                            </p>
                            <p className="text-xs text-gray-400">{formatDate(comment.timestamp)}</p>
                          </div>
                          <p className="text-gray-300 text-sm mt-1">{comment.content}</p>
                        </div>
                      </div>
                    </div>
                  ))
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}; 
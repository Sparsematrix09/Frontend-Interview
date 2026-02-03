import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FaWhatsapp, FaLinkedin, FaTwitter, FaLink, FaShareAlt, FaCalendarAlt, FaClock, FaTag, FaHome } from 'react-icons/fa';

interface Blog {
  id: number;
  title: string;
  category: string[];
  description: string;
  date: string;
  coverImage: string;
  content: string;
}

const BlogDetail = () => {
  const { articleno } = useParams<{ articleno: string }>();
  const navigate = useNavigate();
  const [currentBlog, setCurrentBlog] = useState<Blog | null>(null);
  const [latestBlogs, setLatestBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showShareOptions, setShowShareOptions] = useState(false);
  const shareOptionsRef = useRef<HTMLDivElement>(null);

  const API_URL = 'http://localhost:3001';

  const calculateReadTime = (content: string): string => {
    const wordsPerMinute = 200;
    const words = content.split(/\s+/).length;
    const minutes = Math.ceil(words / wordsPerMinute);
    return `${minutes} min read`;
  };

  const formatDate = (dateString: string): string => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      });
    } catch {
      return 'Unknown date';
    }
  };

  const getTimeAgo = (dateString: string): string => {
    try {
      const date = new Date(dateString);
      const now = new Date();
      const diffInMs = now.getTime() - date.getTime();
      const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));
      
      if (diffInDays === 0) return 'Today';
      if (diffInDays === 1) return 'Yesterday';
      if (diffInDays < 7) return `${diffInDays} days ago`;
      if (diffInDays < 30) return `${Math.floor(diffInDays / 7)} weeks ago`;
      if (diffInDays < 365) return `${Math.floor(diffInDays / 30)} months ago`;
      return `${Math.floor(diffInDays / 365)} years ago`;
    } catch {
      return 'Recently';
    }
  };

  const getTagInfo = (category: string[]) => {
    if (!category || !Array.isArray(category)) {
      return { tag: 'General', tagType: 'general', color: 'bg-gray-100 text-gray-800' };
    }
    
    if (category.includes('FINANCE') || category.includes('Fintech & AI')) {
      return { tag: 'Featured', tagType: 'featured', color: 'bg-yellow-100 text-yellow-800' };
    } else if (category.includes('CAREER')) {
      return { tag: 'Study Tips', tagType: 'study', color: 'bg-blue-100 text-blue-800' };
    } else if (category.includes('REGULATIONS')) {
      return { tag: 'Taxation', tagType: 'tax', color: 'bg-pink-100 text-pink-800' };
    } else if (category.includes('SKILLS')) {
      return { tag: 'Development', tagType: 'dev', color: 'bg-green-100 text-green-800' };
    } else {
      return { tag: 'Technology', tagType: 'tech', color: 'bg-purple-100 text-purple-800' };
    }
  };

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const blogId = articleno || '1';
        
        const blogResponse = await fetch(`${API_URL}/blogs/${blogId}`);
        
        if (!blogResponse.ok) {
          if (blogResponse.status === 404) {
            throw new Error(`Blog not found`);
          }
          throw new Error(`Failed to load blog`);
        }
        
        const blogData = await blogResponse.json();
        setCurrentBlog(blogData);
        
        const blogsResponse = await fetch(`${API_URL}/blogs`);
        
        if (!blogsResponse.ok) {
          throw new Error(`Failed to load blogs`);
        }
        
        const allBlogs = await blogsResponse.json();
        
        const otherBlogs = Array.isArray(allBlogs) 
          ? allBlogs.filter((blog: Blog) => blog.id.toString() !== blogId)
          : [];
        setLatestBlogs(otherBlogs);
        
      } catch (err) {
        setError('Failed to load content. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchBlogs();
  }, [articleno]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (shareOptionsRef.current && !shareOptionsRef.current.contains(event.target as Node)) {
        setShowShareOptions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleArticleClick = (id: number) => {
    navigate(`/blog/${id}`);
    window.scrollTo(0, 0);
  };

  const shareOnWhatsApp = () => {
    const text = `Check out this article: ${currentBlog?.title}`;
    const url = `https://wa.me/?text=${encodeURIComponent(text + ' ' + window.location.href)}`;
    window.open(url, '_blank');
    setShowShareOptions(false);
  };

  const shareOnLinkedIn = () => {
    const url = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(window.location.href)}`;
    window.open(url, '_blank');
    setShowShareOptions(false);
  };

  const shareOnTwitter = () => {
    const text = `Check out this article: ${currentBlog?.title}`;
    const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(window.location.href)}`;
    window.open(url, '_blank');
    setShowShareOptions(false);
  };

  const copyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    alert('Link copied to clipboard!');
    setShowShareOptions(false);
  };

  const handleShare = () => {
    if (navigator.share && currentBlog) {
      navigator.share({
        title: currentBlog.title,
        text: currentBlog.description,
        url: window.location.href,
      });
    } else {
      setShowShareOptions(!showShareOptions);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-gray-50 to-blue-50">
        <div className="text-center p-8">
          <div className="inline-block animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-600 mb-6"></div>
          <h2 className="text-2xl font-bold text-gray-800 mb-3">Loading Article</h2>
          <p className="text-gray-600">Fetching content from the server...</p>
        </div>
      </div>
    );
  }

  if (error && !currentBlog) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-gray-50 to-red-50 p-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center">
          <div className="text-red-500 text-6xl mb-6">⚠️</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Connection Issue</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <div className="space-y-3">
            <button 
              onClick={() => window.location.reload()}
              className="w-full py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors shadow-md"
            >
              Try Again
            </button>
            <button 
              onClick={() => navigate('/')}
              className="w-full py-3 flex items-center justify-center gap-2 bg-gray-100 text-gray-700 font-semibold rounded-lg hover:bg-gray-200 transition-colors"
            >
              <FaHome /> Go to Homepage
            </button>
          </div>
        </div>
      </div>
    );
  }

  const currentTagInfo = getTagInfo(currentBlog?.category || []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          <div className="lg:w-1/3">
            <div className="sticky top-8 bg-white rounded-2xl shadow-lg border border-gray-200 p-6 mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 pb-4 border-b border-gray-200 flex items-center">
                <span className="bg-blue-100 text-blue-800 p-2 rounded-lg mr-3">📚</span>
                Latest Articles
              </h2>
              
              {latestBlogs.length === 0 ? (
                <div className="text-center py-8">
                  <div className="text-gray-400 text-4xl mb-4">📭</div>
                  <p className="text-gray-500">No articles found</p>
                </div>
              ) : (
                <div className="space-y-6">
                  {latestBlogs.map(blog => {
                    const tagInfo = getTagInfo(blog.category);
                    return (
                      <div 
                        key={blog.id}
                        onClick={() => handleArticleClick(blog.id)}
                        className="group cursor-pointer bg-white rounded-xl border-2 border-gray-100 p-5 hover:border-blue-400 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 hover:scale-[1.02]"
                      >
                        <div className="flex justify-between items-start mb-3">
                          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-700 border border-blue-100">
                            <FaTag className="mr-1" size={10} /> {blog.category[0] || 'General'}
                          </span>
                          <span className="text-xs text-gray-500">{getTimeAgo(blog.date)}</span>
                        </div>
                        
                        <h3 className="font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors line-clamp-2">
                          {blog.title}
                        </h3>
                        
                        <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                          {blog.description}
                        </p>
                        
                        <div className="flex justify-between items-center">
                          <span className={`text-xs font-semibold px-3 py-1 rounded-full ${tagInfo.color} border`}>
                            {tagInfo.tag}
                          </span>
                          <span className="text-xs text-gray-500 flex items-center">
                            <FaClock className="mr-1" size={10} /> {calculateReadTime(blog.content)}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          <div className="lg:w-2/3">
            <div className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
              {currentBlog?.coverImage && (
                <div className="relative h-64 md:h-80 lg:h-96 overflow-hidden">
                  <img 
                    src={currentBlog.coverImage}
                    alt={currentBlog.title}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = `https://placehold.co/800x400/3b82f6/ffffff?text=${encodeURIComponent(currentBlog.title)}`;
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                </div>
              )}

              <div className="p-6 md:p-8 lg:p-10">
                <div className="flex flex-wrap gap-2 mb-4">
                  {currentBlog?.category?.map((cat, index) => (
                    <span 
                      key={index}
                      className="inline-flex items-center px-4 py-2 rounded-full text-sm font-semibold bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-800 border border-blue-200"
                    >
                      {cat}
                    </span>
                  ))}
                </div>

                <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-6 leading-tight tracking-tight">
                  {currentBlog?.title}
                </h1>

                <div className="flex flex-wrap items-center gap-6 mb-8 text-sm text-gray-600">
                  <div className="flex items-center gap-2 px-4 py-2 bg-gray-50 rounded-lg">
                    <FaCalendarAlt className="text-blue-500" />
                    <span className="font-medium">{formatDate(currentBlog?.date || '')}</span>
                  </div>
                  <div className="flex items-center gap-2 px-4 py-2 bg-gray-50 rounded-lg">
                    <FaClock className="text-green-500" />
                    <span className="font-medium">{calculateReadTime(currentBlog?.content || '')}</span>
                  </div>
                  <div className={`flex items-center gap-2 px-4 py-2 rounded-lg ${currentTagInfo.color} border`}>
                    {currentTagInfo.tag}
                  </div>
                </div>

                <div className="relative mb-8" ref={shareOptionsRef}>
                  <button
                    onClick={handleShare}
                    className="inline-flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 shadow-lg hover:shadow-xl"
                  >
                    <FaShareAlt className="text-xl" /> Share This Article
                  </button>

                  {showShareOptions && (
                    <div className="absolute left-0 mt-3 w-64 bg-white rounded-xl shadow-2xl border border-gray-200 z-10 overflow-hidden animate-fadeIn">
                      <div className="p-2">
                        <button
                          onClick={shareOnWhatsApp}
                          className="flex items-center gap-3 w-full px-4 py-4 text-left hover:bg-green-50 text-gray-800 hover:text-green-700 transition-colors rounded-lg"
                        >
                          <div className="p-2 bg-green-100 rounded-lg">
                            <FaWhatsapp className="text-green-600 text-xl" />
                          </div>
                          <div>
                            <p className="font-semibold">WhatsApp</p>
                            <p className="text-xs text-gray-500">Share with contacts</p>
                          </div>
                        </button>
                        <button
                          onClick={shareOnLinkedIn}
                          className="flex items-center gap-3 w-full px-4 py-4 text-left hover:bg-blue-50 text-gray-800 hover:text-blue-700 transition-colors rounded-lg"
                        >
                          <div className="p-2 bg-blue-100 rounded-lg">
                            <FaLinkedin className="text-blue-600 text-xl" />
                          </div>
                          <div>
                            <p className="font-semibold">LinkedIn</p>
                            <p className="text-xs text-gray-500">Share professionally</p>
                          </div>
                        </button>
                        <button
                          onClick={shareOnTwitter}
                          className="flex items-center gap-3 w-full px-4 py-4 text-left hover:bg-sky-50 text-gray-800 hover:text-sky-600 transition-colors rounded-lg"
                        >
                          <div className="p-2 bg-sky-100 rounded-lg">
                            <FaTwitter className="text-sky-500 text-xl" />
                          </div>
                          <div>
                            <p className="font-semibold">Twitter</p>
                            <p className="text-xs text-gray-500">Tweet this article</p>
                          </div>
                        </button>
                        <button
                          onClick={copyLink}
                          className="flex items-center gap-3 w-full px-4 py-4 text-left hover:bg-gray-100 text-gray-800 hover:text-gray-900 transition-colors rounded-lg"
                        >
                          <div className="p-2 bg-gray-100 rounded-lg">
                            <FaLink className="text-gray-600 text-xl" />
                          </div>
                          <div>
                            <p className="font-semibold">Copy Link</p>
                            <p className="text-xs text-gray-500">Copy to clipboard</p>
                          </div>
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border-l-4 border-blue-500 p-6 rounded-r-xl mb-10 shadow-inner">
                  <p className="text-xl text-gray-800 italic leading-relaxed">{currentBlog?.description}</p>
                </div>

                <div className="prose prose-lg max-w-none">
                  <div 
                    className="text-gray-800 leading-relaxed"
                    dangerouslySetInnerHTML={{ __html: currentBlog?.content || '' }}
                  />
                  
                  {currentBlog?.content && !currentBlog.content.includes('<') && (
                    <div className="space-y-6">
                      {currentBlog.content.split('\n\n').map((paragraph, index) => (
                        <p key={index} className="mb-6 leading-relaxed text-lg">
                          {paragraph}
                        </p>
                      ))}
                    </div>
                  )}
                </div>

                <div className="mt-12 pt-10 border-t border-gray-200">
                  <h3 className="text-xl font-bold text-gray-900 mb-4">Related Topics</h3>
                  <div className="flex flex-wrap gap-3">
                    {currentBlog?.category?.map((cat, index) => (
                      <span 
                        key={index}
                        className="px-4 py-2 bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-800 rounded-full text-sm font-semibold hover:from-blue-200 hover:to-indigo-200 transition-all cursor-pointer border border-blue-200"
                      >
                        {cat}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlogDetail;
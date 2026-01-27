import React, { useState, useEffect } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Link, useNavigate } from 'react-router-dom'
import { Clock, TrendingUp, ChevronRight, BookOpen, Award } from 'lucide-react'

interface Blog {
  id: number
  title: string
  category: string[]
  description: string
  date: string
  coverImage: string
  content: string
}

const HomePage: React.FC = () => {
  const navigate = useNavigate()
  const [selectedBlogId, setSelectedBlogId] = useState<number | null>(null)

  const { data: blogs, isLoading, error } = useQuery<Blog[]>({
    queryKey: ['blogs'],
    queryFn: async () => {
      const response = await fetch('http://localhost:3001/blogs')
      if (!response.ok) throw new Error('Failed to fetch blogs')
      return response.json()
    },
  })

  // Set the first blog as selected when data loads
  useEffect(() => {
    if (blogs && blogs.length > 0 && !selectedBlogId) {
      setSelectedBlogId(blogs[0].id)
    }
  }, [blogs, selectedBlogId])

  const selectedBlog = blogs?.find(blog => blog.id === selectedBlogId) || blogs?.[0]

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))
    
    if (diffDays === 0) return 'Today'
    if (diffDays === 1) return 'Yesterday'
    if (diffDays < 7) return `${diffDays} days ago`
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`
    return `${Math.floor(diffDays / 30)} months ago`
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 animate-pulse">
            <div className="h-96 bg-gray-200 rounded-2xl mb-6"></div>
            <div className="h-8 bg-gray-200 rounded w-3/4 mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2 mb-8"></div>
            <div className="space-y-3">
              <div className="h-4 bg-gray-200 rounded"></div>
              <div className="h-4 bg-gray-200 rounded"></div>
              <div className="h-4 bg-gray-200 rounded w-2/3"></div>
            </div>
          </div>
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="bg-white rounded-xl p-4 border border-gray-200 animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-1/4 mb-3"></div>
                <div className="h-6 bg-gray-200 rounded mb-2"></div>
                <div className="h-4 bg-gray-200 rounded mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-2/3"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white flex items-center justify-center">
        <div className="bg-white rounded-2xl shadow-lg p-8 max-w-md text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <TrendingUp className="h-8 w-8 text-red-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Error loading articles</h2>
          <p className="text-gray-600 mb-6">{(error as Error).message}</p>
          <button 
            onClick={() => window.location.reload()}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Header */}
      <div className="mb-10">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
              Latest <span className="text-blue-600">Articles</span>
            </h1>
            <p className="text-gray-600 mt-2">Expert insights on finance, accounting, and career growth</p>
          </div>
          <div className="flex items-center space-x-2">
            <TrendingUp className="h-5 w-5 text-blue-600" />
            <span className="text-sm font-medium text-blue-600">TRENDING</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Right Panel - Blog Detail View (2/3 width on desktop) */}
        <div className="lg:col-span-2">
          {selectedBlog && (
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
              {/* Cover Image */}
              <div className="relative h-64 md:h-80 overflow-hidden">
                <img 
                  src={selectedBlog.coverImage} 
                  alt={selectedBlog.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
                <div className="absolute bottom-6 left-6">
                  <div className="flex items-center space-x-2 mb-2">
                    <span className="px-3 py-1 bg-blue-600 text-white text-xs font-semibold rounded-full uppercase tracking-wider">
                      {selectedBlog.category[0]}
                    </span>
                    <span className="text-sm text-white/90">{formatDate(selectedBlog.date)}</span>
                  </div>
                  <h2 className="text-2xl md:text-3xl font-bold text-white">
                    {selectedBlog.title}
                  </h2>
                </div>
              </div>

              {/* Article Content */}
              <div className="p-6 md:p-8">
                <div className="flex items-center justify-between mb-8">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center text-gray-600">
                      <Clock className="h-4 w-4 mr-2" />
                      <span className="text-sm font-medium">5 min read</span>
                    </div>
                    <div className="flex items-center text-gray-600">
                      <BookOpen className="h-4 w-4 mr-2" />
                      <span className="text-sm font-medium">Featured</span>
                    </div>
                  </div>
                  <button 
                    onClick={() => navigate(`/blog/${selectedBlog.id}`)}
                    className="flex items-center space-x-2 px-4 py-2 text-blue-600 hover:text-blue-700 font-medium"
                  >
                    <span>View Full Article</span>
                    <ChevronRight className="h-4 w-4" />
                  </button>
                </div>

                <div className="mb-8">
                  <h3 className="text-xl font-bold text-gray-900 mb-4">Category</h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedBlog.category.map((cat) => (
                      <span 
                        key={cat} 
                        className="px-4 py-2 bg-blue-50 text-blue-700 font-medium rounded-lg"
                      >
                        {cat}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="prose max-w-none">
                  <p className="text-lg text-gray-700 mb-6 leading-relaxed">
                    {selectedBlog.description}
                  </p>
                  
                  <div className="border-t border-b border-gray-200 py-6 my-6">
                    <h3 className="text-2xl font-bold text-gray-900 mb-4">{selectedBlog.title}</h3>
                  </div>

                  <div className="text-gray-700 space-y-4">
                    {selectedBlog.content.split('\n').slice(0, 3).map((paragraph, index) => (
                      <p key={index} className="text-base leading-7">
                        {paragraph}
                      </p>
                    ))}
                    <button 
                      onClick={() => navigate(`/blog/${selectedBlog.id}`)}
                      className="text-blue-600 hover:text-blue-700 font-medium"
                    >
                      Read full article →
                    </button>
                  </div>
                </div>

                {/* Tags */}
                <div className="mt-12 pt-8 border-t border-gray-200">
                  <div className="flex flex-wrap gap-2">
                    {selectedBlog.category.map((cat) => (
                      <span 
                        key={cat} 
                        className="px-3 py-1.5 bg-gray-100 text-gray-700 text-sm font-medium rounded-lg"
                      >
                        #{cat.toLowerCase()}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Left Panel - Blog List (1/3 width on desktop) */}
        <div className="space-y-4">
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl p-4 text-white">
            <div className="flex items-center space-x-3">
              <Award className="h-8 w-8" />
              <div>
                <h3 className="font-bold text-lg">Premium Content</h3>
                <p className="text-blue-100 text-sm">Expert insights curated for finance professionals</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-4">
            <h3 className="font-bold text-gray-900 mb-4">Latest Articles</h3>
            <div className="space-y-4">
              {blogs?.map((blog) => (
                <div 
                  key={blog.id}
                  onClick={() => setSelectedBlogId(blog.id)}
                  className={`p-4 rounded-lg cursor-pointer transition-all duration-200 ${
                    selectedBlogId === blog.id 
                      ? 'bg-blue-50 border border-blue-200' 
                      : 'hover:bg-gray-50 border border-transparent hover:border-gray-200'
                  }`}
                >
                  <div className="flex items-start space-x-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-semibold text-blue-600 uppercase tracking-wider">
                          {blog.category[0]}
                        </span>
                        <span className="text-xs text-gray-500">
                          {formatDate(blog.date)}
                        </span>
                      </div>
                      
                      <h4 className="font-bold text-gray-900 mb-2 line-clamp-2">
                        {blog.title}
                      </h4>
                      
                      <p className="text-sm text-gray-600 line-clamp-2 mb-3">
                        {blog.description}
                      </p>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          {blog.category.slice(0, 2).map((cat) => (
                            <span 
                              key={cat} 
                              className="px-2 py-0.5 bg-gray-100 text-gray-600 text-xs rounded"
                            >
                              {cat}
                            </span>
                          ))}
                          {blog.category.length > 2 && (
                            <span className="text-xs text-gray-500">+{blog.category.length - 2}</span>
                          )}
                        </div>
                        <ChevronRight className={`h-4 w-4 text-gray-400 ${
                          selectedBlogId === blog.id ? 'text-blue-600' : ''
                        }`} />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Stats Card */}
          <div className="bg-gradient-to-br from-gray-900 to-black rounded-xl p-6 text-white">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-bold text-lg">Community Stats</h3>
              <TrendingUp className="h-5 w-5 text-green-400" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold mb-1">{blogs?.length || 0}</div>
                <div className="text-sm text-gray-400">Articles</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold mb-1">
                  {blogs?.reduce((acc, blog) => acc + blog.category.length, 0) || 0}
                </div>
                <div className="text-sm text-gray-400">Topics</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile View Navigation */}
      <div className="lg:hidden mt-8">
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-gray-900">Browse More Articles</h3>
            <Link 
              to="/create" 
              className="text-sm text-blue-600 hover:text-blue-700 font-medium"
            >
              Write Article →
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {blogs?.slice(0, 4).map((blog) => (
              <div 
                key={blog.id}
                onClick={() => navigate(`/blog/${blog.id}`)}
                className="p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:shadow-sm transition-all cursor-pointer"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-semibold text-blue-600">{blog.category[0]}</span>
                  <span className="text-xs text-gray-500">{formatDate(blog.date)}</span>
                </div>
                <h4 className="font-bold text-gray-900 line-clamp-2 text-sm">{blog.title}</h4>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default HomePage
import React, { useState, useMemo, useEffect } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { Calendar, Clock, Tag, TrendingUp, ArrowRight, Search, Filter, BookOpen, Award, Users, X, Hash, Zap } from 'lucide-react'

interface Blog {
  id: number
  title: string
  category: string[]
  description: string
  date: string
  coverImage: string
  content: string
}

const CATEGORIES = ['All', 'Finance', 'Career', 'Regulations', 'Skills', 'Technology', 'Taxation', 'Audit', 'Fintech', 'AI', 'Blockchain', 'Investment']

const HomePage: React.FC = () => {
  const navigate = useNavigate()
  const [searchParams, setSearchParams] = useSearchParams()
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || 'All')
  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '')
  const [recentSearches, setRecentSearches] = useState<string[]>(() => {
    const saved = localStorage.getItem('recentSearches')
    return saved ? JSON.parse(saved) : []
  })

  const { data: blogs, isLoading, error } = useQuery<Blog[]>({
    queryKey: ['blogs'],
    queryFn: async () => {
      const response = await fetch('http://localhost:3001/blogs')
      if (!response.ok) throw new Error('Failed to fetch blogs')
      return response.json()
    },
  })

  // Update URL when filters change
  useEffect(() => {
    const params: any = {}
    if (selectedCategory !== 'All') params.category = selectedCategory
    if (searchQuery) params.search = searchQuery
    setSearchParams(params)
  }, [selectedCategory, searchQuery, setSearchParams])

  // Save recent searches
  useEffect(() => {
    if (searchQuery && !recentSearches.includes(searchQuery)) {
      const updated = [searchQuery, ...recentSearches.slice(0, 4)]
      setRecentSearches(updated)
      localStorage.setItem('recentSearches', JSON.stringify(updated))
    }
  }, [searchQuery])

  const filteredBlogs = useMemo(() => {
    if (!blogs) return []

    return blogs.filter(blog => {
      // Category filter
      const matchesCategory = selectedCategory === 'All' || 
        blog.category.some(cat => 
          cat.toLowerCase().includes(selectedCategory.toLowerCase())
        )
      
      // Search filter
      if (!searchQuery) return matchesCategory
      
      const query = searchQuery.toLowerCase()
      const matchesSearch = 
        blog.title.toLowerCase().includes(query) ||
        blog.description.toLowerCase().includes(query) ||
        blog.content.toLowerCase().includes(query) ||
        blog.category.some(cat => cat.toLowerCase().includes(query))
      
      return matchesCategory && matchesSearch
    })
  }, [blogs, selectedCategory, searchQuery])

  const searchResults = useMemo(() => {
    if (!searchQuery || !blogs) return { blogs: [], categories: [], topics: [] }

    const results = {
      blogs: filteredBlogs,
      categories: Array.from(new Set(
        filteredBlogs.flatMap(blog => blog.category)
      )),
      topics: [] as string[]
    }

    // Extract common topics from content
    const contentWords = filteredBlogs.flatMap(blog => 
      blog.content.toLowerCase().split(/\W+/)
    )
    
    const wordFrequency: Record<string, number> = {}
    contentWords.forEach(word => {
      if (word.length > 4 && !['financial', 'accounting', 'business'].includes(word)) {
        wordFrequency[word] = (wordFrequency[word] || 0) + 1
      }
    })
    
    results.topics = Object.entries(wordFrequency)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5)
      .map(([word]) => word.charAt(0).toUpperCase() + word.slice(1))

    return results
  }, [searchQuery, blogs, filteredBlogs])

  const featuredBlog = filteredBlogs?.[0]
  const recentBlogs = filteredBlogs?.slice(1, 4)
  const otherBlogs = filteredBlogs?.slice(4)

  const popularTopics = useMemo(() => {
    if (!blogs) return []
    
    const topicCount: Record<string, number> = {}
    blogs.forEach(blog => {
      blog.category.forEach(cat => {
        topicCount[cat] = (topicCount[cat] || 0) + 1
      })
    })
    
    return Object.entries(topicCount)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 8)
      .map(([topic]) => topic)
  }, [blogs])

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

  const formatFullDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    })
  }

  const handleSearch = (query: string) => {
    setSearchQuery(query)
  }

  const clearSearch = () => {
    setSearchQuery('')
  }

  const handleTopicClick = (topic: string) => {
    setSearchQuery(topic)
  }

  const removeRecentSearch = (search: string) => {
    const updated = recentSearches.filter(s => s !== search)
    setRecentSearches(updated)
    localStorage.setItem('recentSearches', JSON.stringify(updated))
  }

  if (isLoading) {
    return (
      <div className="min-h-screen">
        <div className="animate-pulse">
          <div className="h-96 bg-gradient-to-r from-gray-100 to-gray-200 mb-12"></div>
        </div>
        
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="bg-white rounded-2xl p-6 border border-gray-200">
                  <div className="h-6 bg-gray-200 rounded w-3/4 mb-4"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2 mb-3"></div>
                  <div className="h-32 bg-gray-200 rounded mb-4"></div>
                  <div className="space-y-2">
                    <div className="h-4 bg-gray-200 rounded"></div>
                    <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                  </div>
                </div>
              ))}
            </div>
            <div className="space-y-6">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="bg-white rounded-xl p-4 border border-gray-200">
                  <div className="h-4 bg-gray-200 rounded w-1/4 mb-3"></div>
                  <div className="h-5 bg-gray-200 rounded mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <BookOpen className="h-10 w-10 text-red-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Error loading content</h2>
          <p className="text-gray-600 mb-6">{(error as Error).message}</p>
          <button 
            onClick={() => window.location.reload()}
            className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:opacity-90 transition-opacity"
          >
            Try Again
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-br from-blue-50 via-white to-purple-50 border-b border-gray-100">
        <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
        <div className="container mx-auto px-4 py-16 relative">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center space-x-2 px-4 py-2 bg-white rounded-full border border-gray-200 mb-6">
              <TrendingUp className="h-4 w-4 text-blue-600" />
              <span className="text-sm font-medium text-blue-600">TRENDING</span>
              <span className="text-sm text-gray-600">• {blogs?.length || 0}+ Articles</span>
            </div>
            
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
              Search <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Financial Insights</span>
            </h1>
            
            <p className="text-xl text-gray-600 mb-10 max-w-3xl mx-auto">
              Find expert articles on finance, accounting, regulations, and career growth
            </p>

            {/* Enhanced Search Bar */}
            <div className="max-w-3xl mx-auto mb-8">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search articles, topics, categories, or keywords..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-20 py-4 bg-white border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none shadow-sm text-lg"
                />
                {searchQuery && (
                  <button
                    onClick={clearSearch}
                    className="absolute right-16 top-1/2 transform -translate-y-1/2 p-1 text-gray-400 hover:text-gray-600"
                  >
                    <X className="h-5 w-5" />
                  </button>
                )}
                <button 
                  onClick={() => handleSearch(searchQuery)}
                  className="absolute right-2 top-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:opacity-90 transition-opacity font-medium"
                >
                  Search
                </button>
              </div>
              
              {/* Quick Search Suggestions */}
              <div className="mt-4 flex flex-wrap gap-2 justify-center">
                {popularTopics.slice(0, 5).map((topic) => (
                  <button
                    key={topic}
                    onClick={() => handleTopicClick(topic)}
                    className="inline-flex items-center space-x-1 px-3 py-1.5 bg-white border border-gray-200 rounded-lg text-sm text-gray-600 hover:border-blue-300 hover:text-blue-600 transition-colors"
                  >
                    <Hash className="h-3 w-3" />
                    <span>{topic}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Search Results Summary */}
            {searchQuery && (
              <div className="bg-white rounded-xl border border-gray-200 p-6 mt-6 text-left max-w-3xl mx-auto">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-bold text-gray-900 flex items-center">
                      <Search className="h-5 w-5 mr-2 text-blue-600" />
                      Search Results for "{searchQuery}"
                    </h3>
                    <p className="text-gray-600 text-sm">
                      Found {filteredBlogs.length} article{filteredBlogs.length !== 1 ? 's' : ''}
                    </p>
                  </div>
                  <button
                    onClick={clearSearch}
                    className="text-sm text-gray-500 hover:text-gray-700"
                  >
                    Clear search
                  </button>
                </div>
                
                {filteredBlogs.length > 0 && (
                  <div className="space-y-4">
                    <div className="flex flex-wrap gap-2">
                      <span className="px-3 py-1 bg-blue-50 text-blue-600 text-sm font-medium rounded-lg">
                        {filteredBlogs.length} Articles
                      </span>
                      {searchResults.categories.slice(0, 3).map(cat => (
                        <span key={cat} className="px-3 py-1 bg-gray-100 text-gray-600 text-sm font-medium rounded-lg">
                          {cat}
                        </span>
                      ))}
                      {searchResults.topics.length > 0 && (
                        <span className="px-3 py-1 bg-purple-50 text-purple-600 text-sm font-medium rounded-lg">
                          {searchResults.topics.length} Topics
                        </span>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Category Filter */}
      <div className="container mx-auto px-4 py-6 border-b border-gray-100 bg-white/80 backdrop-blur-sm sticky top-[57px] z-40">
        <div className="flex items-center justify-between">
          <div className="flex space-x-1 overflow-x-auto pb-2">
            {CATEGORIES.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-lg font-medium text-sm whitespace-nowrap transition-all ${
                  selectedCategory === category
                    ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-sm'
                    : 'text-gray-600 hover:text-blue-600 hover:bg-gray-50'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
          <div className="flex items-center space-x-4">
            <span className="text-sm text-gray-500 hidden md:block">
              {filteredBlogs.length} results
            </span>
            <button 
              onClick={() => setSelectedCategory('All')}
              className="text-sm text-gray-600 hover:text-blue-600"
            >
              Clear filters
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-12">
        {/* Search Results Sidebar */}
        {searchQuery && filteredBlogs.length > 0 && (
          <div className="mb-12">
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
              {/* Search Insights */}
              <div className="lg:col-span-1">
                <div className="bg-white rounded-xl border border-gray-200 p-6 sticky top-32">
                  <h3 className="font-bold text-gray-900 mb-4 flex items-center">
                    <Zap className="h-5 w-5 mr-2 text-blue-600" />
                    Search Insights
                  </h3>
                  
                  {/* Related Categories */}
                  {searchResults.categories.length > 0 && (
                    <div className="mb-6">
                      <h4 className="text-sm font-medium text-gray-700 mb-3">Related Categories</h4>
                      <div className="space-y-2">
                        {searchResults.categories.map(cat => (
                          <button
                            key={cat}
                            onClick={() => handleTopicClick(cat)}
                            className="flex items-center justify-between w-full p-2 text-left rounded-lg hover:bg-gray-50"
                          >
                            <span className="text-sm text-gray-600">{cat}</span>
                            <ArrowRight className="h-4 w-4 text-gray-400" />
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Related Topics */}
                  {searchResults.topics.length > 0 && (
                    <div className="mb-6">
                      <h4 className="text-sm font-medium text-gray-700 mb-3">Frequent Topics</h4>
                      <div className="flex flex-wrap gap-2">
                        {searchResults.topics.map(topic => (
                          <button
                            key={topic}
                            onClick={() => handleTopicClick(topic)}
                            className="px-3 py-1.5 bg-blue-50 text-blue-600 text-sm rounded-lg hover:bg-blue-100"
                          >
                            #{topic.toLowerCase()}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Recent Searches */}
                  {recentSearches.length > 0 && (
                    <div>
                      <h4 className="text-sm font-medium text-gray-700 mb-3">Recent Searches</h4>
                      <div className="space-y-2">
                        {recentSearches.map((search, index) => (
                          <div key={index} className="flex items-center justify-between group">
                            <button
                              onClick={() => handleSearch(search)}
                              className="text-sm text-gray-600 hover:text-blue-600 flex-1 text-left"
                            >
                              {search}
                            </button>
                            <button
                              onClick={() => removeRecentSearch(search)}
                              className="opacity-0 group-hover:opacity-100 p-1 text-gray-400 hover:text-red-500"
                            >
                              <X className="h-3 w-3" />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Search Results */}
              <div className="lg:col-span-3">
                <div className="mb-8">
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">
                    Search Results ({filteredBlogs.length})
                  </h2>
                  <p className="text-gray-600">
                    Articles matching "{searchQuery}"
                  </p>
                </div>

                <div className="space-y-6">
                  {filteredBlogs.map((blog) => (
                    <div 
                      key={blog.id}
                      onClick={() => navigate(`/blog/${blog.id}`)}
                      className="bg-white rounded-xl border border-gray-200 p-6 hover:border-blue-300 hover:shadow-md transition-all cursor-pointer group"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-3">
                            <span className="px-3 py-1 bg-blue-50 text-blue-600 text-xs font-semibold rounded-full">
                              {blog.category[0]}
                            </span>
                            <span className="text-sm text-gray-500">{formatDate(blog.date)}</span>
                            <span className="text-sm text-gray-500">•</span>
                            <span className="text-sm text-gray-500">5 min read</span>
                          </div>
                          
                          <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors">
                            {blog.title}
                          </h3>
                          
                          <p className="text-gray-600 mb-4 line-clamp-2">
                            {blog.description}
                          </p>
                          
                          {/* Highlight search matches */}
                          {searchQuery && (
                            <div className="mb-4">
                              <div className="text-sm text-gray-500 mb-2">Matching content:</div>
                              <div className="text-sm text-gray-700 bg-yellow-50 border-l-4 border-yellow-500 pl-4 py-2 rounded">
                                {blog.content
                                  .toLowerCase()
                                  .split('.')
                                  .find(sentence => sentence.includes(searchQuery.toLowerCase()))
                                  ?.substring(0, 150) || 
                                  blog.description.substring(0, 150)
                                }...
                              </div>
                            </div>
                          )}
                          
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-2">
                              {blog.category.slice(0, 3).map((cat) => (
                                <span 
                                  key={cat} 
                                  className={`px-2 py-1 text-xs rounded-lg ${
                                    cat.toLowerCase().includes(searchQuery.toLowerCase())
                                      ? 'bg-green-100 text-green-700'
                                      : 'bg-gray-100 text-gray-600'
                                  }`}
                                >
                                  {cat}
                                </span>
                              ))}
                            </div>
                            <div className="flex items-center space-x-2 text-blue-600">
                              <span className="text-sm font-medium">Read Article</span>
                              <ArrowRight className="h-4 w-4" />
                            </div>
                          </div>
                        </div>
                        
                        <div className="hidden md:block ml-6 w-24 h-24 rounded-lg overflow-hidden">
                          <img 
                            src={blog.coverImage} 
                            alt={blog.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Regular Content (when no search) */}
        {!searchQuery && (
          <>
            {featuredBlog && (
              <div className="mb-16">
                <div className="flex items-center justify-between mb-8">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">Featured Article</h2>
                    <p className="text-gray-600">Most read article this week</p>
                  </div>
                  <div className="flex items-center space-x-2 text-blue-600">
                    <TrendingUp className="h-5 w-5" />
                    <span className="font-medium">Trending</span>
                  </div>
                </div>

                <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow">
                  <div className="grid grid-cols-1 lg:grid-cols-2">
                    <div className="relative h-64 lg:h-auto">
                      <img 
                        src={featuredBlog.coverImage} 
                        alt={featuredBlog.title}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute top-4 left-4">
                        <span className="px-3 py-1 bg-white/90 backdrop-blur-sm text-blue-600 text-xs font-semibold rounded-full">
                          {featuredBlog.category[0]}
                        </span>
                      </div>
                    </div>
                    
                    <div className="p-8">
                      <div className="flex items-center space-x-4 text-gray-500 text-sm mb-4">
                        <div className="flex items-center">
                          <Calendar className="h-4 w-4 mr-2" />
                          <span>{formatFullDate(featuredBlog.date)}</span>
                        </div>
                        <div className="flex items-center">
                          <Clock className="h-4 w-4 mr-2" />
                          <span>5 min read</span>
                        </div>
                      </div>
                      
                      <h3 className="text-2xl font-bold text-gray-900 mb-4">
                        {featuredBlog.title}
                      </h3>
                      
                      <p className="text-gray-600 mb-6 line-clamp-3">
                        {featuredBlog.description}
                      </p>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          {featuredBlog.category.slice(0, 3).map((cat) => (
                            <span 
                              key={cat} 
                              className="px-3 py-1 bg-blue-50 text-blue-600 text-xs font-medium rounded-full"
                            >
                              {cat}
                            </span>
                          ))}
                        </div>
                        <Link 
                          to={`/blog/${featuredBlog.id}`}
                          className="flex items-center space-x-2 text-blue-600 hover:text-blue-700 font-medium"
                        >
                          <span>Read Article</span>
                          <ArrowRight className="h-4 w-4" />
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Recent Articles */}
              <div className="lg:col-span-2">
                <div className="mb-8">
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">Latest Articles</h2>
                  <p className="text-gray-600">Click a tag to explore posts by topic</p>
                </div>

                <div className="space-y-6">
                  {filteredBlogs?.map((blog) => (
                    <div 
                      key={blog.id}
                      onClick={() => navigate(`/blog/${blog.id}`)}
                      className="bg-white rounded-xl border border-gray-200 p-6 hover:border-blue-300 hover:shadow-md transition-all cursor-pointer group"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-3">
                            <span className="px-3 py-1 bg-blue-50 text-blue-600 text-xs font-semibold rounded-full">
                              {blog.category[0]}
                            </span>
                            <span className="text-sm text-gray-500">{formatDate(blog.date)}</span>
                          </div>
                          
                          <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors">
                            {blog.title}
                          </h3>
                          
                          <p className="text-gray-600 mb-4 line-clamp-2">
                            {blog.description}
                          </p>
                          
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-2">
                              {blog.category.slice(0, 2).map((cat) => (
                                <span 
                                  key={cat} 
                                  className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-lg"
                                >
                                  {cat}
                                </span>
                              ))}
                            </div>
                            <div className="flex items-center space-x-2 text-blue-600">
                              <span className="text-sm font-medium">Read More</span>
                              <ArrowRight className="h-4 w-4" />
                            </div>
                          </div>
                        </div>
                        
                        <div className="hidden md:block ml-6 w-24 h-24 rounded-lg overflow-hidden">
                          <img 
                            src={blog.coverImage} 
                            alt={blog.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Sidebar */}
              <div className="space-y-8">
                {/* Popular Tags */}
                <div className="bg-white rounded-xl border border-gray-200 p-6">
                  <h3 className="font-bold text-gray-900 mb-4 flex items-center">
                    <Tag className="h-5 w-5 mr-2 text-blue-600" />
                    Popular Topics
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {popularTopics.map((tag) => (
                      <button
                        key={tag}
                        onClick={() => handleTopicClick(tag)}
                        className="px-3 py-1.5 bg-gray-50 text-gray-700 text-sm rounded-lg hover:bg-blue-50 hover:text-blue-600 transition-colors"
                      >
                        {tag}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Stats */}
                <div className="bg-gradient-to-br from-gray-900 to-black rounded-xl p-6 text-white">
                  <h3 className="font-bold text-lg mb-6">Community Stats</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-4 bg-white/10 rounded-lg">
                      <Users className="h-8 w-8 mx-auto mb-2 text-blue-300" />
                      <div className="text-2xl font-bold">{blogs?.length || 0}</div>
                      <div className="text-sm text-gray-400">Articles</div>
                    </div>
                    <div className="text-center p-4 bg-white/10 rounded-lg">
                      <Award className="h-8 w-8 mx-auto mb-2 text-purple-300" />
                      <div className="text-2xl font-bold">
                        {blogs?.reduce((acc, blog) => acc + blog.category.length, 0) || 0}
                      </div>
                      <div className="text-sm text-gray-400">Topics</div>
                    </div>
                  </div>
                </div>

                {/* Recent Posts */}
                <div className="bg-white rounded-xl border border-gray-200 p-6">
                  <h3 className="font-bold text-gray-900 mb-4">Recent Posts</h3>
                  <div className="space-y-4">
                    {recentBlogs?.map((blog) => (
                      <div 
                        key={blog.id}
                        onClick={() => navigate(`/blog/${blog.id}`)}
                        className="flex items-start space-x-3 p-3 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                      >
                        <div className="w-12 h-12 rounded-lg overflow-hidden flex-shrink-0">
                          <img 
                            src={blog.coverImage} 
                            alt={blog.title}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-semibold text-gray-900 text-sm line-clamp-2 mb-1">
                            {blog.title}
                          </h4>
                          <div className="flex items-center text-xs text-gray-500">
                            <Calendar className="h-3 w-3 mr-1" />
                            {formatDate(blog.date)}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </>
        )}

        {/* No Results */}
        {searchQuery && filteredBlogs.length === 0 && (
          <div className="text-center py-20">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Search className="h-12 w-12 text-gray-400" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-3">No results found</h3>
            <p className="text-gray-600 mb-8 max-w-md mx-auto">
              We couldn't find any articles matching "{searchQuery}". Try searching with different keywords or browse our popular topics.
            </p>
            <div className="flex flex-wrap gap-3 justify-center mb-8">
              {popularTopics.slice(0, 6).map(topic => (
                <button
                  key={topic}
                  onClick={() => handleTopicClick(topic)}
                  className="px-4 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 font-medium"
                >
                  {topic}
                </button>
              ))}
            </div>
            <button
              onClick={clearSearch}
              className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:opacity-90 transition-opacity font-medium"
            >
              Clear Search
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default HomePage
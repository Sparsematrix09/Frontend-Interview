import React, { useState, useMemo, useEffect } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { 
  Calendar, Clock, Tag, TrendingUp, ArrowRight, Search, Filter, BookOpen, Award, 
  Users, X, Hash, Zap,ChevronRight,Sparkles,Target,BarChart3,Cpu,Briefcase,Globe,Shield,
  Rocket,Star,Eye
} from 'lucide-react'

interface Blog {
  id: number
  title: string
  category: string[]
  description: string
  date: string
  coverImage: string
  content: string
}

const CATEGORIES = [
  { name: 'All', icon: Globe, count: 0 },
  { name: 'Tech', icon: Cpu, count: 0 },
  { name: 'Finance', icon: BarChart3, count: 0 },
  { name: 'Business', icon: Briefcase, count: 0 },
  { name: 'Development', icon: Rocket, count: 0 },
  { name: 'AI', icon: Target, count: 0 },
  { name: 'Blockchain', icon: Shield, count: 0 }
]

const HomePage: React.FC = () => {
  const navigate = useNavigate()
  const [searchParams, setSearchParams] = useSearchParams()
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || 'All')
  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '')
  const [visibleBlogs, setVisibleBlogs] = useState(6)
  const [categoriesWithCounts, setCategoriesWithCounts] = useState(CATEGORIES)

  const { data: blogs, isLoading, error } = useQuery<Blog[]>({
    queryKey: ['blogs'],
    queryFn: async () => {
      const response = await fetch('http://localhost:3001/blogs')
      if (!response.ok) throw new Error('Failed to fetch blogs')
      return response.json()
    },
  })

  // Update count of cat.
  useEffect(() => {
    if (blogs) {
      const updatedCategories = CATEGORIES.map(category => {
        if (category.name === 'All') {
          return { ...category, count: blogs.length }
        }
        
        const count = blogs.filter(blog => 
          blog.category.some(cat => 
            cat.toLowerCase().includes(category.name.toLowerCase())
          )
        ).length
        
        return { ...category, count }
      })
      
      setCategoriesWithCounts(updatedCategories)
    }
  }, [blogs])

  useEffect(() => {
    const params: any = {}
    if (selectedCategory !== 'All') params.category = selectedCategory
    if (searchQuery) params.search = searchQuery
    setSearchParams(params)
  }, [selectedCategory, searchQuery, setSearchParams])

  const filteredBlogs = useMemo(() => {
    if (!blogs) return []

    return blogs.filter(blog => {
      const matchesCategory = selectedCategory === 'All' || 
        blog.category.some(cat => 
          cat.toLowerCase().includes(selectedCategory.toLowerCase())
        )
      
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

  const featuredBlog = filteredBlogs?.[0]
  const gridBlogs = filteredBlogs?.slice(0, visibleBlogs)

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    })
  }

  const getReadTime = () => {
    return Math.floor(Math.random() * 8) + 3
  }

  const handleSearch = (query: string) => {
    setSearchQuery(query)
  }

  const clearSearch = () => {
    setSearchQuery('')
  }

  const handleLoadMore = () => {
    setVisibleBlogs(prev => prev + 3)
  }

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      'TECH': 'category-tech',
      'FINANCE': 'category-finance',
      'BUSINESS': 'category-business',
      'DEVELOPMENT': 'category-development',
      'AI': 'category-ai',
      'BLOCKCHAIN': 'category-blockchain'
    }
    return colors[category] || 'bg-gradient-to-r from-gray-300 to-gray-400'
  }

  if (isLoading) {
    return (
      <div className="min-h-screen">
        <div className="animate-pulse">
          <div className="h-[600px] bg-gradient-to-br from-candy-pink/10 to-green-yellow/10 mb-12"></div>
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
            className="px-6 py-3 bg-gradient-to-r from-candy-pink to-green-yellow text-white rounded-lg hover:opacity-90 transition-opacity"
          >
            Try Again
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen">
      <section className="relative hero-gradient grid-pattern overflow-hidden">
        <div className="absolute inset-0 animate-grid-pattern"></div>
        <div className="container mx-auto px-4 py-20 lg:py-32 relative">
          <div className="max-w-6xl mx-auto">
            <div className="inline-flex items-center space-x-2 px-4 py-2 bg-white/90 backdrop-blur-sm rounded-full border border-white/20 mb-8 animate-slide-down stagger-1 glass-effect">
              <Sparkles className="h-4 w-4 text-candy-pink" />
              <span className="text-sm font-medium text-candy-pink">PROFESSIONAL INSIGHTS</span>
            </div>
            
   <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold text-gray-900 mb-6 leading-tight animate-slide-up stagger-2">
              Insights on <span className="text-gradient">Finance, Tech & Business</span>
            </h1>
            
        <p className="text-xl md:text-2xl text-gray-600 mb-10 max-w-3xl animate-slide-up stagger-3">
              Expert perspectives on fintech, blockchain, development, and business strategy. 
              Stay ahead with in-depth analysis and industry insights.
          </p>

        <div className="animate-slide-up stagger-4">
              <button 
                onClick={() => document.getElementById('articles')?.scrollIntoView({ behavior: 'smooth' })}
                className="group inline-flex items-center space-x-3 px-8 py-4 bg-candy-pink text-white rounded-full hover:opacity-90 transition-all duration-300 shadow-lg hover:shadow-xl font-medium text-lg"
              >
                <span>Explore Articles</span>
                <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center group-hover:translate-x-1 transition-transform">
                  <ArrowRight className="h-5 w-5" />
          </div>
        </button>
    </div>

  <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-6 animate-slide-up stagger-5">
      {[
        { label: "Articles", value: blogs?.length || 0, icon: BookOpen },
        { label: "Experts", value: "50+", icon: Users },
        { label: "Categories", value: categoriesWithCounts.length - 1, icon: Tag },
        { label: "Readers", value: "10K+", icon: Eye }
            ].map((stat, index) => {
                const Icon = stat.icon;
                const displayValue = typeof stat.value === 'number' && stat.value > 0 ? `${stat.value}+` : stat.value;
                
        return (
          <div key={index} className="glass-effect p-6 rounded-2xl text-center">
                    <Icon className="h-8 w-8 text-candy-pink mx-auto mb-3" />
                    <div className="text-3xl font-bold text-gray-900 mb-1">{displayValue}</div>
                    <div className="text-gray-600 text-sm">{stat.label}</div>
          </div>
                )
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Featured Article */}
      {featuredBlog && (
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-between mb-10">
              <div>
                <div className="flex items-center space-x-2 mb-3">
                  <Star className="h-5 w-5 text-green-yellow" />
                  <span className="text-sm font-medium text-green-yellow uppercase tracking-wider">FEATURED ARTICLE</span>
                </div>
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900">Editor's Pick</h2>
              </div>
              <div className="divider-gradient w-24 h-1 rounded-full"></div>
            </div>

            <div className="bg-white rounded-3xl overflow-hidden card-hover border border-gray-100 shadow-lg">
              <div className="grid grid-cols-1 lg:grid-cols-2">
                <div className="relative h-64 lg:h-auto">
                  <img 
                    src={featuredBlog.coverImage} 
                    alt={featuredBlog.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-6 left-6">
                    <span className={`px-4 py-2 text-white text-xs font-semibold rounded-full ${getCategoryColor(featuredBlog.category[0])}`}>
                      {featuredBlog.category[0]}
                    </span>
                  </div>
                </div>
                
                <div className="p-8 lg:p-12">
                  <div className="flex items-center space-x-4 text-gray-500 text-sm mb-4">
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 mr-2" />
                      <span>{formatDate(featuredBlog.date)}</span>
                    </div>
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 mr-2" />
                      <span>{getReadTime()} min read</span>
                    </div>
                  </div>
                  
                  <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
                    {featuredBlog.title}
                  </h3>
                  
                  <p className="text-gray-600 mb-6 text-lg">
                    {featuredBlog.description}
                  </p>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      {featuredBlog.category.slice(0, 2).map((cat) => (
                        <span 
                          key={cat} 
                          className={`px-3 py-1.5 text-white text-xs font-medium rounded-full ${getCategoryColor(cat)}`}
                        >
                          {cat}
                        </span>
                      ))}
                    </div>
                    <Link 
                      to={`/blog/${featuredBlog.id}`}
                      className="group flex items-center space-x-2 text-candy-pink hover:text-candy-pink/80 font-medium"
                    >
                      <span>Read Full Article</span>
                      <ChevronRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/*Articles*/} 
      <section id="articles" className="py-16 bg-gray-50/50">
        <div className="container mx-auto px-4">
          <div className="mb-12">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 mb-8">
              <div className="flex-1">
                <div className="relative max-w-xl">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search articles by title, description, or category..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-12 pr-12 py-3 bg-white border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-candy-pink focus:border-candy-pink outline-none shadow-sm"
                  />
                  {searchQuery && (
                    <button
                      onClick={clearSearch}
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 p-1 text-gray-400 hover:text-gray-600"
                    >
                      <X className="h-5 w-5" />
                    </button>
                  )}
                </div>
              </div>
              
              <div className="flex items-center space-x-4">
                <Filter className="h-5 w-5 text-gray-400" />
                <select 
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="px-4 py-3 bg-white border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-candy-pink focus:border-candy-pink outline-none appearance-none"
                >
                  {categoriesWithCounts.map(cat => (
                    <option key={cat.name} value={cat.name}>
                      {cat.name} ({cat.count})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/*Category Filter Chips */}
            <div className="flex flex-wrap gap-3">
              {categoriesWithCounts.map((cat) => {
                const Icon = cat.icon
                return (
                  <button
                    key={cat.name}
                    onClick={() => setSelectedCategory(cat.name)}
                    className={`group flex items-center space-x-2 px-4 py-2.5 rounded-full font-medium transition-all duration-300 ${
                      selectedCategory === cat.name
                        ? 'bg-gradient-to-r from-candy-pink to-green-yellow text-white shadow-lg'
                        : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
                    }`}
                  >
                    <Icon className={`h-4 w-4 ${
                      selectedCategory === cat.name ? 'text-white' : 'text-gray-500'
                    }`} />
                    <span>{cat.name}</span>
                    <span className={`px-2 py-0.5 text-xs rounded-full ${
                      selectedCategory === cat.name
                        ? 'bg-white/20'
                        : 'bg-gray-100 text-gray-600'
                    }`}>
                      {cat.count}
                    </span>
                  </button>
                )
              })}
            </div>
          </div>

          <div className="mb-8">
            <h3 className="text-2xl font-bold text-gray-900">
              {searchQuery ? `Search Results for "${searchQuery}"` : 'Latest Articles'}
            </h3>
            <p className="text-gray-600 mt-2">
              {filteredBlogs.length} {filteredBlogs.length === 1 ? 'article' : 'articles'} found
            </p>
          </div>

          {/* Articles*/}
          {blogs && blogs.length > 0 ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {gridBlogs?.map((blog) => (
                  <article 
                    key={blog.id}
                    className="bg-white rounded-2xl overflow-hidden card-hover border border-gray-100 shadow-sm"
                  >
                    <Link to={`/blog/${blog.id}`} className="block">
                      <div className="relative h-48 overflow-hidden">
                        <img 
                          src={blog.coverImage} 
                          alt={blog.title}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                        <div className="absolute top-4 left-4">
                          <span className={`px-3 py-1.5 text-white text-xs font-semibold rounded-full ${getCategoryColor(blog.category[0])}`}>
                            {blog.category[0]}
                          </span>
                    </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                 </div>
                      
                      <div className="p-6">
                        <div className="flex items-center justify-between text-gray-500 text-sm mb-4">
                          <div className="flex items-center">
                            <Calendar className="h-4 w-4 mr-2" />
                            <span>{formatDate(blog.date)}</span>
                          </div>
                          <div className="flex items-center">
                            <Clock className="h-4 w-4 mr-2" />
                            <span>{getReadTime()} min read</span>
                          </div>
                        </div>
                        
                        <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-candy-pink transition-colors line-clamp-2">
                          {blog.title}
                        </h3>
                        
                        <p className="text-gray-600 mb-4 line-clamp-3">
                          {blog.description}
                        </p>
                        
                        <div className="flex items-center justify-between mt-6 pt-4 border-t border-gray-100">
                          <div className="flex flex-wrap gap-2">
                            {blog.category.slice(0, 2).map((cat) => (
                              <span 
                                key={cat} 
                                className={`px-2 py-1 text-white text-xs font-medium rounded ${getCategoryColor(cat)}`}
                              >
                                {cat}
                              </span>
                            ))}
                          </div>
            <div className="flex items-center space-x-2 text-candy-pink hover:text-candy-pink/80">
                <span className="text-sm font-medium">Read</span>
                            <ArrowRight className="h-4 w-4" />
                          </div>
                        </div>
                      </div>
                    </Link>
                  </article>
                ))}
              </div>

{filteredBlogs.length === 0 && (
        <div className="text-center py-20">
              <div className="w-24 h-24 bg-gradient-to-br from-candy-pink/10 to-green-yellow/10 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Search className="h-12 w-12 text-gray-400" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-3">No results found</h3>
                  <p className="text-gray-600 mb-8 max-w-md mx-auto">
                    We couldn't find any articles matching "{searchQuery}". Try searching with different keywords.
                  </p>
          <button
                    onClick={clearSearch}
                    className="px-6 py-3 bg-gradient-to-r from-candy-pink to-green-yellow text-white rounded-full hover:opacity-90 transition-opacity font-medium"
                  >
                    Clear Search
          </button>
                </div>
       )}

              {filteredBlogs.length > visibleBlogs && (
                <div className="text-center mt-12">
                  <button
                    onClick={handleLoadMore}
                    className="group inline-flex items-center space-x-2 px-8 py-3 border-2 border-candy-pink text-candy-pink rounded-full hover:bg-candy-pink hover:text-white transition-all duration-300 font-medium"
                  >
                    <span>Load More Articles</span>
                    <div className="w-6 h-6 rounded-full bg-candy-pink/10 group-hover:bg-white/20 flex items-center justify-center">
                      <ArrowRight className="h-3 w-3" />
                    </div>
                  </button>
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-20">
              <div className="w-24 h-24 bg-gradient-to-br from-candy-pink/10 to-green-yellow/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <BookOpen className="h-12 w-12 text-gray-400" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">No articles yet</h3>
              <p className="text-gray-600 mb-8 max-w-md mx-auto">
                Be the first to contribute by writing an article about finance, tech, or business.
              </p>
              <Link 
                to="/create" 
                className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-candy-pink to-green-yellow text-white rounded-full hover:opacity-90 transition-opacity font-medium"
              >
                <BookOpen className="h-5 w-5" />
                <span>Write Your First Article</span>
              </Link>
            </div>
          )}
        </div>
      </section>

      <section className="py-20 bg-gradient-to-r from-candy-pink via-green-yellow to-lavender-gray">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Ready to share your expertise?
            </h2>
            <p className="text-xl text-white/90 mb-10">
              Join our community of professionals and contribute to the conversation
            </p>
            <Link 
              to="/create" 
              className="group inline-flex items-center space-x-3 px-8 py-4 bg-white text-candy-pink rounded-full hover:bg-gray-50 transition-all duration-300 shadow-xl hover:shadow-2xl font-bold text-lg"
            >
              <BookOpen className="h-6 w-6" />
              <span>Write an Article</span>
              <ChevronRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}

export default HomePage
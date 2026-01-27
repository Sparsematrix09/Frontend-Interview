import React from 'react'
import { useQuery } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import { Calendar, Clock, TrendingUp } from 'lucide-react'
import { format, formatDistanceToNow } from 'date-fns'

interface Blog {
  id: number
  title: string
  category: string[]
  description: string
  date: string
  coverImage: string
  content: string
}

const BlogList: React.FC = () => {
  const { data: blogs, isLoading, error } = useQuery<Blog[]>({
    queryKey: ['blogs'],
    queryFn: async () => {
      const response = await fetch('http://localhost:3001/blogs')
      if (!response.ok) throw new Error('Failed to fetch blogs')
      return response.json()
    },
  })

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="h-8 bg-gray-200 rounded w-1/3 mb-8 animate-pulse"></div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 animate-pulse">
              <div className="h-40 bg-gray-200 rounded-lg mb-4"></div>
              <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
              <div className="h-6 bg-gray-200 rounded mb-3"></div>
              <div className="h-4 bg-gray-200 rounded mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-2/3"></div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-xl p-8 text-center">
        <h2 className="text-red-600 text-xl font-semibold mb-2">Error loading blogs</h2>
        <p className="text-red-500">{(error as Error).message}</p>
      </div>
    )
  }

  return (
    <div>
      <div className="mb-10">
        <div className="flex items-center space-x-2 mb-3">
          <TrendingUp className="h-5 w-5 text-blue-600" />
          <span className="text-sm font-medium text-blue-600 uppercase tracking-wider">Latest Articles</span>
        </div>
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
          Stay updated with the latest trends in <span className="text-blue-600">finance, accounting, and career growth</span>
        </h1>
        <p className="text-gray-600 text-lg">Expert insights, practical tips, and industry updates for finance professionals</p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {blogs?.map((blog, index) => (
          <article 
            key={blog.id} 
            className="bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-lg hover:border-blue-100 transition-all duration-300 overflow-hidden group"
          >
            <Link to={`/blog/${blog.id}`} className="block">
              <div className="relative overflow-hidden">
                <img 
                  src={blog.coverImage} 
                  alt={blog.title}
                  className="w-full h-56 object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-4 left-4">
                  <span className="px-3 py-1 bg-blue-600 text-white text-xs font-semibold rounded-full uppercase tracking-wider">
                    {blog.category[0]}
                  </span>
                </div>
              </div>
              
              <div className="p-6">
                <div className="flex items-center space-x-4 text-gray-500 text-sm mb-4">
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 mr-2" />
                    <span>{formatDistanceToNow(new Date(blog.date), { addSuffix: true })}</span>
                  </div>
                  <div className="flex items-center">
                    <Clock className="h-4 w-4 mr-2" />
                    <span>5 min read</span>
                  </div>
                </div>
                
                <h2 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors line-clamp-2">
                  {blog.title}
                </h2>
                
                <p className="text-gray-600 mb-4 line-clamp-3">
                  {blog.description}
                </p>
                
                <div className="flex flex-wrap gap-2 mt-4">
                  {blog.category.map((cat) => (
                    <span 
                      key={cat} 
                      className="px-3 py-1 bg-gray-100 text-gray-700 text-xs font-medium rounded-full"
                    >
                      {cat}
                    </span>
                  ))}
                </div>
                
                <div className="mt-6 pt-4 border-t border-gray-100">
                  <span className="text-blue-600 text-sm font-medium hover:text-blue-700">
                    Read Article →
                  </span>
                </div>
              </div>
            </Link>
          </article>
        ))}
      </div>
      
      {blogs?.length === 0 && (
        <div className="text-center py-16 bg-white rounded-2xl border border-gray-200">
          <div className="text-gray-300 mb-6">
            <svg className="w-20 h-20 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <h3 className="text-2xl font-bold text-gray-700 mb-3">No articles yet</h3>
          <p className="text-gray-500 mb-8 max-w-md mx-auto">Be the first to share your insights with the finance community!</p>
          <Link 
            to="/create" 
            className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium shadow-sm"
          >
            Write Your First Article
          </Link>
        </div>
      )}
    </div>
  )
}

export default BlogList
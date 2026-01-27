import React from 'react'
import { useQuery } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import { Calendar, ArrowRight, Tag } from 'lucide-react'
import { format } from 'date-fns'

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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="bg-white rounded-xl shadow-lg p-6 animate-pulse">
            <div className="h-48 bg-gray-200 rounded-lg mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
            <div className="h-6 bg-gray-200 rounded mb-3"></div>
            <div className="h-4 bg-gray-200 rounded mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-2/3"></div>
          </div>
        ))}
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
        <h2 className="text-red-600 text-xl font-semibold mb-2">Error loading blogs</h2>
        <p className="text-red-500">{(error as Error).message}</p>
      </div>
    )
  }

  return (
    <div>
      <div className="mb-8 text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Latest Blog Posts</h1>
        <p className="text-gray-600 text-lg">Insights and stories from the world of finance and technology</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {blogs?.map((blog) => (
          <div 
            key={blog.id} 
            className="bg-white rounded-2xl shadow-xl hover:shadow-2xl transition-shadow duration-300 overflow-hidden border border-gray-100"
          >
            <div className="relative h-56 overflow-hidden">
              <img 
                src={blog.coverImage} 
                alt={blog.title}
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute top-4 left-4 flex gap-2">
                {blog.category.map((cat) => (
                  <span 
                    key={cat} 
                    className="px-3 py-1 bg-white/90 backdrop-blur-sm rounded-full text-sm font-medium text-gray-700"
                  >
                    {cat}
                  </span>
                ))}
              </div>
            </div>
            
            <div className="p-6">
              <div className="flex items-center text-gray-500 text-sm mb-3">
                <Calendar className="h-4 w-4 mr-2" />
                {format(new Date(blog.date), 'MMMM dd, yyyy')}
              </div>
              
              <h3 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2">
                {blog.title}
              </h3>
              
              <p className="text-gray-600 mb-4 line-clamp-3">
                {blog.description}
              </p>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Tag className="h-4 w-4 text-gray-400" />
                  <span className="text-sm text-gray-500">
                    {blog.category.join(', ')}
                  </span>
                </div>
                
                <Link 
                  to={`/blog/${blog.id}`}
                  className="flex items-center space-x-2 text-blue-600 hover:text-blue-700 font-medium"
                >
                  <span>Read More</span>
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {blogs?.length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-400 mb-4">
            <svg className="w-16 h-16 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-gray-700 mb-2">No blogs yet</h3>
          <p className="text-gray-500 mb-6">Be the first to share your insights!</p>
          <Link 
            to="/create" 
            className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Create Your First Blog
          </Link>
        </div>
      )}
    </div>
  )
}

export default BlogList
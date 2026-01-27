import React from 'react'
import { useQuery } from '@tanstack/react-query'
import { useParams, Link } from 'react-router-dom'
import { Calendar, Tag, ArrowLeft, User } from 'lucide-react'
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

const BlogDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>()

  const { data: blog, isLoading, error } = useQuery<Blog>({
    queryKey: ['blog', id],
    queryFn: async () => {
      const response = await fetch(`http://localhost:3001/blogs/${id}`)
      if (!response.ok) throw new Error('Failed to fetch blog')
      return response.json()
    },
    enabled: !!id,
  })

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="animate-pulse">
          <div className="h-96 bg-gray-200 rounded-xl mb-8"></div>
          <div className="h-8 bg-gray-200 rounded w-3/4 mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/4 mb-8"></div>
          <div className="space-y-4">
            <div className="h-4 bg-gray-200 rounded"></div>
            <div className="h-4 bg-gray-200 rounded"></div>
            <div className="h-4 bg-gray-200 rounded w-2/3"></div>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="bg-red-50 border border-red-200 rounded-xl p-8 text-center">
          <h2 className="text-red-600 text-2xl font-semibold mb-4">Error loading blog</h2>
          <p className="text-red-500 mb-6">{(error as Error).message}</p>
          <Link 
            to="/" 
            className="inline-flex items-center space-x-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <ArrowLeft className="h-5 w-5" />
            <span>Back to Blogs</span>
          </Link>
        </div>
      </div>
    )
  }

  if (!blog) {
    return (
      <div className="max-w-4xl mx-auto text-center py-12">
        <h2 className="text-2xl font-semibold text-gray-700 mb-4">Blog not found</h2>
        <Link 
          to="/" 
          className="inline-flex items-center space-x-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <ArrowLeft className="h-5 w-5" />
          <span>Browse All Blogs</span>
        </Link>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto">
      <Link 
        to="/" 
        className="inline-flex items-center space-x-2 text-blue-600 hover:text-blue-700 mb-8"
      >
        <ArrowLeft className="h-5 w-5" />
        <span>Back to Blogs</span>
      </Link>

      <article className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
        <div className="relative h-96 overflow-hidden">
          <img 
            src={blog.coverImage} 
            alt={blog.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
          <div className="absolute bottom-0 left-0 right-0 p-8">
            <div className="flex flex-wrap gap-2 mb-4">
              {blog.category.map((cat) => (
                <span 
                  key={cat} 
                  className="px-4 py-2 bg-white/90 backdrop-blur-sm rounded-full font-medium text-gray-700"
                >
                  {cat}
                </span>
              ))}
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              {blog.title}
            </h1>
            <div className="flex items-center space-x-6 text-white/90">
              <div className="flex items-center">
                <Calendar className="h-5 w-5 mr-2" />
                <span>{format(new Date(blog.date), 'MMMM dd, yyyy')}</span>
              </div>
              <div className="flex items-center">
                <User className="h-5 w-5 mr-2" />
                <span>CA Monk Author</span>
              </div>
            </div>
          </div>
        </div>

        <div className="p-8 md:p-12">
          <div className="prose prose-lg max-w-none">
            <p className="text-xl text-gray-600 mb-8 leading-relaxed">
              {blog.description}
            </p>
            
            <div className="border-t border-b border-gray-200 py-6 my-8">
              <div className="flex items-center space-x-2">
                <Tag className="h-5 w-5 text-gray-400" />
                <span className="font-medium text-gray-700">Categories:</span>
                <div className="flex flex-wrap gap-2">
                  {blog.category.map((cat) => (
                    <span 
                      key={cat} 
                      className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-sm"
                    >
                      {cat}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="text-gray-700 leading-relaxed space-y-4">
              {blog.content.split('\n').map((paragraph, index) => (
                <p key={index} className="text-lg">
                  {paragraph}
                </p>
              ))}
            </div>
          </div>
        </div>
      </article>

      <div className="mt-12 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-8">
        <div className="flex flex-col md:flex-row items-center justify-between">
          <div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">Ready to share your insights?</h3>
            <p className="text-gray-600">Create your own blog post and contribute to the community.</p>
          </div>
          <Link 
            to="/create" 
            className="mt-4 md:mt-0 inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            Write a Blog
          </Link>
        </div>
      </div>
    </div>
  )
}

export default BlogDetail
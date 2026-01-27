import React from 'react'
import { useQuery } from '@tanstack/react-query'
import { useParams, Link } from 'react-router-dom'
import { Calendar, Clock, Tag, ArrowLeft, Share2, BookOpen, Award } from 'lucide-react'

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

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', { 
      month: 'long', 
      day: 'numeric', 
      year: 'numeric' 
    })
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-6xl mx-auto p-4">
          <div className="animate-pulse">
            <div className="h-12 bg-gray-200 rounded-lg w-32 mb-8"></div>
            <div className="h-96 bg-gray-200 rounded-2xl mb-8"></div>
            <div className="h-10 bg-gray-200 rounded w-3/4 mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2 mb-8"></div>
            <div className="space-y-4">
              <div className="h-4 bg-gray-200 rounded"></div>
              <div className="h-4 bg-gray-200 rounded"></div>
              <div className="h-4 bg-gray-200 rounded w-2/3"></div>
            </div>
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
            <Award className="h-8 w-8 text-red-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Error loading article</h2>
          <p className="text-gray-600 mb-6">{(error as Error).message}</p>
          <Link 
            to="/" 
            className="inline-flex items-center space-x-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <ArrowLeft className="h-5 w-5" />
            <span>Back to Articles</span>
          </Link>
        </div>
      </div>
    )
  }

  if (!blog) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white flex items-center justify-center">
        <div className="bg-white rounded-2xl shadow-lg p-8 max-w-md text-center">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <BookOpen className="h-8 w-8 text-gray-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Article not found</h2>
          <p className="text-gray-600 mb-6">The article you're looking for doesn't exist.</p>
          <Link 
            to="/" 
            className="inline-flex items-center space-x-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <ArrowLeft className="h-5 w-5" />
            <span>Browse All Articles</span>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-6xl mx-auto p-4">
        <Link 
          to="/" 
          className="inline-flex items-center space-x-2 text-blue-600 hover:text-blue-700 font-medium mb-8"
        >
          <ArrowLeft className="h-5 w-5" />
          <span>Back to Articles</span>
        </Link>

        <article className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
          {/* Hero Image */}
          <div className="relative h-64 md:h-96 overflow-hidden">
            <img 
              src={blog.coverImage} 
              alt={blog.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
            <div className="absolute bottom-8 left-8 right-8">
              <div className="flex items-center space-x-4 mb-4">
                <span className="px-4 py-1.5 bg-blue-600 text-white text-sm font-semibold rounded-full uppercase tracking-wider">
                  {blog.category[0]}
                </span>
                <span className="text-white/90 text-sm">{formatDate(blog.date)}</span>
              </div>
              <h1 className="text-3xl md:text-5xl font-bold text-white mb-4">
                {blog.title}
              </h1>
            </div>
          </div>

          <div className="p-6 md:p-8 lg:p-12">
            {/* Article Meta */}
            <div className="flex flex-wrap items-center justify-between gap-4 mb-8 pb-8 border-b border-gray-200">
              <div className="flex items-center space-x-6">
                <div className="flex items-center text-gray-600">
                  <Clock className="h-5 w-5 mr-2" />
                  <span className="font-medium">5 min read</span>
                </div>
                <div className="flex items-center text-gray-600">
                  <BookOpen className="h-5 w-5 mr-2" />
                  <span className="font-medium">Featured Article</span>
                </div>
              </div>
              
              <button className="flex items-center space-x-2 px-4 py-2 text-blue-600 hover:text-blue-700 font-medium border border-gray-300 rounded-lg hover:border-blue-300 transition-colors">
                <Share2 className="h-5 w-5" />
                <span>Share Article</span>
              </button>
            </div>

            {/* Article Content */}
            <div className="prose prose-lg max-w-none">
              <div className="mb-10">
                <div className="flex items-center space-x-2 mb-4">
                  <Tag className="h-5 w-5 text-blue-600" />
                  <span className="font-bold text-gray-700">CATEGORY</span>
                </div>
                <div className="flex flex-wrap gap-2 mb-6">
                  {blog.category.map((cat) => (
                    <span 
                      key={cat} 
                      className="px-4 py-2 bg-blue-50 text-blue-700 font-medium rounded-lg"
                    >
                      {cat}
                    </span>
                  ))}
                </div>

                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-100 mb-8">
                  <p className="text-xl text-gray-700 italic leading-relaxed">
                    "{blog.description}"
                  </p>
                </div>
              </div>

              <div className="text-gray-700 space-y-6">
                {blog.content.split('\n').map((paragraph, index) => (
                  <p key={index} className="text-lg leading-8">
                    {paragraph}
                  </p>
                ))}
              </div>
            </div>

            {/* Tags */}
            <div className="mt-12 pt-8 border-t border-gray-200">
              <div className="flex flex-wrap gap-3">
                {blog.category.map((cat) => (
                  <span 
                    key={cat} 
                    className="px-4 py-2 bg-gray-100 text-gray-700 font-medium rounded-lg"
                  >
                    #{cat}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </article>

        {/* Related Content */}
        <div className="mt-12 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-8 text-white">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="mb-6 md:mb-0">
              <h3 className="text-2xl font-bold mb-3">Ready to share your expertise?</h3>
              <p className="text-blue-100">Join our community of finance professionals</p>
            </div>
            <Link 
              to="/create" 
              className="px-8 py-3 bg-white text-blue-600 font-bold rounded-lg hover:bg-gray-100 transition-colors shadow-lg"
            >
              Write an Article
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default BlogDetail
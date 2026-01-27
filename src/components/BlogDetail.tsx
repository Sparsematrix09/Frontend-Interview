import React, { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { Calendar, Clock, Tag, ArrowLeft, Share2, BookOpen, User, Facebook, Twitter, Linkedin, Mail, Link as LinkIcon, MessageCircle, Copy, Check } from 'lucide-react'

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
  const navigate = useNavigate()
  const [copied, setCopied] = useState(false)

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

  const shareArticle = (platform: string) => {
    const url = window.location.href
    const title = blog?.title || 'Check out this article'
    const text = blog?.description || 'Interesting article from CA Monk Blog'
    const hashtags = blog?.category.join(',') || 'Finance,Accounting'
    
    const shareUrls = {
      twitter: `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}&hashtags=${encodeURIComponent(hashtags)}`,
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
      whatsapp: `https://wa.me/?text=${encodeURIComponent(`${title} - ${url}`)}`,
      email: `mailto:?subject=${encodeURIComponent(title)}&body=${encodeURIComponent(`${text}\n\n${url}`)}`
    }
    
    if (platform === 'native' && navigator.share) {
      // Native share dialog (mobile devices)
      navigator.share({
        title,
        text,
        url
      })
    } else if (shareUrls[platform as keyof typeof shareUrls]) {
      // Open social media sharing URL
      window.open(
        shareUrls[platform as keyof typeof shareUrls], 
        '_blank', 
        'noopener,noreferrer,width=600,height=400'
      )
    }
  }

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy:', err)
      // Fallback for older browsers
      const textArea = document.createElement('textarea')
      textArea.value = window.location.href
      document.body.appendChild(textArea)
      textArea.select()
      document.execCommand('copy')
      document.body.removeChild(textArea)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white">
        <div className="container mx-auto px-4 py-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-32 mb-8"></div>
            <div className="h-96 bg-gray-200 rounded-2xl mb-8"></div>
            <div className="max-w-3xl mx-auto">
              <div className="h-10 bg-gray-200 rounded w-3/4 mb-4"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2 mb-8"></div>
              <div className="space-y-4">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="h-4 bg-gray-200 rounded"></div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="bg-white rounded-2xl shadow-lg p-8 max-w-md text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <BookOpen className="h-8 w-8 text-red-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Error loading article</h2>
          <p className="text-gray-600 mb-6">{(error as Error).message}</p>
          <Link 
            to="/" 
            className="inline-flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:opacity-90 transition-opacity"
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
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="bg-white rounded-2xl shadow-lg p-8 max-w-md text-center">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <BookOpen className="h-8 w-8 text-gray-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Article not found</h2>
          <p className="text-gray-600 mb-6">The article you're looking for doesn't exist.</p>
          <Link 
            to="/" 
            className="inline-flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:opacity-90 transition-opacity"
          >
            <ArrowLeft className="h-5 w-5" />
            <span>Browse All Articles</span>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <div className="container mx-auto px-4 py-6">
        <button
          onClick={() => navigate('/')}
          className="inline-flex items-center space-x-2 text-gray-600 hover:text-blue-600 font-medium"
        >
          <ArrowLeft className="h-5 w-5" />
          <span>Back to Articles</span>
        </button>
      </div>

      {/* Hero Section */}
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-b from-blue-50 to-transparent h-64"></div>
        <div className="container mx-auto px-4 relative">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-8">
              <span className="px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white text-sm font-semibold rounded-full inline-block mb-4">
                {blog.category[0]}
              </span>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight">
                {blog.title}
              </h1>
              
              <div className="flex flex-wrap items-center justify-center gap-6 text-gray-600 mb-8">
                <div className="flex items-center">
                  <User className="h-5 w-5 mr-2" />
                  <span className="font-medium">CA Monk Author</span>
                </div>
                <div className="flex items-center">
                  <Calendar className="h-5 w-5 mr-2" />
                  <span className="font-medium">{formatDate(blog.date)}</span>
                </div>
                <div className="flex items-center">
                  <Clock className="h-5 w-5 mr-2" />
                  <span className="font-medium">5 min read</span>
                </div>
              </div>
            </div>

            {/* Cover Image */}
            <div className="rounded-2xl overflow-hidden mb-12 shadow-xl">
              <img 
                src={blog.coverImage} 
                alt={blog.title}
                className="w-full h-[500px] object-cover"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Article Content */}
      <div className="container mx-auto px-4 pb-20">
        <div className="max-w-3xl mx-auto">
          {/* Meta Info Table */}
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-6 mb-12 border border-blue-100">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <div className="text-sm text-gray-600 font-medium mb-2">CATEGORY</div>
                <div className="flex flex-wrap gap-2">
                  {blog.category.map((cat) => (
                    <span 
                      key={cat} 
                      className="px-3 py-1.5 bg-white text-blue-600 font-semibold rounded-lg text-sm"
                    >
                      {cat}
                    </span>
                  ))}
                </div>
              </div>
              <div>
                <div className="text-sm text-gray-600 font-medium mb-2">READ TIME</div>
                <div className="text-xl font-bold text-gray-900">5 Mins</div>
              </div>
              <div>
                <div className="text-sm text-gray-600 font-medium mb-2">DATE</div>
                <div className="text-xl font-bold text-gray-900">
                  {formatDate(blog.date).toUpperCase()}
                </div>
              </div>
            </div>
          </div>

          {/* Share Section */}
          <div className="mb-12">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-gray-900">Share Article</h3>
              <div className="text-sm text-gray-600">
                Share with colleagues and friends
              </div>
            </div>
            
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-3">
              {/* Native Share (Mobile) */}
              {navigator.share && (
                <button 
                  onClick={() => shareArticle('native')}
                  className="flex flex-col items-center justify-center p-4 bg-gradient-to-br from-blue-500 to-purple-600 text-white rounded-xl hover:opacity-90 transition-opacity"
                  title="Share using device"
                >
                  <Share2 className="h-6 w-6 mb-2" />
                  <span className="text-sm font-medium">Share</span>
                </button>
              )}
              
              {/* Twitter */}
              <button 
                onClick={() => shareArticle('twitter')}
                className="flex flex-col items-center justify-center p-4 bg-[#1DA1F2] text-white rounded-xl hover:opacity-90 transition-opacity"
                title="Share on Twitter"
              >
                <Twitter className="h-6 w-6 mb-2" />
                <span className="text-sm font-medium">Twitter</span>
              </button>
              
              {/* WhatsApp */}
              <button 
                onClick={() => shareArticle('whatsapp')}
                className="flex flex-col items-center justify-center p-4 bg-[#25D366] text-white rounded-xl hover:opacity-90 transition-opacity"
                title="Share on WhatsApp"
              >
                <MessageCircle className="h-6 w-6 mb-2" />
                <span className="text-sm font-medium">WhatsApp</span>
              </button>
              
              {/* LinkedIn */}
              <button 
                onClick={() => shareArticle('linkedin')}
                className="flex flex-col items-center justify-center p-4 bg-[#0077B5] text-white rounded-xl hover:opacity-90 transition-opacity"
                title="Share on LinkedIn"
              >
                <Linkedin className="h-6 w-6 mb-2" />
                <span className="text-sm font-medium">LinkedIn</span>
              </button>
              
              {/* Facebook */}
              <button 
                onClick={() => shareArticle('facebook')}
                className="flex flex-col items-center justify-center p-4 bg-[#1877F2] text-white rounded-xl hover:opacity-90 transition-opacity"
                title="Share on Facebook"
              >
                <Facebook className="h-6 w-6 mb-2" />
                <span className="text-sm font-medium">Facebook</span>
              </button>
              
              {/* Copy Link */}
              <button 
                onClick={copyToClipboard}
                className="flex flex-col items-center justify-center p-4 bg-gray-700 text-white rounded-xl hover:opacity-90 transition-opacity relative"
                title="Copy link to clipboard"
              >
                {copied ? (
                  <Check className="h-6 w-6 mb-2" />
                ) : (
                  <LinkIcon className="h-6 w-6 mb-2" />
                )}
                <span className="text-sm font-medium">
                  {copied ? 'Copied!' : 'Copy Link'}
                </span>
              </button>
              
              {/* Email */}
              <button 
                onClick={() => shareArticle('email')}
                className="flex flex-col items-center justify-center p-4 bg-red-600 text-white rounded-xl hover:opacity-90 transition-opacity"
                title="Share via Email"
              >
                <Mail className="h-6 w-6 mb-2" />
                <span className="text-sm font-medium">Email</span>
              </button>
            </div>
            
            {/* Copy Link Input */}
            <div className="mt-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Or copy this link:
              </label>
              <div className="flex">
                <input
                  type="text"
                  readOnly
                  value={window.location.href}
                  className="flex-1 px-4 py-3 border border-gray-300 rounded-l-lg bg-gray-50 text-gray-700 focus:outline-none"
                />
                <button
                  onClick={copyToClipboard}
                  className="flex items-center space-x-2 px-4 py-3 bg-blue-600 text-white rounded-r-lg hover:bg-blue-700 font-medium"
                >
                  {copied ? (
                    <>
                      <Check className="h-4 w-4" />
                      <span>Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="h-4 w-4" />
                      <span>Copy</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Article Description */}
          <div className="prose prose-lg max-w-none mb-12">
            <div className="text-2xl text-gray-700 leading-relaxed mb-8 border-l-4 border-blue-500 pl-6 italic">
              {blog.description}
            </div>

            {/* Main Content */}
            <div className="space-y-6">
              {blog.content.split('\n\n').map((paragraph, index) => (
                <div key={index}>
                  {index === 0 && (
                    <h2 className="text-3xl font-bold text-gray-900 mb-6">{blog.title}</h2>
                  )}
                  <p className="text-lg text-gray-700 leading-relaxed">
                    {paragraph}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Tags */}
          <div className="mt-12 pt-8 border-t border-gray-200">
            <div className="flex items-center mb-4">
              <Tag className="h-5 w-5 text-gray-400 mr-2" />
              <span className="font-semibold text-gray-900">Tags</span>
            </div>
            <div className="flex flex-wrap gap-3">
              {blog.category.map((cat) => (
                <button
                  key={cat}
                  onClick={() => navigate(`/?search=${cat.toLowerCase()}`)}
                  className="px-4 py-2 bg-gray-100 text-gray-700 font-medium rounded-lg hover:bg-blue-100 hover:text-blue-700 transition-colors cursor-pointer"
                >
                  #{cat.toLowerCase()}
                </button>
              ))}
            </div>
          </div>

          {/* Author Bio */}
          <div className="mt-12 bg-gradient-to-br from-gray-50 to-white rounded-2xl p-8 border border-gray-200">
            <div className="flex items-start space-x-4">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                <User className="h-8 w-8 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-bold text-gray-900 mb-2">About the Author</h3>
                <p className="text-gray-600 mb-4">
                  Expert financial analyst with 10+ years of experience in fintech and accounting.
                  Passionate about simplifying complex financial concepts for professionals.
                </p>
                <div className="flex items-center space-x-4">
                  <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium">
                    Follow
                  </button>
                  <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium">
                    View Profile
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* CTA */}
          <div className="mt-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-white text-center">
            <h3 className="text-2xl font-bold mb-4">Ready to share your expertise?</h3>
            <p className="text-blue-100 mb-6">Join our community of finance professionals</p>
            <Link 
              to="/create" 
              className="inline-flex items-center space-x-2 px-8 py-3 bg-white text-blue-600 font-bold rounded-lg hover:bg-gray-100 transition-colors shadow-lg"
            >
              <BookOpen className="h-5 w-5" />
              <span>Write an Article</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default BlogDetail
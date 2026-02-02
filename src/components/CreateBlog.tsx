import React, { useState } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, Upload, Image as ImageIcon, Tag } from 'lucide-react'

interface BlogForm {
  title: string
  category: string[]
  description: string
  coverImage: string
  content: string
}

const CATEGORIES = ['FINANCE', 'CAREER', 'REGULATIONS', 'SKILLS', 'TECHNOLOGY', 'INVESTING', 'TAXATION', 'AUDIT']

const CreateBlog: React.FC = () => {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  
  const [formData, setFormData] = useState<BlogForm>({
    title: '',
    category: [],
    description: '',
    coverImage: '',
    content: '',
  })

  const mutation = useMutation({
    mutationFn: async (blogData: Omit<BlogForm, 'id'>) => {
      const response = await fetch('http://localhost:3001/blogs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...blogData,
          date: new Date().toISOString(),
        }),
      })
      if (!response.ok) throw new Error('Failed to create blog')
      return response.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['blogs'] })
      navigate('/')
    },
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    mutation.mutate(formData)
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleCategoryToggle = (category: string) => {
    setFormData(prev => ({
      ...prev,
      category: prev.category.includes(category)
        ? prev.category.filter(c => c !== category)
        : [...prev.category, category]
    }))
  }

  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-8">
        <button
          onClick={() => navigate('/')}
          className="inline-flex items-center space-x-2 text-blue-600 hover:text-blue-700 font-medium mb-6"
        >
          <ArrowLeft className="h-5 w-5" />
          <span>Back to Articles</span>
        </button>
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-3">Write a New Article</h1>
          <p className="text-gray-600">Share your expertise with the finance community</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
          <div className="mb-8">
            <label className="block text-sm font-semibold text-gray-700 mb-3 uppercase tracking-wider">
              Article Title
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              className="w-full px-4 py-3 text-lg border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
              placeholder="Enter a compelling title for your article"
              required
            />
          </div>

          <div className="mb-8">
            <label className="block text-sm font-semibold text-gray-700 mb-3 uppercase tracking-wider">
              Short Description
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              rows={3}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
              placeholder="Write a brief summary that captures the essence of your article"
              required
            />
          </div>

          <div className="mb-8">
            <label className="block text-sm font-semibold text-gray-700 mb-3 uppercase tracking-wider">
              Cover Image
            </label>
            <div className="flex items-center space-x-4">
              <div className="flex-1">
                <input
                  type="url"
                  name="coverImage"
                  value={formData.coverImage}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                  placeholder="https://example.com/cover-image.jpg"
                  required
                />
                <p className="text-sm text-gray-500 mt-2">Enter a URL for your article's cover image</p>
              </div>
              <div className="p-4 border border-gray-300 rounded-lg">
                <ImageIcon className="h-6 w-6 text-gray-400" />
              </div>
            </div>
            
            {formData.coverImage && (
              <div className="mt-6">
                <p className="text-sm font-medium text-gray-700 mb-2">Preview:</p>
                <div className="relative h-48 w-full rounded-lg overflow-hidden border border-gray-300">
                  <img 
                    src={formData.coverImage} 
                    alt="Cover preview" 
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = 'none'
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                </div>
              </div>
            )}
          </div>

          <div className="mb-8">
            <div className="flex items-center space-x-2 mb-4">
              <Tag className="h-5 w-5 text-gray-400" />
              <label className="block text-sm font-semibold text-gray-700 uppercase tracking-wider">
                Categories
              </label>
            </div>
            
            <div className="mb-6">
              <p className="text-sm text-gray-600 mb-3">Select relevant categories:</p>
              <div className="flex flex-wrap gap-3">
                {formData.category.map((cat) => (
                  <span 
                    key={cat} 
                    className="inline-flex items-center px-4 py-2 bg-blue-100 text-blue-700 font-medium rounded-full"
                  >
                    {cat}
                  </span>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {CATEGORIES.map((cat) => (
                <button
                  type="button"
                  key={cat}
                  onClick={() => handleCategoryToggle(cat)}
                  className={`px-4 py-3 rounded-lg border transition-all duration-200 flex items-center justify-center ${
                    formData.category.includes(cat)
                      ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                      : 'bg-gray-50 text-gray-700 border-gray-300 hover:bg-gray-100 hover:border-gray-400'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-3 uppercase tracking-wider">
              Article Content
            </label>
            <textarea
              name="content"
              value={formData.content}
              onChange={handleInputChange}
              rows={12}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition font-serif"
              placeholder="Write your article content here. You can use paragraphs, bullet points, and sections to organize your thoughts..."
              required
            />
          </div>
        </div>

        <div className="flex items-center justify-between">
          <button
            type="button"
            onClick={() => navigate('/')}
            className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
          >
            Cancel
          </button>
          
          <div className="flex items-center space-x-4">
            <button
              type="button"
              onClick={() => {
                // Save as draft functionality
                alert('Draft saved!')
              }}
              className="px-6 py-3 border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 transition-colors font-medium"
            >
              Save Draft
            </button>
            
            <button
              type="submit"
              disabled={mutation.isPending}
              className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium flex items-center space-x-2 shadow-sm hover:shadow"
            >
              {mutation.isPending ? (
                <>
                  <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Publishing...</span>
                </>
              ) : (
                <>
                  <Upload className="h-5 w-5" />
                  <span>Publish Article</span>
                </>
              )}
            </button>
          </div>
        </div>

        {mutation.isError && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-red-600 font-medium">Error: {(mutation.error as Error).message}</p>
          </div>
        )}

        {mutation.isSuccess && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <p className="text-green-600 font-medium">Article published successfully! Redirecting...</p>
          </div>
        )}
      </form>
    </div>
  )
}

export default CreateBlog

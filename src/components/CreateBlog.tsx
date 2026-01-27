import React, { useState } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, Plus, X } from 'lucide-react'

interface BlogForm {
  title: string
  category: string[]
  description: string
  coverImage: string
  content: string
}

const CATEGORIES = ['FINANCE', 'TECH', 'BUSINESS', 'INVESTING', 'CRYPTO', 'AI', 'STARTUP']

const CreateBlog: React.FC = () => {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const [newCategory, setNewCategory] = useState('')
  
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

  const handleAddCustomCategory = () => {
    if (newCategory.trim() && !formData.category.includes(newCategory.trim().toUpperCase())) {
      setFormData(prev => ({
        ...prev,
        category: [...prev.category, newCategory.trim().toUpperCase()]
      }))
      setNewCategory('')
    }
  }

  const removeCategory = (category: string) => {
    setFormData(prev => ({
      ...prev,
      category: prev.category.filter(c => c !== category)
    }))
  }

  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-8">
        <button
          onClick={() => navigate('/')}
          className="inline-flex items-center space-x-2 text-blue-600 hover:text-blue-700 mb-6"
        >
          <ArrowLeft className="h-5 w-5" />
          <span>Back to Blogs</span>
        </button>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Create New Blog Post</h1>
        <p className="text-gray-600">Share your insights with the community</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
          {/* Title */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Blog Title
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
              placeholder="Enter blog title"
              required
            />
          </div>

          {/* Description */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Short Description
            </label>
            <input
              type="text"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
              placeholder="Brief summary of your blog"
              required
            />
          </div>

          {/* Cover Image URL */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Cover Image URL
            </label>
            <input
              type="url"
              name="coverImage"
              value={formData.coverImage}
              onChange={handleInputChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
              placeholder="https://example.com/image.jpg"
              required
            />
            {formData.coverImage && (
              <div className="mt-4">
                <p className="text-sm text-gray-600 mb-2">Preview:</p>
                <img 
                  src={formData.coverImage} 
                  alt="Cover preview" 
                  className="w-full h-48 object-cover rounded-lg border"
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = 'none'
                  }}
                />
              </div>
            )}
          </div>

          {/* Categories */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Categories
            </label>
            
            <div className="flex flex-wrap gap-2 mb-4">
              {formData.category.map((cat) => (
                <span 
                  key={cat} 
                  className="inline-flex items-center px-4 py-2 bg-blue-100 text-blue-700 rounded-full"
                >
                  {cat}
                  <button
                    type="button"
                    onClick={() => removeCategory(cat)}
                    className="ml-2 hover:text-blue-900"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </span>
              ))}
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
              {CATEGORIES.map((cat) => (
                <button
                  type="button"
                  key={cat}
                  onClick={() => handleCategoryToggle(cat)}
                  className={`px-4 py-2 rounded-lg border transition-colors ${
                    formData.category.includes(cat)
                      ? 'bg-blue-600 text-white border-blue-600'
                      : 'bg-gray-50 text-gray-700 border-gray-300 hover:bg-gray-100'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            <div className="flex space-x-2">
              <input
                type="text"
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
                placeholder="Add custom category"
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddCustomCategory())}
              />
              <button
                type="button"
                onClick={handleAddCustomCategory}
                className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors flex items-center space-x-2"
              >
                <Plus className="h-4 w-4" />
                <span>Add</span>
              </button>
            </div>
          </div>

          {/* Content */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Blog Content
            </label>
            <textarea
              name="content"
              value={formData.content}
              onChange={handleInputChange}
              rows={10}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
              placeholder="Write your blog content here..."
              required
            />
          </div>
        </div>

        {/* Form Actions */}
        <div className="flex justify-end space-x-4">
          <button
            type="button"
            onClick={() => navigate('/')}
            className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={mutation.isPending}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
          >
            {mutation.isPending ? (
              <>
                <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>Creating...</span>
              </>
            ) : (
              <span>Publish Blog</span>
            )}
          </button>
        </div>

        {mutation.isError && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-red-600">Error: {(mutation.error as Error).message}</p>
          </div>
        )}
      </form>
    </div>
  )
}

export default CreateBlog
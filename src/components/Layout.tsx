import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { BookOpen, PenSquare, Home, Search, User } from 'lucide-react'

interface LayoutProps {
  children: React.ReactNode
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const location = useLocation()

  return (
    <div className="min-h-screen bg-white">
      //top nav
      <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur-sm border-b border-gray-100">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-8">
              <Link to="/" className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                  <BookOpen className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    Pentink Blog
                  </h1>
                  <p className="text-xs text-gray-500">Share highly valued insights</p>
                </div>
              </Link>
              
              <div className="hidden md:flex items-center space-x-1">
                <Link 
                  to="/" 
                  className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                    location.pathname === '/' 
                      ? 'bg-blue-50 text-blue-600' 
                      : 'text-gray-600 hover:text-blue-600 hover:bg-gray-50'
                  }`}
                >
                  <Home className="h-4 w-4 inline mr-2" />
                  Home
                </Link>
                <Link 
                  to="/create" 
                  className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                    location.pathname === '/create' 
                      ? 'bg-blue-50 text-blue-600' 
                      : 'text-gray-600 hover:text-blue-600 hover:bg-gray-50'
                  }`}
                >
                  <PenSquare className="h-4 w-4 inline mr-2" />
                  Write
                </Link>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <div className="relative hidden md:block">
                <input
                  type="text"
                  placeholder="Search articles..."
                  className="pl-10 pr-4 py-2 w-64 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                />
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
              </div>
              
              <button className="p-2 text-gray-600 hover:text-blue-600">
                <User className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="min-h-screen">
        {children}
      </main>

      //foter
      <footer className="mt-20 border-t border-gray-100 bg-gray-50">
        <div className="container mx-auto px-4 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                  <BookOpen className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-gray-900">Pentink Blog</h2>
                  <p className="text-sm text-gray-600">Professional Insights</p>
                </div>
              </div>
              <p className="text-gray-600 text-sm">
                Stay updated with the latest trends in finance, accounting, and career growth.
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-gray-900 mb-4">Categories</h3>
              <ul className="space-y-2">
                {['Finance', 'Career', 'Regulations', 'Skills', 'Technology'].map((cat) => (
                  <li key={cat}>
                    <a href="#" className="text-gray-600 hover:text-blue-600 text-sm">{cat}</a>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="font-semibold text-gray-900 mb-4">Resources</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-600 hover:text-blue-600 text-sm">Study Tips</a></li>
                <li><a href="#" className="text-gray-600 hover:text-blue-600 text-sm">Career Guides</a></li>
                <li><a href="#" className="text-gray-600 hover:text-blue-600 text-sm">Industry News</a></li>
                <li><a href="#" className="text-gray-600 hover:text-blue-600 text-sm">Expert Interviews</a></li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold text-gray-900 mb-4">Subscribe</h3>
              <p className="text-gray-600 text-sm mb-4">Get the latest articles delivered to your inbox.</p>
              <div className="flex">
                <input
                  type="email"
                  placeholder="Your email"
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-l-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                />
                <button className="px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-r-lg hover:opacity-90 transition-opacity">
                  Subscribe
                </button>
              </div>
            </div>
          </div>

          <div className="mt-8 pt-8 border-t border-gray-200 text-center text-gray-600 text-sm">
            <p>© 2025 Pentink Blog. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default Layout

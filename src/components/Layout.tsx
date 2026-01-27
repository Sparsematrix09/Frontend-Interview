import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { BookOpen, PenSquare, Home } from 'lucide-react'

interface LayoutProps {
  children: React.ReactNode
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const location = useLocation()
  const isHomePage = location.pathname === '/'

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center space-x-3">
              <div className="p-2 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg">
                <BookOpen className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">CA Monk Blog</h1>
                <p className="text-xs text-gray-600">Finance • Accounting • Career</p>
              </div>
            </Link>
            
            <div className="flex items-center space-x-4">
              {!isHomePage && (
                <Link 
                  to="/" 
                  className="flex items-center space-x-2 px-4 py-2 text-gray-700 hover:text-blue-600 transition-colors"
                >
                  <Home className="h-5 w-5" />
                  <span>Home</span>
                </Link>
              )}
              <Link 
                to="/create" 
                className="flex items-center space-x-2 px-5 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:opacity-90 transition-opacity font-medium shadow-sm"
              >
                <PenSquare className="h-5 w-5" />
                <span>Write Article</span>
              </Link>
            </div>
          </div>
        </div>
      </nav>
      
      <main>
        {children}
      </main>
      
      <footer className="mt-16 border-t border-gray-200 bg-white">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-6 md:mb-0">
              <div className="flex items-center space-x-3 mb-3">
                <BookOpen className="h-6 w-6 text-blue-600" />
                <span className="text-lg font-bold text-gray-900">CA Monk Blog</span>
              </div>
              <p className="text-gray-600 text-sm max-w-md">
                Stay updated with the latest trends in finance, accounting, and career growth. 
                Expert insights for finance professionals.
              </p>
            </div>
            <div className="text-gray-600 text-sm">
              <p>© 2024 CA Monk Blog. All rights reserved.</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default Layout
import React from 'react'
import { Link } from 'react-router-dom'
import { Home, Plus, BookOpen } from 'lucide-react'

interface LayoutProps {
  children: React.ReactNode
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <nav className="bg-white shadow-lg border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center space-x-2">
              <BookOpen className="h-8 w-8 text-blue-600" />
              <span className="text-2xl font-bold text-gray-800">CA Monk Blog</span>
            </Link>
            
            <div className="flex items-center space-x-4">
              <Link 
                to="/" 
                className="flex items-center space-x-2 px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <Home className="h-5 w-5" />
                <span>All Blogs</span>
              </Link>
              <Link 
                to="/create" 
                className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Plus className="h-5 w-5" />
                <span>New Blog</span>
              </Link>
            </div>
          </div>
        </div>
      </nav>
      
      <main className="container mx-auto px-4 py-8">
        {children}
      </main>
      
      <footer className="bg-white border-t mt-12">
        <div className="container mx-auto px-4 py-6 text-center text-gray-600">
          <p>© 2024 CA Monk Blog Application. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}

export default Layout
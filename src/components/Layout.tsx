import React, { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { BookOpen, PenSquare, Home, Search, User, Menu, X,Globe,TrendingUp,ExternalLink
} from 'lucide-react'

interface LayoutProps {
  children: React.ReactNode
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const location = useLocation()
  const navigate = useNavigate()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      navigate(`/?search=${encodeURIComponent(searchQuery.trim())}`)
      setSearchOpen(false)
      setSearchQuery('')
    }
  }

  const navItems = [
    { path: '/', label: 'Home', icon: Home },
    { path: '/create', label: 'Write', icon: PenSquare },
  ]

  return (
    <div className="min-h-screen bg-white">
      {/*Nav*/}
      <nav className="sticky top-0 z-50 glass-effect border-b border-white/20 shadow-sm">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <Link to="/" className="flex items-center space-x-3 group">
              <div className="w-10 h-10 bg-gradient-to-br from-candy-pink to-green-yellow rounded-xl flex items-center justify-center group-hover:scale-105 transition-transform shadow-md">
                <BookOpen className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-candy-pink to-green-yellow bg-clip-text text-transparent font-serif">
                  Pentink
                </h1>
                <p className="text-xs text-gray-500">Finance, Tech & Business</p>
              </div>
            </Link>

            <div className="hidden md:flex items-center space-x-8">
              <div className="flex items-center space-x-1">
                {navItems.map((item) => {
                  const Icon = item.icon
                  const isActive = location.pathname === item.path
                  return (
                    <Link
                      key={item.path}
                      to={item.path}
                      className={`group flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-300 ${
                        isActive
                          ? 'bg-gradient-to-r from-candy-pink/10 to-green-yellow/10 text-candy-pink'
                          : 'text-gray-600 hover:text-candy-pink hover:bg-gray-50'
                      }`}
                    >
                      <Icon className={`h-4 w-4 ${
                        isActive ? 'text-candy-pink' : 'text-gray-400 group-hover:text-candy-pink'
                      }`} />
                      <span className="font-medium">{item.label}</span>
                    </Link>
                  )
                })}
              </div>

              {/*Desktop Search */}
              <form onSubmit={handleSearch} className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search articles..."
                  className="pl-10 pr-4 py-2 w-64 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-candy-pink focus:border-candy-pink"
                />
              </form>

              <button className="p-2 text-gray-600 hover:text-candy-pink transition-colors">
                <div className="w-8 h-8 bg-gradient-to-br from-candy-pink/20 to-green-yellow/20 rounded-full flex items-center justify-center">
                  <User className="h-4 w-4" />
                </div>
              </button>
            </div>
{/*done for mobile too*/}
            <div className="flex items-center space-x-4 md:hidden">
              <button 
                onClick={() => setSearchOpen(!searchOpen)}
                className="p-2 text-gray-600 hover:text-candy-pink"
              >
                <Search className="h-5 w-5" />
              </button>
              <button 
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 text-gray-600 hover:text-candy-pink"
              >
                {mobileMenuOpen ? (
                  <X className="h-5 w-5" />
                ) : (
                  <Menu className="h-5 w-5" />
                )}
              </button>
            </div>
          </div>

     {searchOpen && (
            <div className="md:hidden py-3 border-t border-gray-100">
              <form onSubmit={handleSearch} className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search articles..."
                  className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-candy-pink focus:border-candy-pink"
                />
              </form>
        </div>
          )}
        </div>
      </nav>

      {mobileMenuOpen && (
        <div className="md:hidden fixed inset-0 z-40 pt-16 bg-white/95 backdrop-blur-sm">
          <div className="container mx-auto px-4 py-6">
            <div className="space-y-4">
              {navItems.map((item) => {
                const Icon = item.icon
                const isActive = location.pathname === item.path
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-all ${
                      isActive
                        ? 'bg-gradient-to-r from-candy-pink to-green-yellow text-white'
                        : 'text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    <Icon className="h-5 w-5" />
                    <span className="font-medium">{item.label}</span>
                  </Link>
                )
              })}
                            <div className="pt-8 border-t border-gray-200">
                <button className="flex items-center space-x-3 px-4 py-3 text-gray-700 hover:bg-gray-50 rounded-lg w-full">
                  <div className="w-10 h-10 bg-gradient-to-br from-candy-pink/20 to-green-yellow/20 rounded-full flex items-center justify-center">
                    <User className="h-5 w-5 text-candy-pink" />
                  </div>
                  <div className="text-left">
                    <div className="font-medium">Your Account</div>
                    <div className="text-sm text-gray-500">View profile & settings</div>
                  </div>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <main className="min-h-screen">
        {children}
      </main>

      {/*footer*/}
      <footer className="mt-20 border-t border-gray-100 bg-gradient-to-br from-gray-50 via-white to-gray-50">
        <div className="container mx-auto px-4 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-candy-pink to-green-yellow rounded-xl flex items-center justify-center">
                  <BookOpen className="h-7 w-7 text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-900 font-serif">Professional Insights</h2>
                  <p className="text-sm text-gray-600">Expert perspectives since 2024</p>
                </div>
              </div>
              <p className="text-gray-600 text-sm">
                Stay updated with the latest trends in finance, technology, and business. 
                Expert analysis and insights for professionals.
              </p>
              
              <div className="flex items-center space-x-4 mt-6">
                {[
                  { icon: Globe, label: 'Website' },
                  { icon: TrendingUp, label: 'LinkedIn' }
                ].map((social) => (
                  <button
                    key={social.label}
                    className="p-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gradient-to-r hover:from-candy-pink hover:to-green-yellow hover:text-white transition-all duration-300"
                    title={social.label}
                  >
                    <social.icon className="h-4 w-4" />
                  </button>
                ))}
              </div>
            </div>

            <div>
              <h3 className="font-bold text-gray-900 mb-6 font-serif">Quick Links</h3>
              <ul className="space-y-3">
                {['Home', 'Articles', 'Write', 'Categories'].map((item) => (
                  <li key={item}>
                    <Link 
                      to={item === 'Home' ? '/' : `/${item.toLowerCase()}`}
                      className="text-gray-600 hover:text-candy-pink transition-colors text-sm flex items-center space-x-2"
                    >
                      <ExternalLink className="h-3 w-3" />
                      <span>{item}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/*Cat*/}
            <div>
              <h3 className="font-bold text-gray-900 mb-6 font-serif">Categories</h3>
              <div className="flex flex-wrap gap-2">
                {['Tech', 'Finance', 'Business', 'AI', 'Blockchain', 'Development'].map((cat) => (
                  <button
                    key={cat}
                    onClick={() => navigate(`/?category=${cat}`)}
                    className="px-3 py-1.5 bg-gray-100 text-gray-700 text-sm rounded-lg hover:bg-gradient-to-r hover:from-candy-pink hover:to-green-yellow hover:text-white transition-all duration-300"
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <h3 className="font-bold text-gray-900 mb-6 font-serif">Stay Updated</h3>
              <p className="text-gray-600 text-sm mb-4">
                Get the latest articles delivered to your inbox.
              </p>
              <div className="space-y-4">
                <input
                  type="email"
                  placeholder="Your email address"
                  className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-candy-pink focus:border-candy-pink"
                />
                <button className="w-full px-4 py-2.5 bg-gradient-to-r from-candy-pink to-green-yellow text-white rounded-lg hover:opacity-90 transition-opacity font-medium">
                  Subscribe
                </button>
              </div>
            </div>
          </div>

          <div className="divider-gradient w-full h-0.5 rounded-full my-8"></div>

          {/*not necesary but still Copyright*/}
          <div className="flex flex-col md:flex-row md:items-center justify-between text-center md:text-left">
            <div className="text-gray-600 text-sm mb-4 md:mb-0">
              <p>© 2025 Pentink. All rights reserved.</p>
            </div>
            <div className="flex items-center justify-center space-x-6 text-sm text-gray-600">
              <Link to="/privacy" className="hover:text-candy-pink transition-colors">
                Privacy Policy
              </Link>
              <Link to="/terms" className="hover:text-candy-pink transition-colors">
                Terms of Service
              </Link>
              <Link to="/contact" className="hover:text-candy-pink transition-colors">
                Contact
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default Layout
import React, { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router'
import { useAuth } from '../context/AuthContext'

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false)
  const { signInWithGithub, signOut, user } = useAuth()

  const displayName = user?.user_metadata.user_name || user?.email

  const menuRef = useRef<HTMLDivElement | null>(null);

  const handleClickOutside = (event: MouseEvent) => {
    if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
      setMenuOpen(false);
    }
  };

  useEffect(() => {
    if (menuOpen) {
      document.addEventListener('click', handleClickOutside);
    } else {
      document.removeEventListener('click', handleClickOutside);
    }

    // Cleanup
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [menuOpen]);

  return (
    <nav className='fixed top-0 w-full z-40 bg-[rgba(10,10,10,0.8)] backdrop-blur-lg border-b border-white/10 shadow-lg'>
      <div className='max-w-5xl mx-auto px-4'>
        <div className='flex justify-between items-center h-16'>
          <Link to={"/"} className='font-mono text-xl font-bold text-white'>
            social<span className='text-purple-500'>.media</span>
          </Link>

          {/* Desktop links */}
          <div className='hidden md:flex items-center space-x-8'>
            <Link
              to={"/"}
              className='text-gray-300 hover:text-white transition-colors'
            > Home </Link>
            <Link
              to={"/create"}
              className='text-gray-300 hover:text-white transition-colors'
            > Create Post </Link>
            <Link
              to={"/communities"}
              className='text-gray-300 hover:text-white transition-colors'
            > Communities </Link>
            <Link
              to={"/community/create"}
              className='text-gray-300 hover:text-white transition-colors'
            > Create Community </Link>
          </div>

          {/* Destop Auth */}
          <div className='hidden md:flex items-center'>
            {
              user ? (
                <div className='flex items-center space-x-4'>
                  {
                    user.user_metadata.avatar_url && (
                      <img src={user.user_metadata.avatar_url} alt='profile' className='w-8 h-8 rounded-full object-cover' />
                    )
                  }
                  <span className='text-gray-300'>{displayName}</span>
                  <button onClick={signOut} className='bg-red-500 px-3 py-1 rounded'>
                    Sign out
                  </button>
                </div>
              ) : (
                <button onClick={signInWithGithub} className='bg-blue-500 px-3 py-1 rounded'>
                  Sign in with Github
                </button>
              )
            }
          </div>

          {/* Mobile menu button */}
          <div className='md:hidden'>
            {" "}
            <button onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
              e.stopPropagation()
              setMenuOpen((prev) => !prev)
            }}>
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                {menuOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </button>
          </div>

          {/* Mobile links */}
          {
            menuOpen && (
              <div className='md:hidden bg-[rgba(10,10,10,0.9)]' ref={menuRef}>
                <div className='px-2 pt-2 pb-3 space-y-1 mt-60'>
                  <Link
                    to={"/"}
                    className='block px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:text-white hover:bg-gray-700'
                  > Home </Link>
                  <Link
                    to={"/create"}
                    className='block px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:text-white hover:bg-gray-700'
                  > Create Post </Link>
                  <Link
                    to={"/communities"}
                    className='block px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:text-white hover:bg-gray-700'
                  > Communities </Link>
                  <Link
                    to={"/community/create"}
                    className='block px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:text-white hover:bg-gray-700'
                  > Create Community </Link>

                  {
                    user ? (
                      <div>
                        <div className='flex items-center space-x-4'>
                          {
                            user.user_metadata.avatar_url && (
                              <img src={user.user_metadata.avatar_url} alt='profile' className='w-8 h-8 rounded-full object-cover' />
                            )
                          }
                          <span className='text-gray-300'>{displayName}</span>
                        </div>

                        <div>
                          <button onClick={signOut} className='bg-red-500 px-3 py-1 rounded mt-3'>
                            Sign out
                          </button>
                        </div>

                      </div>
                    ) : (
                      <button onClick={signInWithGithub} className='bg-blue-500 px-3 py-1 rounded'>
                        Sign in with Github
                      </button>
                    )
                  }
                </div>
              </div>
            )
          }
        </div>
      </div>
    </nav>
  )
}

export default Navbar
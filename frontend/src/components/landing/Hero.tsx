import { useNavigate } from 'react-router-dom';

export const Hero = () => {
  const navigate = useNavigate();

  return (
    <section className="relative overflow-hidden py-20 sm:py-32">
      {/* Background decoration */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-200 dark:bg-emerald-900/20 rounded-full blur-3xl opacity-20"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-amber-200 dark:bg-amber-900/20 rounded-full blur-3xl opacity-20"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left content */}
          <div className="space-y-8">
            <div className="inline-flex items-center space-x-2 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 px-4 py-2 rounded-full text-sm font-medium">
              <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
              <span>Smart Warehouse Management</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight">
              <span className="text-slate-900 dark:text-white">Streamline Your</span>
              <br />
              <span className="bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 dark:from-emerald-400 dark:via-teal-400 dark:to-cyan-400 bg-clip-text text-transparent">
                Warehouse Operations
              </span>
            </h1>

            <p className="text-lg text-slate-600 dark:text-slate-300 max-w-xl">
              Manage inventory, track orders, coordinate suppliers, and optimize warehouse operations with our comprehensive management system.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={() => navigate('/login')}
                className="px-8 py-4 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-semibold rounded-xl transition-all duration-200 transform hover:scale-105 shadow-xl hover:shadow-emerald-500/50"
              >
                Get Started
              </button>
              <button className="px-8 py-4 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-semibold rounded-xl border-2 border-slate-200 dark:border-slate-700 hover:border-emerald-500 dark:hover:border-emerald-500 transition-all duration-200 transform hover:scale-105">
                Watch Demo
              </button>
            </div>

            {/* Trust badges */}
            <div className="flex items-center space-x-8 pt-8">
              <div className="flex items-center space-x-2">
                <svg className="w-5 h-5 text-amber-500" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
                <span className="text-slate-700 dark:text-slate-300 font-medium">4.9/5 Rating</span>
              </div>
              <div className="flex items-center space-x-2">
                <svg className="w-5 h-5 text-emerald-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span className="text-slate-700 dark:text-slate-300 font-medium">Trusted by 500+ Companies</span>
              </div>
            </div>
          </div>

          {/* Right content - Dashboard preview */}
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-emerald-400 to-teal-500 dark:from-emerald-600 dark:to-teal-700 rounded-2xl blur-2xl opacity-20 animate-pulse"></div>
            <div className="relative bg-white dark:bg-slate-800 rounded-2xl shadow-2xl p-6 border border-slate-200 dark:border-slate-700">
              {/* Mock dashboard */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="h-8 w-32 bg-gradient-to-r from-emerald-200 to-teal-200 dark:from-emerald-900/50 dark:to-teal-900/50 rounded"></div>
                  <div className="h-8 w-8 bg-amber-200 dark:bg-amber-900/50 rounded-full"></div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-gradient-to-br from-emerald-100 to-teal-100 dark:from-emerald-900/30 dark:to-teal-900/30 rounded-xl p-4 border border-emerald-200 dark:border-emerald-800">
                    <div className="h-4 w-20 bg-emerald-300 dark:bg-emerald-700 rounded mb-2"></div>
                    <div className="h-8 w-24 bg-emerald-400 dark:bg-emerald-600 rounded"></div>
                  </div>
                  <div className="bg-gradient-to-br from-amber-100 to-orange-100 dark:from-amber-900/30 dark:to-orange-900/30 rounded-xl p-4 border border-amber-200 dark:border-amber-800">
                    <div className="h-4 w-20 bg-amber-300 dark:bg-amber-700 rounded mb-2"></div>
                    <div className="h-8 w-24 bg-amber-400 dark:bg-amber-600 rounded"></div>
                  </div>
                </div>
                <div className="space-y-2">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="flex items-center space-x-3 bg-slate-50 dark:bg-slate-900/50 rounded-lg p-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-purple-400 to-pink-400 dark:from-purple-600 dark:to-pink-600 rounded-lg"></div>
                      <div className="flex-1 space-y-2">
                        <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded w-3/4"></div>
                        <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded w-1/2"></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

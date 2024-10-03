import { createBrowserRouter, createRoutesFromElements, Route, RouterProvider } from 'react-router-dom'
import Home from './pages/Home'
import Category from './pages/Category'
import Header from './components/nav/Header'

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<Header />}>
      <Route index element={<Home />} />
      <Route path="category" element={<Category />} />
    </Route>
  )
)

function App() {
  return (
    <>
      <div className="w-screen min-h-screen flex flex-col items-center justify-center bg-gray-100">
        <div className="w-full flex-grow mx-auto py-8">
          <RouterProvider router={router} />
        </div>
      </div>
    </>
  )
}

export default App

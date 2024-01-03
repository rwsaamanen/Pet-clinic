import React from 'react'
import ReactDOM from 'react-dom/client'
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom"

import Root from './routes/root/root.tsx'
import './index.css'
import Main from './routes/home-page/Main.tsx'
import Dashboard from './routes/dashboard/Dashboard.tsx'
import { ModalProvider } from './components/providers/modal-provider.tsx'

import Visits from './routes/dashboard/visits/Visits.tsx'
import Login from './routes/auth/login/Login.tsx'
import SignUp from './routes/auth/signup/SignUp.tsx'
import Auth from './routes/root/Auth.tsx'
import { AuthProvider } from './context/AuthContext.tsx'
import ProtectedRoute from './routes/ProtectedRoute.tsx'
import CreatePet from './routes/dashboard/pets/CreatePet.tsx'
import VisitDetails from './routes/dashboard/visits/VisitDetails.tsx'
import Pets from './routes/dashboard/pets/Pets.tsx'
import PetDetails from './routes/dashboard/pets/PetDetails.tsx'

const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
    children: [
      {
        path: "/",
        element: <Main />,
      },
    ]
  },
  {
    path: "/dashboard",
    element: <ProtectedRoute />,
    children: [
      { path: "", element: <Dashboard /> },
      { path: "pets", element: <Pets /> },
      { path: "pets/:petId", element: <PetDetails /> },
      { path: "pets/create-pet", element: <CreatePet /> },
      { path: "visits", element: <Visits /> },
      { path: "visits/:visitId", element: <VisitDetails /> },
    ],
  },
  {
    path: "/auth",
    element: <Auth />,
    children: [
      { path: "login", element: <Login /> },
      { path: "signup", element: <SignUp /> },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <AuthProvider>
    <ModalProvider />
    <RouterProvider router={router} />
    </AuthProvider>
  </React.StrictMode>,
)

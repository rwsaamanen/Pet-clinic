import React from 'react'
import ReactDOM from 'react-dom/client'
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom"

import Root from './routes/root/root.tsx'
import './index.css'
import Main from './routes/home-page/Main.tsx'
import DashboardLayout from './routes/root/DashboardLayout.tsx'
import Dashboard from './routes/dashboard/Dashboard.tsx'
import { ModalProvider } from './components/providers/modal-provider.tsx'
import Pets from './components/pets/Pets.tsx'
import Visits from './components/visits/Visits.tsx'
import Login from './routes/auth/login/Login.tsx'
import SignUp from './routes/auth/signup/SignUp.tsx'
import Auth from './routes/root/Auth.tsx'

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
    element: <DashboardLayout />,
    children: [
      { path: "", element: <Dashboard /> },
      { path: "pets", element: <Pets /> },
      { path: "visits", element: <Visits /> },
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
    <ModalProvider />
    <RouterProvider router={router} />
  </React.StrictMode>,
)

import { useState, FormEvent } from 'react';
import { Link, useNavigate } from "react-router-dom";
import AuthLayout from "../Layout";
import Input from "../Input";
import PasswordInput from "../PasswordInput";
import useAuthRedirect from '../../../hooks/use-auth-redirect';
import { saveUserDetails } from '../../../context/UserUtils';

const Login = () => {
  useAuthRedirect();
  const navigate = useNavigate();
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    // Construct the login data

    const loginData = { email, password };

    // Send HTTP request to your backend API
    
    try {
      const response = await fetch('http://localhost:5000/api/users/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(loginData),
      });

      const data = await response.json();
      console.log('User ID type:', typeof data.result.id);

      if (response.ok) {
        console.log('Login successful:', data);
        localStorage.setItem('token', data.token);
        saveUserDetails({ 
          email: data.result.email, 
          name: data.result.name, 
          id: data.result.id
      });
        setTimeout(() => navigate('/dashboard'), 100);
      } else {
        console.error('Login failed:', data.message);
      }
    } catch (error) {
      console.error('Error during login:', error);
    }
  };

  return (
    <AuthLayout title="Get Started">
      <p className="text-sm font-semibold text-neutral-400 mt-2 mb-5 text-center">
        Connect with the Best in Pet Care – Sign In Now
      </p>
      <form className="text-center" onSubmit={handleSubmit}>
        <Input name="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
        <PasswordInput name="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
        <button type="submit" className="block w-full bg-blue-600 hover:bg-blue-600/90 mt-4 py-2 rounded-md text-white font-semibold mb-2">
          Login
        </button>
        <div className="text-left">
          <span className="text-sm ml-2">Don't have an account?</span>
          <Link to="/auth/signup">
            <span className="text-sm ml-1 text-blue-500 hover:text-blue-600 cursor-pointer underline">Sign Up</span>
          </Link>
        </div>
      </form>
    </AuthLayout>
  );
};

export default Login;

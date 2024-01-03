import { Link, useNavigate } from "react-router-dom";
import AuthLayout from "../Layout";
import Input from "../Input";
import PasswordInput from "../PasswordInput";
import { ChangeEvent, FormEvent, useState } from "react";
import useAuthRedirect from '../../../hooks/use-auth-redirect';

const SignUp = () => {
  useAuthRedirect(); 
  const navigate = useNavigate(); 
  const [name, setName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [passwordError, setPasswordError] = useState<string>('');

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (password !== confirmPassword) {
      setPasswordError('Passwords do not match');
      return;
    }
    setPasswordError('');

    const userData = { name, email, password };

    try {

      const response = await fetch('http://localhost:5000/api/users/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      const data = await response.json();
      if (!response.ok) {

        console.error('Signup error:', data.message);
      } else {
        setTimeout(() => navigate('/auth/login'), 100);
        console.log('Signup successful:', data);
      }
    } catch (error) {
      console.error('Error during signup:', error);
    }
  };

  return (
    <AuthLayout title="Sign Up">
      <p className="text-sm font-semibold text-neutral-400 mt-2 mb-5 text-center">
        Connect with the Best in Pet Care – Sign Up Now
      </p>
      <form className="text-center" onSubmit={handleSubmit}>
        <Input name="name" placeholder="Name" value={name} onChange={(e: ChangeEvent<HTMLInputElement>) => setName(e.target.value)} />
        <Input name="email" placeholder="Email" value={email} onChange={(e: ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)} />
        <PasswordInput name="password" placeholder="Password" value={password} onChange={(e: ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)} />
        <PasswordInput name="confirmPassword" placeholder="Repeat Password" value={confirmPassword} onChange={(e: ChangeEvent<HTMLInputElement>) => setConfirmPassword(e.target.value)} />
        {passwordError && <p className="text-red-500 text-sm">{passwordError}</p>}
        <button type="submit" className="block w-full bg-blue-600 hover:bg-blue-600/90 mt-4 py-2 rounded-md text-white font-semibold mb-2">
          Sign Up
        </button>
        <div className="text-left">
          <span className="text-sm ml-2">Already have an account?</span>
          <Link to="/auth/login">
            <span className="text-sm ml-1 text-blue-500 hover:text-blue-600 cursor-pointer underline">Login</span>
          </Link>
        </div>
      </form>
    </AuthLayout>
  );
};

export default SignUp;

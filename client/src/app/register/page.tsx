'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

import axios from 'axios';

export default function RegisterPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');

  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await axios.post('http://localhost:5000/api/auth/register', {
        name,
        email,
        password,
      });

      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data));
        router.push('/dashboard');
      }
    } catch (err: any) {
      setError(err.response?.data?.error || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] p-4 text-center">
      <h2 className="text-3xl font-bold mb-4">Join TubeFetch Pro</h2>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4 w-full max-w-sm">
        <input 
          type="email" 
          placeholder="Email address" 
          className="p-3 border rounded-lg bg-background"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input 
          type="password" 
          placeholder="Choose a password" 
          className="p-3 border rounded-lg bg-background"
          required
        />
        <button type="submit" className="p-3 bg-accent text-white font-bold rounded-lg hover:bg-blue-600 transition">
          Create Account
        </button>
      </form>
      <p className="mt-4 text-sm text-gray-500">
        Already have an account? <a href="/login" className="text-accent underline">Login</a>
      </p>
    </div>
  );
}

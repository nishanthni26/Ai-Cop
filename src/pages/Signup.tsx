import { FormEvent, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Shield } from 'lucide-react';
import { continueWithGoogleDemo, findUser, saveUser, setCurrentUser } from '../lib/localStore';

export default function Signup() {
  const navigate = useNavigate();
  const location = useLocation();
  const redirectTo = (location.state as { from?: string } | null)?.from ?? '/scanner';
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();

    if (findUser(email)) {
      setError('An account already exists with this email.');
      return;
    }

    saveUser({ name, email, password });
    setCurrentUser(email);
    navigate(redirectTo);
  };

  const handleGoogleLogin = () => {
    continueWithGoogleDemo();
    navigate(redirectTo);
  };

  return (
    <div className="min-h-screen px-4 py-24">
      <div className="mx-auto max-w-md">
        <div className="glass-card p-8">
          <div className="mb-6 flex items-center gap-3">
            <Shield className="h-9 w-9 text-cyber-blue" />
            <div>
              <h1 className="text-2xl font-semibold text-white">Create Account</h1>
              <p className="text-sm text-gray-400">Save scanner results to your history.</p>
            </div>
          </div>

          <button
            onClick={handleGoogleLogin}
            className="mb-5 flex w-full items-center justify-center gap-3 rounded-lg border border-white/10 bg-white px-4 py-3 text-sm font-semibold text-gray-900 transition hover:bg-gray-100"
            type="button"
          >
            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-white text-base font-bold text-cyber-blue">G</span>
            Continue with Google
          </button>

          <div className="mb-5 flex items-center gap-3">
            <div className="h-px flex-1 bg-white/10" />
            <span className="text-xs text-gray-500">or</span>
            <div className="h-px flex-1 bg-white/10" />
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="mb-2 block text-sm text-gray-300">Name</label>
              <input value={name} onChange={(event) => setName(event.target.value)} required className="w-full rounded-lg border border-white/10 bg-cyber-dark px-4 py-3 text-white outline-none focus:border-cyber-blue" />
            </div>
            <div>
              <label className="mb-2 block text-sm text-gray-300">Email</label>
              <input value={email} onChange={(event) => setEmail(event.target.value)} type="email" required className="w-full rounded-lg border border-white/10 bg-cyber-dark px-4 py-3 text-white outline-none focus:border-cyber-blue" />
            </div>
            <div>
              <label className="mb-2 block text-sm text-gray-300">Password</label>
              <input value={password} onChange={(event) => setPassword(event.target.value)} type="password" required minLength={4} className="w-full rounded-lg border border-white/10 bg-cyber-dark px-4 py-3 text-white outline-none focus:border-cyber-blue" />
            </div>
            {error && <p className="text-sm text-cyber-red">{error}</p>}
            <button className="btn-cyber w-full" type="submit">Sign Up</button>
          </form>

          <p className="mt-5 text-center text-sm text-gray-400">
            Already have an account? <Link to="/login" className="text-cyber-blue hover:text-white">Login</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

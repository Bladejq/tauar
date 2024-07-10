import React, { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import VisibilityIcon from '@mui/icons-material/Visibility';
import userService from '../services/user.service';
import UserContext from '../context/user';

function Login() {
  const [credentials, setCredentials] = useState({
    email: '',
    password: '',
  });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [passwordVisible, setPasswordVisible] = useState(false);
  const { updateUser } = useContext(UserContext);
  const navigate = useNavigate();

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  const submitForm = (e) => {
    e.preventDefault();
    setLoading(true);
    userService
      .login(credentials)
      .then((res) => res.status)
      .then((status) => {
        if (status === 200) {
          setLoading(false);
          updateUser();
          navigate('/');
        }
      })
      .catch((err) => {
        setError(err.message);
        setCredentials({
          email: '',
          password: '',
        });
        setLoading(false);
      });
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-6 bg-white rounded-lg shadow-md">
        <h2 className="text-2xl font-bold font-Montserrat mb-4 text-center">Аккаунтқа кіру</h2>

        {error && (
          <div className="text-red-900 text-xl text-center mb-4">
            {/* {error} */}
            Пайдаланушы email немесе Құпиясөз қате . Кейінірек, көріңіз!
          </div>
        )}

        <form onSubmit={submitForm}>
          <div className="mb-4">
            <label htmlFor="email" className="block text-gray-700 font-medium mb-2">
              Email:
            </label>
            <input
              type="email"
              id="email"
              name="email"
              placeholder="Эл. поштаңызды теріңіз"
              className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:ring-blue-300"
              value={credentials.email}
              disabled={loading}
              required
              onChange={(e) =>
                setCredentials({ ...credentials, email: e.target.value })
              }
            />
          </div>

          <div className="mb-4">
            <label htmlFor="password" className="block text-gray-700 font-medium mb-2">
              Құпиясөз:
            </label>
            <div className="relative">
              <input
                type={passwordVisible ? 'text' : 'password'}
                id="password"
                name="password"
                placeholder="Құпиясөзді теріңіз"
                className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:ring-blue-300"
                value={credentials.password}
                disabled={loading}
                required
                onChange={(e) =>
                  setCredentials({ ...credentials, password: e.target.value })
                }
              />
              <button
                type="button"
                onClick={togglePasswordVisibility}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
              >
                {passwordVisible ? <VisibilityIcon /> : <VisibilityOffIcon />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            className="w-full p-2 bg-blue-900 text-white rounded-lg hover:bg-blue-950 focus:outline-none focus:ring focus:ring-blue-300"
            disabled={loading}
          >
            {loading ? 'Деректер жіберілуде' : 'Кіру'}
          </button>

          <div className="mt-4 text-center">
            <span className="text-gray-700">Аккаунт жоқ па?</span>
            <Link to="/register" className="text-blue-600 text-Montserrat hover:underline ml-2">
              Тіркеліңіз
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Login;

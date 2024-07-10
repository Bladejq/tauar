import React, { useState } from 'react';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

function Registration() {
    const [passwordVisible, setPasswordVisible] = useState(false);
    const [credentials, setCredentials] = useState({
        email: "",
        password: "",
        passwordConfirmation: "", // Пароль қайталау қосу
        firstname: "",
        lastname: ""
    });
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const [passwordError, setPasswordError] = useState("");
    const navigate = useNavigate();

    const submitForm = (e) => {
        e.preventDefault();

        if (credentials.password !== credentials.passwordConfirmation) {
            setPasswordError("Құпиясөз толық емес");
            return;
        } else {
            setPasswordError("");
        }

        setLoading(true);
        axios
            .post("http://localhost:8000/api/auth/register", credentials)
            .then((res) => res.data)
            .then((data) => {
                localStorage.setItem("user", JSON.stringify(data));
                setLoading(false);
                navigate('/');
            })
            .catch((err) => {
                setError(err.message);
                setCredentials({
                    email: "",
                    password: "",
                    passwordConfirmation: "",
                    firstname: "",
                    lastname: ""
                });
                setLoading(false);
            });
    };

    const togglePasswordVisibility = () => {
        setPasswordVisible(!passwordVisible);
    };

    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-100">
            <div className="w-full max-w-md p-6 bg-white rounded-lg shadow-md">
                <h2 className="text-2xl font-bold mb-4 text-center">Аккаунт тіркеу</h2>

                <form className="space-y-6" onSubmit={submitForm}>
                    <div className="mb-4">
                        <label htmlFor="firstName" className="block text-gray-700 font-medium mb-2">Аты:</label>
                        <input
                            id="firstName"
                            type="text"
                            name="firstname"
                            required
                            placeholder="Атыңызды теріңіз"
                            className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:ring-blue-300"
                            disabled={loading}
                            value={credentials.firstname}
                            onChange={(e) =>
                                setCredentials({ ...credentials, firstname: e.target.value })
                            }
                        />
                    </div>

                    <div className="mb-4">
                        <label htmlFor="lastName" className="block text-gray-700 font-medium mb-2">Жөні:</label>
                        <input
                            type="text"
                            id="lastName"
                            placeholder="Фамилияңызды теріңіз"
                            className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:ring-blue-300"
                            required
                            disabled={loading}
                            value={credentials.lastname}
                            onChange={(e) =>
                                setCredentials({ ...credentials, lastname: e.target.value })
                            }
                        />
                    </div>

                    <div className="mb-4">
                        <label htmlFor="email" className="block text-gray-700 font-medium mb-2">Эл. пошта:</label>
                        <input
                            type="email"
                            id="email"
                            placeholder="Эл. поштаны теріңіз"
                            className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:ring-blue-300"
                            required
                            disabled={loading}
                            value={credentials.email}
                            onChange={(e) =>
                                setCredentials({ ...credentials, email: e.target.value })
                            }
                        />
                    </div>

                    <div className="mb-4">
                        <label htmlFor="password" className="block text-gray-700 font-medium mb-2">Құпиясөз теріңіз:</label>
                        <div className="relative">
                            <input
                                type={passwordVisible ? "text" : "password"}
                                id="password"
                                placeholder="Құпиясөзді теріңіз"
                                className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:ring-blue-300"
                                required
                                disabled={loading}
                                value={credentials.password}
                                onChange={(e) =>
                                    setCredentials({ ...credentials, password: e.target.value })
                                }
                            />
                            <button
                                type="button"
                                onClick={togglePasswordVisibility}
                                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                            >
                                {passwordVisible ? (
                                    <VisibilityIcon />
                                ) : (
                                    <VisibilityOffIcon />
                                )}
                            </button>
                        </div>
                    </div>

                    <div className="mb-4">
                        <label htmlFor="passwordConfirmation" className="block text-gray-700 font-medium mb-2">Құпиясөзді қайталау:</label>
                        <input
                            type={passwordVisible ? "text" : "password"}
                            id="passwordConfirmation"
                            placeholder="Құпиясөзді қайталау"
                            className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:ring-blue-300"
                            required
                            disabled={loading}
                            value={credentials.passwordConfirmation}
                            onChange={(e) =>
                                setCredentials({ ...credentials, passwordConfirmation: e.target.value })
                            }
                        />
                        {passwordError && (
                            <div className="text-red-900 mt-2">
                                {passwordError}
                            </div>
                        )}
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full p-2 bg-blue-900 text-white rounded-lg hover:bg-blue-950 focus:outline-none focus:ring focus:ring-blue-400"
                    >
                        {loading ? "Деректер жазылуда" : "Тіркелі"}
                    </button>

                    {error && (
                        <div className='text-red-900'>
                            {error}. Please, try again!
                        </div>
                    )}
                </form>
                <div className="mt-4 text-center">
                    <span className="text-gray-700">Аккаунт бар ма?</span>
                    <Link to="/login" className="text-blue-600 hover:underline ml-2">
                        Кіру
                    </Link>
                </div>
            </div>
        </div>
    );
}

export default Registration;

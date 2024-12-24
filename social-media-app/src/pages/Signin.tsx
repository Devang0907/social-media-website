import React, { useState } from 'react';
import { getAuth, signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { auth } from "../firebase";
import { useNavigate, Link } from 'react-router-dom';

const googleProvider = new GoogleAuthProvider();

function Signin() {

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    const signinUser = () => {
        signInWithEmailAndPassword(auth, email, password)
            .then((value) => { 
                // alert("Welcome back."); 
                navigate("/news-feed");
                
            })
            .catch((err) => { alert("Please enter right email/password."); });
    };

    const signupWithGoogle = () => {
        signInWithPopup(auth, googleProvider)
        .then((value) => { 
            // alert("Welcome back."); 
            navigate("/news-feed");
            
        });
    };


    return (

        <>

            <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
                <div className="sm:mx-auto sm:w-full sm:max-w-sm">
                    <img
                        alt="Your Company"
                        src="https://www.logologo.com/logos/abstract-isometric-logo-design-free-logo.jpg"
                        className="mx-auto h-10 w-auto"
                    />
                    <h2 className="mt-10 text-center text-2xl/9 font-bold tracking-tight text-gray-900">
                        Sign in to your account
                    </h2>
                </div>


                <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
                    <div className="space-y-6">
                        <div>
                            <label htmlFor="email" className="block text-left text-sm font-medium text-gray-900">
                                Email address
                            </label>
                            <div className="mt-2">
                                <input
                                    className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm"
                                    type='email'
                                    value={email}
                                    required placeholder='Enter your email here'
                                    onChange={e => setEmail(e.target.value)} />
                            </div>
                        </div>

                        <div>
                            <div className="flex items-center justify-between">
                                <label className="block text-sm font-medium text-gray-900">
                                    Password
                                </label>
                            </div>
                            <div className="mt-2">
                                <input
                                    className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm"
                                    type='password'
                                    value={password}
                                    required placeholder='Enter your password here'
                                    onChange={e => setPassword(e.target.value)} />
                            </div>
                        </div>

                        <div>
                            <Link to="signup" className="text-blue-800 hover:text-blue-400" >New here?</Link>
                            <button
                                onClick={signinUser}
                                className="flex w-full justify-center rounded-md bg-indigo-600 px-5 py-1.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                            >
                                Sign in
                            </button>
                        </div>

                        <div>
                            <button
                                onClick={signupWithGoogle}
                                className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600"
                            >
                                <img className="w-6 h-6 mr-3" src="https://www.svgrepo.com/show/475656/google-color.svg" loading="lazy" alt="google logo" />
                                <span>Login with Google</span>
                            </button>
                        </div>

                    </div>

                </div>

            </div>

        </>
    )
}

export default Signin

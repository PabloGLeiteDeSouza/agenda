
"use client";
import { signIn } from "next-auth/react";
import { FaFacebook, FaGoogle, FaInstagram } from "react-icons/fa6";

const SocialSignIn: React.FC = () => {
    return (
        <div className="flex flex-col gap-4">
            <button className="btn btn-primary" onClick={() => {
                signIn("google")
            }}>
                <FaGoogle />
                Sign in with Google
            </button>
            <button className="btn btn-primary" onClick={() => {
                signIn("facebook")
            }}>
                <FaFacebook />
                Sign in with Facebook
            </button>
            <button className="btn btn-primary" onClick={() => {
                signIn("instagram")
            }}>
                <FaInstagram />
                Sign in with Instagram
            </button>
        </div>
    )
}

export default SocialSignIn;
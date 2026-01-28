import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Modal from "@mui/material/Modal";
import RegisterUserForm from "./RegisterForm";
import { useEffect, useState } from "react";
import LoginUserForm from "./LoginForm";
import ForgotPasswordForm from "./ForgotPasswordForm";
import ResetPasswordForm from "./ResetPasswordForm";
import { useLocation } from "react-router-dom";
import { useSelector } from "react-redux";

const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: '100%',
    maxWidth: 550,
    bgcolor: "transparent",
    boxShadow: 'none',
    p: 2,
    outline: 'none',
};

export default function AuthModal({ handleClose, open }) {
    const location = useLocation();
    const { auth } = useSelector((store) => store);
    
    useEffect(() => {
        if (auth.user) {
            handleClose();
        }
    }, [auth.user, handleClose]);

    const renderForm = () => {
        switch (location.pathname) {
            case "/login":
                return <LoginUserForm />;
            case "/register":
                return <RegisterUserForm />;
            case "/forgot-password":
                return <ForgotPasswordForm />;
            case "/reset-password":
                return <ResetPasswordForm />;
            default:
                return <LoginUserForm />;
        }
    };
    
    return (
        <Modal
            open={open}
            onClose={handleClose}
            aria-labelledby="auth-modal"
            aria-describedby="authentication-modal"
        >
            <Box sx={style}>
                {renderForm()}
            </Box>
        </Modal>
    );
}
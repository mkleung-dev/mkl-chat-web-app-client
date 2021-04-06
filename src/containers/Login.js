import React, { useState } from "react";
import { FormGroup, FormControl, FormLabel, Button } from "react-bootstrap";
import "./Login.css";
import { Auth } from "aws-amplify";
import { useAuth } from "../libs/authLib";
import { onError } from "../libs/errorLib";
import { useFormFields } from "../libs/hooksLib";

export default function Login() {
    const [isLoading, setIsLoading] = useState(false);
    const { userHasAuthenticated } = useAuth();
    const [fields, handleFieldChange] = useFormFields({
        email: "",
        password: ""
    })

    function validateForm() {
        return fields.email.length > 0 && fields.password.length > 0;
    }

    async function handleSubmit(event) {
        event.preventDefault();

        setIsLoading(true);

        try {
            await Auth.signIn(fields.email, fields.password);
            userHasAuthenticated(true);
        } catch (e) {
            onError(e);
            setIsLoading(false);
        }
    }

    return (
        <div className="Login">
            <form onSubmit={handleSubmit}>
                <FormGroup controlId="email" bsSize="large">
                    <FormLabel>Email</FormLabel>
                    <FormControl autoFocus type="email" value={fields.email} onChange={handleFieldChange} />
                </FormGroup>
                <FormGroup controlId="password" bsSize="large">
                    <FormLabel>Password</FormLabel>
                    <FormControl type="password" value={fields.password} onChange={handleFieldChange} />
                </FormGroup>
                <Button block bsSize="large" disabled={!validateForm()} type="submit" isLoading={isLoading}>
                    Login
                </Button>
            </form>
        </div>
    );
}
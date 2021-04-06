import React, { useState } from "react";
import { useHistory} from "react-router-dom";
import { FormGroup, FormControl, FormLabel, Button } from "react-bootstrap";
import { useAuth } from "../libs/authLib";
import { useFormFields } from "../libs/hooksLib";
import { onError } from "../libs/errorLib";
import "./SignUp.css";
import { Auth } from "aws-amplify";

export default function Signup() {
    const [fields, handleFieldChange] = useFormFields({
        username: "",
        email: "",
        password: "",
        confirmPassword: "",
        confirmationCode: ""
    });
    const history = useHistory();
    const [newUser, setNewUser] = useState(null);
    const { userHasAuthenticated } = useAuth();
    const [isLoading, setIsLoading] = useState(false);

    function validateForm() {
        return (
            fields.username.length > 0 &&
            fields.email.length > 0 &&
            fields.password.length > 0 &&
            fields.password === fields.confirmPassword
        );
    }

    function validateConfirmationForm() {
        return fields.confirmationCode.length > 0;
    }

    async function handleSubmit(event) {
        event.preventDefault();
        setIsLoading(true);

        try {
            const newUser = await Auth.signUp({
                username: fields.username,
                password: fields.password,
                attributes: {
                    email: fields.email
                }
            });
            setIsLoading(false);
            setNewUser(newUser);
        } catch(e) {
            onError(e);
            setIsLoading(false);
        }
    }

    async function handleConfirmationSubmit(event) {
        event.preventDefault();
        setIsLoading(true);

        try {
            await Auth.confirmSignUp(fields.username, fields.confirmationCode);
            await Auth.signIn(fields.username, fields.password);
            userHasAuthenticated(true);
            history.push("/")
        } catch(e) {
            onError(e);
            setIsLoading(false);
        }
    }

    function renderConfirmationForm() {
        return (
            <form onSubmit={handleConfirmationSubmit}>
                <FormGroup controlId="confirmationCode" bsSize="large">
                    <FormLabel>Confirmation Code</FormLabel>
                    <FormControl autoFocus type="tel" onChange={handleFieldChange} value={fields.confirmationCode} />
                </FormGroup>
                <Button block type="submit" bsSize="large" isLoading={isLoading} disabled={!validateConfirmationForm()}>
                    Verify
                </Button>
            </form>
        );
    }

    function renderForm() {
        return (
            <form onSubmit={handleSubmit}>
                <FormGroup controlId="username" bsSize="large">
                    <FormLabel>User Name</FormLabel>
                    <FormControl autoFocus type="text" onChange={handleFieldChange} value={fields.username} />
                </FormGroup>
                <FormGroup controlId="email" bsSize="large">
                    <FormLabel>Email</FormLabel>
                    <FormControl autoFocus type="email" onChange={handleFieldChange} value={fields.email} />
                </FormGroup>
                <FormGroup controlId="password" bsSize="large">
                    <FormLabel>Password</FormLabel>
                    <FormControl autoFocus type="password" onChange={handleFieldChange} value={fields.password} />
                </FormGroup>
                <FormGroup controlId="confirmPassword" bsSize="large">
                    <FormLabel>Confirm Password</FormLabel>
                    <FormControl autoFocus type="password" onChange={handleFieldChange} value={fields.confirmPassword} />
                </FormGroup>
                <Button block type="submit" bsSize="large" isLoading={isLoading} disabled={!validateForm()}>
                    Signup
                </Button>
            </form>
        );
    }

    return (
        <div className="Signup">
            {newUser === null? renderForm() : renderConfirmationForm()}
        </div>
    );
}
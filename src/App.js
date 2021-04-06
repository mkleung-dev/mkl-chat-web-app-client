import logo from './logo.svg';
import './App.css';
import { createContext, useContext, useState } from 'react';
import { BrowserRouter, Route, Switch, Link, Redirect, useHistory, useLocation } from "react-router-dom"
import Nav from 'react-bootstrap/Nav'
import Navbar from 'react-bootstrap/Navbar'
import { Container, NavItem } from 'react-bootstrap';
import Login from './containers/Login';
import Routes from './Routes';

import { ProvideAuth, useAuth } from "./libs/authLib";

function App() {
  return (
    <ProvideAuth>
      <Container>
        <Navbar collapseOnSelect expand="lg" bg="light" variant="light">
          <Navbar.Brand>
            Easy Chat
          </Navbar.Brand>
          <Navbar.Toggle />
          <Navbar.Collapse>
            <Nav className="mr-auto">
            </Nav>
            <Nav>
              <Nav.Link href="/login">
                Login
              </Nav.Link>
              <Nav.Link href="/signup">
                Signup
              </Nav.Link>
            </Nav>
          </Navbar.Collapse>
        </Navbar>
      </Container>

      <BrowserRouter>
        <Routes/>
      </BrowserRouter>
    </ProvideAuth>
  );
}

function AuthExample() {
  return (
    <ProvideAuth>
      <div>
        <AuthButton />
        <ul>
          <li>
            <Link to ="/public">Public Page</Link>
          </li>
          <li>
            <Link to ="/protected">Protected Page</Link>
          </li>
        </ul>

        <BrowserRouter>
        <Switch>
          <Route path="/public">
            <PublicPage />
          </Route>
          <Route path="/login">
            <LoginPage />
          </Route>
          <PrivateRoute path="/protected">
            <ProtectedPage />
          </PrivateRoute>
        </Switch>
        </BrowserRouter>
      </div>
    </ProvideAuth>
  )
}

function AuthButton() {
  let history = useHistory();
  let auth = useAuth();

  return auth.user ? (
    <p>
      Welcome!
      <button onClick={() => {
        auth.signOut(() => history.push("/"));
      }}>
        Sign Out
      </button>
    </p>
  ) : (
    <p>You are not logged in.</p>
  );
}

function PrivateRoute({ children, ...rest }) {
  let auth = useAuth();
  return (
    <Route
      {...rest}
      render={({ location }) =>
        auth.user ? (
          children
        ) : (
          <Redirect
            to={{pathname: "/login",
              state: { from: location }
            }}
          />
        )
      }
    />
  )
}

function PublicPage() {
  return <h3>Public</h3>
}

function ProtectedPage() {
  return <h3>Protected</h3>
}

function LoginPage() {
  let history = useHistory();
  let location = useLocation();
  let auth = useAuth();

  let { from } = location.state || { from: {pathname: "/" } };
  let login = () => {
    auth.signIn(() => {
      history.replace(from);
    })
  }

  return (
    <div>
      <Login />
    </div>
  )
}


export default App;

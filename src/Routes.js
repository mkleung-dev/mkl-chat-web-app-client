import React from "react";
import { BrowserRouter, Route, Switch, Link, Redirect, useHistory, useLocation } from "react-router-dom"
import Login from "./containers/Login";
import SignUp from "./containers/SignUp";
import { useProviderAuth, useAuth } from "./libs/authLib";

function AuthRoute({ children, ...rest }) {
  const { pathName, search } = useLocation();
    const auth = useProviderAuth();
    return (
      <Route {...rest}>
        {auth.user ? (
          children
        ) : (
          <Redirect to={`/login?redirect=${pathName}${search}`} />
        )}
      </Route>
    );
}

function querystring(name, url = window.location.href) {
  name = name.replace(/[[]]/g, "\\$&");
  const regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)", "i");
  const results = regex.exec(url);
  if (!results) {
    return null;
  }
  if (!results[2]) {
    return "";
  }
  return decodeURIComponent(results[2].replace(/\+/g, ""));
}

function UnauthRoute({ children, ...rest }) {
  const auth = useProviderAuth();
  const redirect = querystring("redirect");
  return (
    <Route {...rest}>
    {!auth.user ? (
      children
    ) : (
      <Redirect to={redirect === "" || redirect === null ? "/" : redirect} />
    )}
    </Route>
  );
}

export default function Routes() {
return (
  <Switch>
    <UnauthRoute exact path="/login">
      <Login />
    </UnauthRoute>
    <UnauthRoute exact path="/signup">
      <SignUp />
    </UnauthRoute>
    <AuthRoute exact path="/notes/new">
     <Login />
    </AuthRoute>
    <AuthRoute exact path="/notes/:id">
      <Login />
    </AuthRoute>
    <Route>
      <Login />
    </Route>
  </Switch>
  );
}

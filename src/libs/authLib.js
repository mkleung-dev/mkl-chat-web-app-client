import { useContext, createContext, useState } from "react";
import { Auth } from "aws-amplify";

export const AppContext = createContext(null);

export function useAuth() {
    return useContext(AppContext);
}

const fakeAuth = {
  isAuthenticated: false,
  signIn(cb) {
    fakeAuth.isAuthenticated = true;
    setTimeout(cb, 100);
  },
  signOut(cb) {
    fakeAuth.isAuthenticated = false;
    setTimeout(cb, 100);
  }
};

export function useProviderAuth() {
  const [user, setUser] = useState(null);

  const signIn = cb => {
    return fakeAuth.signIn(() => {
      setUser("user");
      cb();
    });
  };

  const signUp = cb => {
    return fakeAuth.signIn(() => {
      setUser("user");
      cb();
    });
  };

  const signOut = cb => {
    return fakeAuth.signOut(() => {
      setUser(null);
      cb();
    });
  };

  return {
    user, signUp, signIn, signOut
  };
}

export function ProvideAuth({ children }) {
  const auth = useProviderAuth();
  return (
    <AppContext.Provider value={auth}>
      {children}
    </AppContext.Provider>
  );
}
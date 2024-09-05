import React, { createContext, useState } from 'react';

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [selectedAccount, setSelectedAccount] = useState(null);

  return (
    <UserContext.Provider value={{ user, setUser, selectedAccount, setSelectedAccount }}>
      {children}
    </UserContext.Provider>
  );
};

export default UserProvider;

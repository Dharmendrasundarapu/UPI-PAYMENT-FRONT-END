import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Register from "./components/Register";
import Home from "./components/Home";
import LogIn from "./components/LogIn";
import Transfer from "./components/Transfer";
import { UserProvider, UserContext } from './context/UserContext';
import AccountCreation from './components/AccountCreation';
import TransactionMoney from './components/TransactionMoney';

function App() {
    return (
        <div className="App">
            <UserProvider>
                <Router>
                    <Routes>
                        <Route path="/" element={<LogIn />} />
                        <Route path="/register" element={<Register />} />
                        <Route path="/home" element={<Home />} />
                        <Route path="/transfer" element={<Transfer />} />
                        <Route path="/send" element={<TransactionMoney/>}/>
                        <Route path="/accCreate" element={<AccountCreation />} />
                        <Route 
                            path="/history" 
                            element={
                                <UserContext.Consumer>
                                    {({ userDetails }) => (
                                        userDetails ? <Transfer /> : <Navigate to="/" />
                                    )}
                                </UserContext.Consumer>
                            } 
                        />
                    </Routes>
                </Router>
            </UserProvider>
        </div>
    );
}
export default App;

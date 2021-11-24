import React from 'react';
import {
    BrowserRouter as Router,
    Switch,
    Route,
    } from "react-router-dom";
import LoginAndRegister from '../views/LoginAndRegister';

    export const AppRoutes = () =>{
    return(
        <Router>
            <Switch>
            <Route exact path='/login'>
        <LoginAndRegister />
        </Route>
        <Route exact path='/register'>
        <LoginAndRegister />
            </Route>
            </Switch>
        </Router>
        )
    };

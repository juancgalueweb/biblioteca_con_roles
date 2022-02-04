import React from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import { ForgotPassword } from "../components/ForgotPassword";
import { LateOTPRequest } from "../components/LateOTPRequest";
import { NavbarMenu } from "../components/NavbarMenu";
import { ResetPassword } from "../components/ResetPassword";
import { VerifyEmail } from "../components/VerifyEmail";
import { AdminBooksMain } from "../views/AdminBooksMain";
import { AdminNewEditScreen } from "../views/AdminNewEditScreen";
import { HomeScreen } from "../views/HomeScreen";
import { LoginRegisterScreen } from "../views/LoginRegisterScreen";
import { UserBooksContainer } from "../views/UserBooksContainer";
import { UserBooksMain } from "../views/UserBooksMain";

export const AppRoutes = () => {
  return (
    <Router>
      <NavbarMenu />
      <Switch>
        <Route exact path="/login">
          <LoginRegisterScreen />
        </Route>
        <Route exact path="/register">
          <LoginRegisterScreen />
        </Route>
        <Route exact path="/verify-email">
          <VerifyEmail />
        </Route>
        <Route exact path="/forgot-password">
          <ForgotPassword />
        </Route>
        <Route exact path="/reset-password">
          <ResetPassword />
        </Route>
        <Route exact path="/admin/books">
          <AdminBooksMain />
        </Route>
        <Route exact path="/admin/book/new">
          <AdminNewEditScreen />
        </Route>
        <Route exact path="/admin/book/edit/:id">
          <AdminNewEditScreen />
        </Route>
        <Route exact path="/user/books">
          <UserBooksMain />
        </Route>
        <Route exact path="/user/book/:id">
          <UserBooksContainer />
        </Route>
        <Router exact path="/">
          <HomeScreen />
        </Router>
        <Router exact path="/late-validation">
          <LateOTPRequest />
        </Router>
      </Switch>
    </Router>
  );
};

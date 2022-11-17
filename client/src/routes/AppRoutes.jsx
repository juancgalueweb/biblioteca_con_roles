import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
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
    <BrowserRouter>
      <NavbarMenu />
      <Routes>
        <Route exact path="/login" element={<LoginRegisterScreen />} />
        <Route exact path="/register" element={<LoginRegisterScreen />} />
        <Route exact path="/verify-email" element={<VerifyEmail />} />
        <Route exact path="/forgot-password" element={<ForgotPassword />} />
        <Route exact path="/reset-password" element={<ResetPassword />} />
        <Route exact path="/admin/books" element={<AdminBooksMain />} />
        <Route exact path="/admin/book/new" element={<AdminNewEditScreen />} />
        <Route
          exact
          path="/admin/book/edit/:id"
          element={<AdminNewEditScreen />}
        />
        <Route exact path="/user/books" element={<UserBooksMain />} />
        <Route exact path="/user/book/:id" element={<UserBooksContainer />} />
        <Route exact path="/" element={<HomeScreen />} />
        <Route exact path="/late-validation" element={<LateOTPRequest />} />
      </Routes>
    </BrowserRouter>
  );
};

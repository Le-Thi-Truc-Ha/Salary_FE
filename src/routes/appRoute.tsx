import { useContext, type JSX } from "react";
import { UserContext } from "../configs/globalVariable";
import { Outlet, Route, Routes } from "react-router-dom";
import PublicRoute from "./publicRoute";
import PrivateRoute from "./privateRoute";
import NotFound from "../components/Other/NotFound";
import Header from "../components/Other/Header";
import Loading from "../components/Other/Loading";
import Login from "../components/Other/Login";
import AdminPage from "../components/Admin/AdminPage";
import EmployeePage from "../components/Employee/EmployeePage";
import Home from "../components/Other/Home";

const MainRoute = (): JSX.Element => {
    return(
        <>
            <Header />
            <Outlet />
        </>
    )
}

const AuthRoute = (): JSX.Element => {
    return(
        <>
            <Outlet />
        </>
    )
}

const AppRoute = (): JSX.Element => {
    const {isLoading} = useContext(UserContext);

    return(isLoading ? <><Loading /></> :
        <Routes>
            <Route element={<AuthRoute />}>
                <Route 
                    path="/login"
                    element={
                        <PublicRoute>
                            <Login />
                        </PublicRoute>
                    }
                />
                <Route path="*" element={<NotFound />} />
            </Route>
            
            <Route element={<MainRoute />}>
                {/* ADMIN */}
                <Route 
                    path="/admin/admin-page" 
                    element={
                        <PrivateRoute roleId={1}>
                            <AdminPage />
                        </PrivateRoute>
                    } 
                />

                {/* CUSTOMER */}
                <Route 
                    path="/customer/customer-page" 
                    element={
                        <PrivateRoute roleId={2}>
                            <EmployeePage />
                        </PrivateRoute>
                    } 
                />

                {/* PUBLIC */}
                <Route path="/" element={<Home />} />
            </Route>
        </Routes>
    );
};

export default AppRoute;
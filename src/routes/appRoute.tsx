import { lazy, useContext, type JSX } from "react";
import { UserContext } from "../configs/globalVariable";
import { Route, Routes } from "react-router-dom";
import PublicRoute from "./publicRoute";
import PrivateRoute from "./privateRoute";
import NotFound from "../components/Other/NotFound";
import Loading from "../components/Other/Loading";

const Login = lazy(() => import("../components/Other/Login"));
const HomeEmployee = lazy(() => import("../components/Employee/HomeEmployee"));
const HeaderEmployee = lazy(() => import("../components/Employee/HeaderEmployee"));
const HeaderAdmin = lazy(() => import("../components/Admin/HeaderAdmin"));
const HomeAdmin = lazy(() => import("../components/Admin/HomeAdmin"));
const ManageShift = lazy(() => import("../components/Admin/ManageShift"));

const AppRoute = (): JSX.Element => {
    const {isLoading} = useContext(UserContext);

    return(isLoading ? <><Loading /></> :
        <Routes>
            <Route 
                path="/"
                element={
                    <PublicRoute>
                        <Login />
                    </PublicRoute>
                }
            />
            <Route path="*" element={<NotFound />} />

            {/* ADMIN */}
            <Route
                path="/admin"
                element={
                    <PrivateRoute roleId={1}>
                        <HeaderAdmin />
                    </PrivateRoute>
                } 
            >
                <Route path="home" element={<HomeAdmin />} />
                <Route path="home/manage-shift/:employeeId" element={<ManageShift />} />
            </Route>

            {/* EMPLOYEE   */}
            <Route
                path="/employee"
                element={
                    <PrivateRoute roleId={2}>
                        <HeaderEmployee />
                    </PrivateRoute>
                } 
            >
                <Route path="home" element={<HomeEmployee />} />
            </Route>
        </Routes>
    );
};

export default AppRoute;
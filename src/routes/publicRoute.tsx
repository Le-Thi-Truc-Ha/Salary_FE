import { useContext, type JSX, type ReactNode } from "react";
import { UserContext } from "../configs/globalVariable";
import { Navigate } from "react-router-dom";

interface PublicRouteProps {
    children: ReactNode;
}

const PublicRoute = ({children}: PublicRouteProps): JSX.Element => {
    const {user} = useContext(UserContext);
    if (user.isAuthenticated) {
        if (user.roleId == 1) {
            return <Navigate to="/admin/home" replace />
        } else {
            return <Navigate to="/employee/home" replace />
        }
    }
    
    return(
        <>{children}</>
    );
};

export default PublicRoute;
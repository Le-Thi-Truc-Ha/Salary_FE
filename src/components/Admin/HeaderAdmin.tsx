import { Col, Row } from "antd";
import { forwardRef, useContext, useEffect, useState, type JSX } from "react";
import "../Employee/HeaderEmployee.scss";
import { KeyRound, LogOut, UsersRound, X } from "lucide-react";
import { AnimatePresence, motion, type MotionProps } from "framer-motion";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { UserContext } from "../../configs/globalVariable";
import ChangePasswordModal from "../Other/ChangePasswordModal";

const ColWrapper = forwardRef<HTMLDivElement, any>((props, ref) => (
    <Col {...props} ref={ref} />
))
const MotionCol = motion.create(ColWrapper, {forwardMotionProps: true});
const motionColConfig: MotionProps = {
    initial: {opacity: 0},
    animate: {opacity: 1},
    exit: {opacity: 0},
    transition: {duration: 0.3}
}

const MotionRow = motion.create(Row);
const motionRowConfig: MotionProps = {
    initial: {x: "-100%"},
    animate: {x: 0},
    exit: {x: "-100%"},
    transition: {duration: 0.3}
}

const HeaderAdmin = (): JSX.Element => {
    const navigate = useNavigate();
    const location = useLocation();
    const {logoutContext} = useContext(UserContext);
    const [width, setWidth] = useState<number>(window.innerWidth);
    const [showMenu, setShowMenu] = useState<boolean>(false);
    const [indexOfItem, setIndexOfItem] = useState<number>(0);
    const [showChange, setShowChange] = useState<boolean>(false);

    const itemMenu: {label: string, path: string, icon: any}[] = [
        {label: "Tài khoản", path: "/admin/home", icon: UsersRound},
        {label: "Đổi mật khẩu", path: "/admin/home", icon: KeyRound},
        {label: "Đăng xuất", path: "/", icon: LogOut}
    ]

    useEffect(() => {
        const handleResize = () => {
            setWidth(window.innerWidth);
            if (window.innerWidth >= 800) {
                setShowMenu(false);
            }
        }
        window.addEventListener("resize", handleResize);

        return () => {
            window.removeEventListener("resize", handleResize)
        }
    }, [])

    useEffect(() => {
        if (showMenu) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "auto";
        }
    }, [showMenu])

    useEffect(() => {
        const path = location.pathname;
        if (path == itemMenu[0].path) {
            setIndexOfItem(0)
        } else if (path == itemMenu[1].path) {
            setIndexOfItem(1);
        } else {
            setIndexOfItem(-1);
        }
    }, [])

    return(
        <>
            <Row className="header-employee-container">
                {
                    width < 800 && (
                        <>
                            <AnimatePresence mode="wait">
                                {
                                    showMenu ? (
                                        <MotionCol 
                                            {...motionColConfig} 
                                            key="show" 
                                            style={{
                                                display: "flex",
                                                flexDirection: "column",
                                                justifyContent: "center",
                                                alignItems: "start",
                                                height: "100%",
                                                paddingLeft: "10px",
                                            }}
                                        >
                                            <X className="close-icon" size={35} strokeWidth={1} onClick={() => {setShowMenu(false)}}/>
                                        </MotionCol>
                                    ) : (
                                        <MotionCol
                                            {...motionColConfig}
                                            key="not-show"
                                            style={{
                                                display: "flex",
                                                flexDirection: "column",
                                                justifyContent: "center",
                                                alignItems: "start",
                                                gap: "10px",
                                                height: "100%",
                                                paddingLeft: "30px",
                                                cursor: "pointer"
                                            }}
                                            onClick={() => {
                                                setShowMenu(true);
                                            }}
                                        >
                                            <span className="menu-icon"></span>
                                            <span className="menu-icon"></span>
                                            <span className="menu-icon"></span>
                                        </MotionCol>
                                    )
                                }
                            </AnimatePresence>
                        </>
                    )
                }
            </Row>
            <Row className="menu-outlet-container">
                {
                    width >= 800 && (
                        <Col span={6} style={{display: "flex", justifyContent: "center", alignItems: "center", height: "fit-content"}}>
                            <div className="menu-static">
                                {
                                    itemMenu.map((item, index) => (
                                        <div 
                                            key={index}
                                            className={`menu-item ${indexOfItem == index ? "menu-item-active" : ""}`}
                                            onClick={() => {
                                                navigate(item.path);
                                                setIndexOfItem(index);
                                                
                                                if (index == 1) {
                                                    setShowChange(true);
                                                } else if (index == 2) {
                                                    logoutContext()
                                                }
                                            }}
                                        >
                                            <item.icon size={22} strokeWidth={1} />
                                            <div className="menu-item-name">{item.label}</div>
                                        </div>
                                    ))
                                }
                            </div>
                        </Col>
                    )
                }
                <Col span={width < 800 ? 24 : 18} style={{display: "flex", justifyContent: "center", alignItems: "center"}}>
                    <div className="outlet page-container">{<Outlet />}</div>
                </Col>
            </Row>
            <AnimatePresence mode="wait">
                {
                    width < 800 && showMenu && (
                        <MotionRow
                            {...motionRowConfig}
                            key="dynamic"
                            className="menu-dynamic"
                        >
                            <Col span={24} className="menu-item-wrapper">
                                {
                                    itemMenu.map((item, index) => (
                                        <div 
                                            key={index}
                                            className={`menu-item ${indexOfItem == index ? "menu-item-active" : ""}`}
                                            onClick={() => {
                                                navigate(item.path);
                                                setIndexOfItem(index);
                                                setShowMenu(false);

                                                if (index == 1) {
                                                    setShowChange(true);
                                                } else if (index == 2) {
                                                    logoutContext()
                                                }
                                            }}
                                        >
                                            <item.icon size={22} strokeWidth={1} />
                                            <div className="menu-item-name">{item.label}</div>
                                        </div>
                                    ))
                                }
                            </Col>
                        </MotionRow>
                    )
                }
            </AnimatePresence>
            <ChangePasswordModal 
                open={showChange}
                setOpen={setShowChange}
            />
        </>
    )
}

export default HeaderAdmin;
import { useContext, useState, type ChangeEvent, type JSX, type KeyboardEvent } from "react";
import "./Login.scss";
import { useNavigate } from "react-router-dom";
import appService from "../../services/appService";
import { UserContext, type UserType } from "../../configs/globalVariable";
import Loading from "./Loading";
import { Row, Col, Input, Checkbox, Button } from "antd";
import { messageService, type BackendResponse } from "../../interfaces/appInterface";

const Login = (): JSX.Element => {
    const {loginContext} = useContext(UserContext);
    const navigate = useNavigate();
    const [username, setUsername] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [showPassword, setShowPassword] = useState<boolean>(false);
    const [hasValidate, setHasValidate] = useState<boolean[]>([false, false]);
    const [loginLoading, setLoginLoading] = useState<boolean>(false);

    const checkValidate = (): boolean => {
        let newArray = [...hasValidate];
        if (username.length == 0) {
            newArray[0] = true;
        }
        if (password.length == 0) {
            newArray[1] = true;
        }
        setHasValidate(newArray);
        for (let i = 0; i < newArray.length; i++) {
            if (newArray[i]) {
                messageService.error("Nhập đầy đủ thông tin đăng nhập")
                return false;
            }
        }
        return true;
    }

    const setSessionKey = (value: string, ttl: number) => {
        const item = {
            value: value,
            expiry: Date.now() + 1000 * 60 * 60 * 24 * ttl
        };

        localStorage.setItem("sessionKey", JSON.stringify(item));
    }

    const handleLogin = async (): Promise<void> => {
        if (checkValidate()) {
            setLoginLoading(true);
            try {
                const result: BackendResponse = await appService.loginApi(username, password);
                if (result.code == 0) {
                    const userData: UserType = {
                        isAuthenticated: true,
                        accountId: result.data.id,
                        roleId: result.data.roleId
                    }
                    loginContext(userData);
                    setSessionKey(result.data.sessionKey, 30);
                    if (result.data.roleId == 1) {
                        navigate("/admin/home");
                    } else {
                        navigate("/employee/home");
                    }
                    messageService.success("Đăng nhập thành công");
                } else {
                    messageService.error(result.message);
                }
            } catch(e) {
                console.log(e);
                messageService.error("Xảy ra lỗi ở server")
            } finally {
                setLoginLoading(false);
            }
        }
    }

    const loginByEnter = (event: KeyboardEvent<HTMLInputElement>) => {
        if (event.key == "Enter") {
            handleLogin();
        }
    }

    return(
        <>
            <Row className="login-container">
                <Col 
                    className="first-block px-4 py-5"
                    xs={20} sm={16} md={16} lg={10}
                >
                    <Row 
                        gutter={[0, 10]}
                        align="middle"
                        justify="center"
                    >
                        <Col xs={24}>
                            <div className="title pb-3">Đăng Nhập</div>
                        </Col> 
                        {/* Input, button */}
                        <Col xs={24}>
                            <Row gutter={[0, 16]}>
                                <Col xs={24}>
                                    <Row gutter={[0, 10]}>
                                        <Col xs={24}>  
                                            <label htmlFor="username">Tên đăng nhập <span className="text-danger">*</span></label>
                                        </Col>
                                        <Col xs={24}>
                                            <Input 
                                                className="input-ant"
                                                id="username" 
                                                status={`${hasValidate[0] ? "error" : ""}`} 
                                                value={username}
                                                onChange={(event: ChangeEvent<HTMLInputElement>): void => {
                                                    setUsername(event.target.value);
                                                    let newArray = [...hasValidate];
                                                    newArray[0] = false;
                                                    setHasValidate(newArray);
                                                }}
                                            />
                                        </Col>
                                    </Row>
                                </Col>
                                <Col xs={24}>
                                    <Row gutter={[0, 10]}>
                                        <Col xs={24}>  
                                            <label htmlFor="password">Mật khẩu <span className="text-danger">*</span></label>
                                        </Col>
                                        <Col xs={24}>
                                            <Input
                                                className="input-ant"
                                                type={`${showPassword ? "text" : "password"}`}
                                                id="password" 
                                                value={password}
                                                status={`${hasValidate[1] ? "error" : ""}`}
                                                onChange={(event: ChangeEvent<HTMLInputElement>): void => {
                                                    setPassword(event.target.value);
                                                    let newArray = [...hasValidate];
                                                    newArray[1] = false;
                                                    setHasValidate(newArray);
                                                }}
                                                onKeyDown={(event: KeyboardEvent<HTMLInputElement>) => {loginByEnter(event)}}
                                            />
                                        </Col>
                                        <Col xs={24}>
                                            <Checkbox 
                                                onChange={(event) => {setShowPassword(event.target.checked)}}
                                                className="pb-3"
                                            >
                                                Hiện mật khẩu
                                            </Checkbox>
                                        </Col>
                                    </Row>
                                </Col>
                                <Col xs={24}>
                                    <Button 
                                        className="btn-login" 
                                        type="primary" 
                                        size={"large"}
                                        onClick={(): void => {handleLogin()}}
                                    >
                                        Đăng nhập
                                    </Button>
                                </Col>
                            </Row>
                        </Col>
                    </Row>
                </Col>
            </Row>
            {loginLoading &&
                <Loading />
            }
        </>
    );
};

export default Login;
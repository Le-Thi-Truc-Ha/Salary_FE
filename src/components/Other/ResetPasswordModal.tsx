import { Col, Input, Modal, Row } from "antd";
import { useState, type ChangeEvent, type Dispatch, type JSX, type SetStateAction } from "react";
import { messageService } from "../../interfaces/appInterface";
import LoadingModal from "./LoadingModal";
import { resetPasswordApi } from "../../services/adminService";

interface ResetPasswordModalProps {
    open: boolean,
    setOpen: Dispatch<SetStateAction<boolean>>,
    employeeId: number
}

const ResetPasswordModal = ({open, setOpen, employeeId}: ResetPasswordModalProps): JSX.Element => {
    const [hasValidate, setHasValidate] = useState<boolean>(false);
    const [newPassword, setNewPassword] = useState<string>("");
    const [resetLoading, setResetLoading] = useState<boolean>(false);

    const handleOk = async () => {
        if (newPassword.length >= 8) {
            setResetLoading(true);
            try {
                const result = await resetPasswordApi(employeeId, newPassword);
                if (result.code == 0) {
                    messageService.success(result.message);
                    handleCancel();
                } else {
                    messageService.error(result.message);
                }
            } catch(e) {
                console.log(e);
                messageService.error("Xảy ra lỗi ở server");
            } finally {
                setResetLoading(false);
            }
        } else {
            setHasValidate(true);
            messageService.error("Mật khẩu phải có tối thiểu 8 kí tự");
        }
    }

    const handleCancel = () => {
        setOpen(false);
        setHasValidate(false);
        setNewPassword("");
    }

    return(
        <>
            <Modal
                title={<span style={{fontFamily: "Quicksand", fontSize: "20px"}}>Đặt lại mật khẩu</span>}
                closable={true}
                open={open}
                onOk={() => {handleOk()}}
                onCancel={() => {handleCancel()}}
                okText="Xác nhận"
                cancelText="Hủy"
                centered={true}
                okButtonProps={{size: "large"}}
                cancelButtonProps={{size: "large"}}
                maskClosable={false}
            >
                <Row className="py-3">
                    <Col span={24} style={{display: "flex", gap: "10px", alignItems: "center"}}>
                        <label htmlFor="password" style={{width: "fit-content", whiteSpace: "nowrap"}}>Mật khẩu mới:</label>
                        <Input 
                            className="input-ant"
                            id="password" 
                            status={`${hasValidate ? "error" : ""}`} 
                            value={newPassword}
                            onChange={(event: ChangeEvent<HTMLInputElement>): void => {
                                setNewPassword(event.target.value);
                                setHasValidate(false);
                            }}
                        />
                    </Col>
                </Row>
            </Modal>
            <LoadingModal 
                message="Đang xử lý"
                open={resetLoading}
            />
        </>
    )
}

export default ResetPasswordModal;
import { Col, Input, Modal, Row } from "antd";
import { useState, type ChangeEvent, type Dispatch, type JSX, type SetStateAction } from "react";
import { messageService } from "../../interfaces/appInterface";
import { createEmployeeApi } from "../../services/adminService";
import type { EmployeeTable } from "../../interfaces/adminInterface";
import LoadingModal from "./LoadingModal";

interface AddAccountModalProps {
    open: boolean,
    setOpen: Dispatch<SetStateAction<boolean>>,
    setEmployeeList: Dispatch<SetStateAction<EmployeeTable[]>>
}

const AddAccountModal = ({open, setOpen, setEmployeeList}: AddAccountModalProps): JSX.Element => {
    const [name, setName] = useState<string>("");
    const [hasValidate, setHasValidate] = useState<boolean>(false);
    const [createEmployeeLoading, setCreateEmployeeLoading] = useState<boolean>(false);

    const handleOk = async () => {
        if (name.length != 0) {
            setCreateEmployeeLoading(true);
            try {
                const result = await createEmployeeApi(name);
                if (result.code == 0) {
                    const newItem = result.data;
                    messageService.success(result.message);
                    setEmployeeList((prev) => (
                        [
                            {
                                key: prev.length.toString(),
                                id: newItem.id,
                                username: newItem.username,
                                name: newItem.fullName
                            },
                            ...prev
                        ]
                    ))
                    handleCancel();
                }
            } catch(e) {
                console.log(e);
                messageService.error("Xảy ra lỗi ở server")
            } finally {
                setCreateEmployeeLoading(false);
            }
        } else {
            setHasValidate(true);
            messageService.error("Nhập đầy đủ thông tin");
        }
    }

    const handleCancel = () => {
        setOpen(false);
        setName("");
        setHasValidate(false);
    }

    return(
        <>
            <Modal
                title={<span style={{fontFamily: "Quicksand", fontSize: "20px"}}>Thêm tài khoản</span>}
                closable={true}
                open={open}
                onOk={() => {handleOk()}}
                onCancel={() => {handleCancel()}}
                okText="Thêm"
                cancelText="Hủy"
                centered={true}
                okButtonProps={{size: "large"}}
                cancelButtonProps={{size: "large"}}
                maskClosable={false}
            >
                <Row className="py-3">
                    <Col span={24} style={{display: "flex", gap: "10px", alignItems: "center"}}>
                        <label htmlFor="name" style={{width: "fit-content", whiteSpace: "nowrap"}}>Tên nhân viên:</label>
                        <Input 
                            className="input-ant"
                            id="name" 
                            status={`${hasValidate ? "error" : ""}`} 
                            value={name}
                            onChange={(event: ChangeEvent<HTMLInputElement>): void => {
                                setName(event.target.value);
                                setHasValidate(false);
                            }}
                        />
                    </Col>
                </Row>
            </Modal>
            <LoadingModal 
                message="Đang xử lý"
                open={createEmployeeLoading}
            />
        </>
    )
}

export default AddAccountModal;
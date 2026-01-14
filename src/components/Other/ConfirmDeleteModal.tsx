import { Col, Modal, Row } from "antd";
import { useState, type Dispatch, type JSX, type SetStateAction } from "react";
import { messageService } from "../../interfaces/appInterface";
import LoadingModal from "./LoadingModal";
import { deleteEmployeeApi } from "../../services/adminService";
import type { EmployeeTable } from "../../interfaces/adminInterface";

interface ConfirmDeleteModalProps {
    open: boolean,
    setOpen: Dispatch<SetStateAction<boolean>>,
    employeeId: number,
    employeeName: string,
    setEmployeeList: Dispatch<SetStateAction<EmployeeTable[]>>
}

const ConfirmDeleteModal = ({open, setOpen, employeeId, employeeName, setEmployeeList}: ConfirmDeleteModalProps): JSX.Element => {
    const [deleteLoading, setDeleteLoading] = useState<boolean>(false);

    const handleOk = async () => {
        setDeleteLoading(true);
        try {
            const result = await deleteEmployeeApi(employeeId);
            if (result.code == 0) {
                messageService.success(result.message);
                handleCancel();
                setEmployeeList((prev) => (prev.filter((item) => (item.id != employeeId))))
            } else {
                messageService.error(result.message);
            }
        } catch(e) {
            console.log(e);
            messageService.error("Xảy ra lỗi ở server");
        } finally {
            setDeleteLoading(false);
        }
    }

    const handleCancel = () => {
        setOpen(false);
    }
    return(
        <>
            <Modal
                title={<span style={{fontFamily: "Quicksand", fontSize: "20px"}}>Xác nhận xóa tài khoản</span>}
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
                    <Col span={24} style={{display: "flex"}}>
                        <div>{`Chắc chắn xóa tài khoản của ${employeeName}?`}</div>
                    </Col>
                </Row>
            </Modal>
            <LoadingModal 
                message="Đang xử lý"
                open={deleteLoading}
            />
        </>
    )
}

export default ConfirmDeleteModal;
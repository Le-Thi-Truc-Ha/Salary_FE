import { Button, Col, Row, Table, type TableProps } from "antd";
import { BriefcaseBusiness, KeyRound, Trash } from "lucide-react";
import { useEffect, useState, type JSX } from "react";
import { useNavigate } from "react-router-dom";
import { messageService } from "../../interfaces/appInterface";
import AddAccountModal from "../Other/AddAccountModal";
import { getEmployeeApi } from "../../services/adminService";
import type { EmployeeTable } from "../../interfaces/adminInterface";
import ResetPasswordModal from "../Other/ResetPasswordModal";
import ConfirmDeleteModal from "../Other/ConfirmDeleteModal";

const HomeAdmin = (): JSX.Element => {
    const navigate = useNavigate();

    const [employeeList, setEmployeeList] = useState<EmployeeTable[]>([]);
    const [getEmployeeLoading, setGetEmployeeLoading] = useState<boolean>(false);
    const [openAdd, setOpenAdd] = useState<boolean>(false);
    const [openReset, setOpenReset] = useState<boolean>(false);
    const [openDelete, setOpenDelete] = useState<boolean>(false);
    const [employeeSelect, setEmployeeSelect] = useState<number>(0);
    const [employeeName, setEmployeeName] = useState<string>("");

    const columns: TableProps<EmployeeTable>["columns"] = [
        {
            title: "STT",
            key: "stt",
            render: (_, __, index) => (
                <div>{index + 1}</div>
            ),
            align: "center"
        },
        {
            title: "Tên",
            key: "name",
            dataIndex: "name",
            align: "center"
        },
        {
            title: "Tên đăng nhập",
            key: "username",
            dataIndex: "username",
            align: "center"
        },
        {
            title: "Chức năng",
            key: "function",
            render: (_, record) => (
                <div style={{display: "flex", justifyContent: "center", gap: "15px"}}>
                    <BriefcaseBusiness
                        size={22} 
                        strokeWidth={1} 
                        style={{cursor: "pointer"}} 
                        onClick={() => {
                            navigate(`manage-shift/${record.id}`);
                        }} 
                    />
                    <KeyRound
                        size={22} 
                        strokeWidth={1} 
                        style={{cursor: "pointer"}} 
                        onClick={() => {
                            setEmployeeSelect(record.id);
                            setOpenReset(true);
                        }} 
                    />
                    <Trash
                        size={22} 
                        strokeWidth={1} 
                        style={{cursor: "pointer"}} 
                        onClick={() => {
                            setEmployeeSelect(record.id);
                            setOpenDelete(true);
                            setEmployeeName(record.name);
                        }} 
                    />
                </div>
            ),  
            align: "center"
        }
    ]

    useEffect(() => {
        if (!localStorage.getItem("sessionKey")) {
            return;
        }
        getEmployee()
    }, []);

    const processData = (rawData: any): EmployeeTable[] => {
        const result: EmployeeTable[] = rawData.map((item: any, index: number) => (
            {
                key: index.toString(),
                id: item.id,
                username: item.username,
                name: item.fullName
            }
        ))
        return result
    }

    const getEmployee = async (): Promise<void> => {
        setGetEmployeeLoading(true);
        try {
            const result = await getEmployeeApi();
            if (result.code == 0) {
                setEmployeeList(processData(result.data));
            } else {
                messageService.error(result.message);
            }
        } catch(e) {
            console.log(e);
            messageService.error("Xảy ra lỗi ở server");
        } finally {
            setGetEmployeeLoading(false);
        }
    }

    return(
        <>
            <Row gutter={[0, 24]}>
                <Col span={24}>
                    <div style={{textAlign: "center", fontSize: "30px", cursor: "default"}}>Danh Sách Tài Khoản</div>
                </Col>
                <Col span={24}>
                    <Table<EmployeeTable>
                        columns={columns}
                        dataSource={employeeList} 
                        loading={getEmployeeLoading} 
                        style={{cursor: "default"}}
                        pagination={false}
                        footer={() => (
                            <div style={{display: "flex", justifyContent: "end"}}>
                                <Button
                                    variant="solid"
                                    color="primary"
                                    size="large"
                                    onClick={() => {
                                        setOpenAdd(true);
                                    }}
                                >
                                    Thêm tài khoản
                                </Button>
                            </div>
                        )}   
                    />
                </Col>
            </Row>
            <AddAccountModal 
                open={openAdd}
                setOpen={setOpenAdd}
                setEmployeeList={setEmployeeList}
            />
            <ResetPasswordModal 
                open={openReset}
                setOpen={setOpenReset}
                employeeId={employeeSelect}
            />
            <ConfirmDeleteModal 
                open={openDelete}
                setOpen={setOpenDelete}
                employeeId={employeeSelect}
                employeeName={employeeName}
                setEmployeeList={setEmployeeList}
            />
        </>
    )
}

export default HomeAdmin;
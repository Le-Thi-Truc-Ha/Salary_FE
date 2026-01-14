import { Col, Row, Select, Table, type TableProps } from "antd";
import { useEffect, useState, type JSX } from "react";
import { useOutletContext } from "react-router-dom";
import { messageService, type BackendResponse } from "../../interfaces/appInterface";
import type { ShiftData, ShiftTable } from "../../interfaces/employeeInterface";
import employeeService from "../../services/employeeService";
import dayjs from "dayjs";

const HomeEmployee = (): JSX.Element => {
    const yearNow = dayjs().year();
    const yearStart = 2026;

    const {state} = useOutletContext<{state: boolean}>();
    const [getShiftsLoading, setGetShiftsLoading] = useState<boolean>(false);
    const [shifts, setShifts] = useState<ShiftTable[]>([]);
    const [totalHour, setTotalHour] = useState<number>(0);
    const [month, setMonth] = useState<number>(dayjs().month() + 1);
    const [year, setYear] = useState<number>(dayjs().year());

    const columns: TableProps<ShiftTable>["columns"] = [
        {
            title: "STT",
            key: "stt",
            render: (_, __, index) => (
                <div>{index + 1}</div>
            ),
            align: "center"
        },
        {
            title: "Ngày",
            key: "date",
            dataIndex: "date",
            align: "center"
        },
        {
            title: "Vào Ca",
            key: "timeIn",
            dataIndex: "timeIn",
            align: "center"
        },
        {
            title: "Ra Ca",
            key: "timeOut",
            dataIndex: "timeOut",
            align: "center"
        }
    ]
    useEffect(() => {
        getShifts();
    }, [state, month, year]);

    const applyData = (list: ShiftData[]) => {
        setShifts(list.map((item, index) => (
            {
                key: index.toString(),
                id: item.id,
                date: dayjs(item.timeIn).format("DD/MM/YYYY"),
                timeIn: dayjs(item.timeIn).format("HH:mm"),
                timeOut: item.timeOut ? dayjs(item.timeOut).format("HH:mm") : "-"
            }
        )))
    }

    const getShifts = async (): Promise<void> => {
        setGetShiftsLoading(true);
        try {
            const result: BackendResponse = await employeeService.getShiftsApi(month, year);
            if (result.code == 0) {
                applyData(result.data.shifts);
                setTotalHour(Math.round(result.data.total * 100) / 100);
            } else {
                applyData([]);
            }
        } catch(e) {
            console.log(e);
            messageService.error("Xảy ra lỗi ở server");
        } finally {
            setGetShiftsLoading(false);
        }
    }

    return (
        <>
            <Row gutter={[0, 24]}>
                <Col span={24}>
                    <div style={{textAlign: "center", fontSize: "30px", cursor: "default"}}>Danh Sách Ca Làm</div>
                </Col>
                <Col span={24}>
                    <Row gutter={[20, 0]}>
                        <Col xs={12} sm={5} md={5}>
                            <Select
                                value={month}
                                style={{width: "100%", height: "34.74px"}}
                                options={Array.from({length: 12}, (_, index) => (
                                    {value: index + 1, label: `Tháng ${index + 1}`}
                                ))}
                                onChange={(value: number) => {
                                    setMonth(value);
                                }}
                            />
                        </Col>
                        <Col xs={12} sm={6} md={5}>
                            <Select
                                value={year}
                                style={{width: "100%", height: "34.74px"}}
                                options={Array.from({length: yearNow - yearStart + 1}, (_, index) => (
                                    {value: index + yearStart, label: `Năm ${index + yearStart}`}
                                ))}
                                onChange={(value: number) => {
                                    setYear(value);
                                }}
                            />
                        </Col>
                    </Row>
                </Col>
                <Col span={24}>
                    <Table<ShiftTable> 
                        style={{cursor: "default"}}
                        columns={columns} 
                        dataSource={shifts}
                        loading={getShiftsLoading} 
                        pagination={false}  
                        summary={() => (
                            <Table.Summary.Row>
                                <Table.Summary.Cell index={0} colSpan={2} align="center">
                                    <strong>Tổng giờ:</strong>
                                </Table.Summary.Cell>
                                <Table.Summary.Cell index={2} colSpan={2} align="center">
                                    <strong>{`${totalHour}h`}</strong>
                                </Table.Summary.Cell>
                            </Table.Summary.Row>
                        )}
                    />
                </Col>
            </Row>
        </>
    )
}

export default HomeEmployee;
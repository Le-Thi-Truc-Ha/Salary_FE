import { useEffect, useState, type JSX } from "react";
import type { UpdateShiftModalProps } from "../../interfaces/adminInterface";
import { Col, DatePicker, Modal, Row, TimePicker } from "antd";
import dayjs, { Dayjs } from "dayjs";
import { messageService } from "../../interfaces/appInterface";
import { updateShiftApi } from "../../services/adminService";
import LoadingModal from "../Other/LoadingModal";

const UpdateShiftModal = ({open, setOpen, shiftId, dateProp, timeIn, timeOut, setShifts, setTotalHour}: UpdateShiftModalProps): JSX.Element => {
    const [newDate, setNewDate] = useState<Dayjs>(dayjs());
    const [newTimeIn, setNewTimeIn] = useState<Dayjs>(dayjs());
    const [newTimeOut, setNewTimeOut] = useState<Dayjs | null>(null);
    const [updateLoading, setUpdateLoading] = useState<boolean>(false);

    useEffect(() => {
        if (open) {
            setNewDate(dayjs(dateProp));
            setNewTimeIn(dayjs(timeIn));
            setNewTimeOut(timeOut ? dayjs(timeOut) : null);
        }
    }, [open]);

    const handleOk = async () => {
        setUpdateLoading(true);
        try {
            const result = await updateShiftApi(shiftId, newTimeIn.toISOString(), newTimeOut ? newTimeOut.toISOString() : null);
            if (result.code == 0) {
                messageService.success(result.message);
                handleCancel();

                const diffMs = newTimeOut ? newTimeOut.diff(newTimeIn) / (1000 * 60 * 60) : null;
                const newTime = diffMs ? (Math.round(diffMs * 100) / 100) : null

                let oldTime: number | null = null;

                setShifts((prev) => (
                    prev.map((item) => {
                        if (item.id == shiftId) {
                            oldTime = item.time;
                            return ({
                                ...item, 
                                date: newTimeIn, 
                                timeIn: newTimeIn, 
                                timeOut: newTimeOut, 
                                time: newTime
                            })
                        } else {
                            return item;
                        }
                    })
                ))

                setTotalHour((prev) => {
                    let result = prev;
                    if (oldTime) {
                        result -= oldTime;
                    }
                    if (newTime) {
                        result += newTime;
                    }
                    return Math.round(result * 100) / 100;
                })
            } else {
                messageService.error(result.message);
            }
        } catch(e) {
            console.log(e);
            messageService.error("Xảy ra lỗi ở server");
        } finally {
            setUpdateLoading(false);
        }
    }

    const handleCancel = () => {
        setOpen(false);
        setNewDate(dayjs(dateProp));
        setNewTimeIn(dayjs(timeIn));
        setNewTimeOut(dayjs(timeOut));
    }
    return(
        <>
            <Modal
                title={<span style={{fontFamily: "Quicksand", fontSize: "20px"}}>Sửa ca làm</span>}
                closable={true}
                open={open}
                onOk={() => {handleOk()}}
                onCancel={() => {handleCancel()}}
                okText="Lưu"
                cancelText="Hủy"
                okButtonProps={{size: "large"}}
                cancelButtonProps={{size: "large"}}
                centered={true}
                maskClosable={false}
            >
                <Row className="py-2" gutter={[25, 20]}>
                    <Col xs={24} md={12}>
                        <Row style={{display: "flex", alignItems: "center", gap: "12px"}}>
                            <Col style={{width: "fit-content"}}>
                                <label htmlFor="date">Ngày:</label>
                            </Col>
                            <Col flex="1">
                                <DatePicker
                                    id="date"
                                    value={newDate}
                                    size="large"
                                    style={{width: "100%"}}
                                    format={"DD/MM/YYYY"}
                                    onChange={(date, dateString) => {
                                        if (date) {
                                            setNewDate(date);
                                        } else {
                                            setNewDate(dayjs(dateProp));
                                        }
                                    }}
                                />
                            </Col>
                        </Row>
                    </Col>
                    <Col xs={24} md={12}>
                        <Row style={{display: "flex", alignItems: "center", gap: "12px"}}>
                            <Col style={{width: "fit-content"}}>
                                <label htmlFor="timeIn">Vào ca:</label>
                            </Col>
                            <Col flex="1">
                                <TimePicker
                                    id="timeIn"
                                    value={newTimeIn}
                                    size="large"
                                    style={{width: "100%"}}
                                    format={"HH:mm"}
                                    onChange={(time, timeString) => {
                                        if (time) {
                                            const baseDate = newDate ?? dayjs();
                                            const mergeDateTime = baseDate.hour(time.hour()).minute(time.minute()).second(0);
                                            setNewTimeIn(mergeDateTime);
                                        } else {
                                            setNewTimeIn(dayjs(timeIn))
                                        }
                                    }}
                                />
                            </Col>
                        </Row>
                    </Col>
                    <Col xs={24} md={12}>
                        <Row style={{display: "flex", alignItems: "center", gap: "12px"}}>
                            <Col style={{width: "fit-content"}}>
                                <label htmlFor="timeOut">Ra ca:</label>
                            </Col>
                            <Col flex="1">
                                <TimePicker
                                    placeholder="Chọn giờ ra ca"
                                    id="timeOut"
                                    value={newTimeOut}
                                    size="large"
                                    style={{width: "100%"}}
                                    format={"HH:mm"}
                                    onChange={(time, timeString) => {
                                        if (time) {
                                            const baseDate = newDate ?? dayjs();
                                            const mergeDateTime = baseDate.hour(time.hour()).minute(time.minute()).second(0);
                                            setNewTimeOut(mergeDateTime);
                                        } else {
                                            if (timeOut) {
                                                setNewTimeOut(dayjs(timeOut))
                                            }
                                        }
                                    }}
                                />
                            </Col>
                        </Row>
                    </Col>
                </Row>
            </Modal>
            <LoadingModal 
                open={updateLoading}
                message="Đang cập nhật"
            />
        </>
    )
}

export default UpdateShiftModal;
import React, { Fragment, useState, useRef } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { Button, Table, Modal } from "react-bootstrap";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import moment from "moment";
import { useParams } from "react-router-dom";
import { useEffect } from "react";
import { loadUser } from "../../actions/master";
import axios from "axios";
import Select2 from "../../components/Select2";
import { FaFilePdf, FaFileExcel } from "react-icons/fa";
import { PDFDownloadLink, Page, Text, View, Document, StyleSheet } from "@react-pdf/renderer";
import ExcelJS from "exceljs";
import jsPDF from 'jspdf';

const AbsensiReportList = ({ master, data, loadUser, user }) => {
    let { id } = useParams();
    const url = "Report/ReportAbsensi";
    const [formData, setFormData] = useState({
        nama: "",
        nik: "",
        userID: 0,
        posisi: "",
        bulan: "",
        kerja: 0,
        libur: 0,
        totalKerja: "",
        periode: ""
    });

    const { nama, nik, userID, posisi, bulan, kerja, libur, totalKerja, periode } = formData;
    const [result, setResult] = useState(null);
    const [userList, setUserList] = useState(null);
    const [showPDFModal, setShowPDFModal] = useState(false);
    const tableRef = useRef(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);

    useEffect(() => {
        if (data !== undefined && data !== null && id !== undefined) {
            if (data.module !== url) return;
            if (data.data !== undefined && data.data !== null) {
                setFormData({
                    ...formData,
                    id: id === undefined ? 0 : parseInt(id),
                    userID: data.data.userID,
                    nama: data.data.nama,
                    nik: data.data.nik,
                    posisi: data.data.posisi,
                    kerja: data.data.kerja,
                    libur: data.data.libur,
                    totalKerja: data.data.totalKerja,
                    periode: data.data.periode
                });
            }
        }
    }, [id, data, setFormData]);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await axios.get("/User");
                const filteredUsers = response.data.data.filter(user => !user.isAdmin);
                setUserList(filteredUsers);
            } catch (error) {
                console.error("Error fetching users:", error);
            }
        };

        fetchUsers();
    }, []);

    const onSelectChange = (selectedOption) => {
        setFormData({ ...formData, userID: selectedOption.userID });
    };

    const handleRun = async (e) => {
        e.preventDefault();
        try {
            const tahunValue = document.querySelector('input[name="tahun"]').value;
            const url = `/Report/ReportAbsensi?userID=${formData.userID}&bulan=${bulan}&tahun=${tahunValue}`;

            const response = await axios.get(url);

            setResult(response.data);

            setFormData({
                ...formData,
                kerja: response.data.data.kerja,
                totalKerja: response.data.data.totalKerja,
                nama: response.data.data.nama,
                nik: response.data.data.nik,
                posisi: response.data.data.posisi,
                bulan: response.data.data.periode,
                periode: response.data.data.periode
            });
        } catch (error) {
            console.error("Error:", error);
        }
    };


    const handlePDFDownload = () => {
        const doc = (
            <Document>
                <Page size="A4">
                    <View>
                        <Text style={styles.headerTitle}>Laporan Absensi Bulanan</Text>
                        <Text style={[styles.columnRow, styles.columnName]}>Nama: {nama}</Text>
                        <Text style={styles.columnRow}>NIK: {nik}</Text>
                        <Text style={styles.columnRow}>Posisi: {posisi}</Text>
                        <Text style={styles.columnRow}>Periode: {bulan}</Text>
                        <Text style={[styles.columnRow, styles.columnTotalKehadiran]}>Total Kehadiran: {totalKerja}</Text>
                        <Table style={styles.table}>
                            <View style={styles.tableRow}>
                                <Text style={[styles.columnHeader, styles.noColumn]}>No</Text>
                                <Text style={styles.columnHeader}>Hari/Tanggal</Text>
                                <Text style={styles.columnHeader}>Clock In</Text>
                                <Text style={styles.columnHeader}>Clock Out</Text>
                                <Text style={styles.columnHeader}>Status</Text>
                                <Text style={styles.columnHeader}>Shift</Text>
                            </View>
                            {result && result?.data?.vReportAbsensiLists.map((item, index) => (
                                <View key={index} style={styles.tableRow}>
                                    <Text style={[styles.column, styles.noColumn]}>{index + 1}</Text>
                                    <Text style={styles.column}>{item.hariTanggal}</Text>
                                    <Text style={styles.column}>{item.in}</Text>
                                    <Text style={styles.column}>{item.out}</Text>
                                    <Text style={styles.column}>{item.status}</Text>
                                    <Text style={styles.column}>{item.shift}</Text>
                                </View>
                            ))}
                            {/* <View style={styles.signatureContainer}>
                                <Text style={styles.signatureText}>Approved By,</Text>
                                <Text style={styles.signatureBlank}></Text>
                            </View> */}
                        </Table>
                        {/* <Text>Total Kehadiran: {kerja}</Text> */}
                    </View>
                </Page>
            </Document>
        );

        const fileName = `reportAbsensiPerBulan-${nama}-${periode}.pdf`;

        return (
            <PDFDownloadLink document={doc} fileName={fileName}>
                {({ blob, url, loading, error }) => (
                    <Button disabled={loading}>
                        <FaFilePdf />
                        {loading ? ' Generating PDF...' : ' Download PDF'}
                    </Button>
                )}
            </PDFDownloadLink>
        );
    };

    const styles = StyleSheet.create({
        columnTotalKehadiran: {
            marginBottom: 20
        },
        table: {
            marginLeft: 26,
            marginRight: 26,
        },
        headerTitle: {
            textAlign: "center",
            marginTop: 30,
            fontWeight: 'bold'
        },
        tableRow: {
            flexDirection: "row",
            borderBottomWidth: 1,
            borderColor: "#000",
            alignItems: "center",
            textAlign: "center",
            fontSize: 12,
            borderRightWidth: 1,
            borderLeftWidth: 1,
        },
        columnHeader: {
            flex: 1,
            fontWeight: "bold",
            // borderRightWidth: 1,
            borderColor: "#000",
            paddingVertical: 4,
            borderTopWidth: 1,
            // marginTop: 20,
            backgroundColor: "#0087e8",
            color: "#ffff"
        },
        columnRow: {
            fontSize: 12,
            marginTop: 12,
            marginLeft: 24,
        },
        columnName: {
            marginTop: 28,
        },
        column: {
            flex: 1,
            // borderRightWidth: 1,
            borderColor: "#000",
            paddingVertical: 4,
        },
        noColumn: {
            // borderLeftWidth: 1,
            flex: 0.5
        },
        signatureContainer: {
            position: "absolute",
            bottom: -320,
            right: 30,
        },
        signatureText: {
            fontSize: 12,
            fontWeight: "bold",
            textAlign: "right",
        },
        signatureBlank: {
            fontSize: 12,
            borderBottomWidth: 1,
            width: 100,
            textAlign: "right",
            marginTop: 47
        },
    });



    const generateExcel = () => {
        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet('Report');

        const titleCell = worksheet.getCell('I1');
        titleCell.value = 'Laporan Absensi Bulanan';
        titleCell.font = { size: 16, bold: true };
        titleCell.alignment = { vertical: 'middle', horizontal: 'center' };
        titleCell.border = {};
        worksheet.mergeCells('I1:I2');
        worksheet.getColumn('I').width = 34;

        worksheet.getCell('B4').value = "Nama:";
        worksheet.getCell('C4').value = nama;
        worksheet.getCell('B5').value = "NIK:";
        worksheet.getCell('C5').value = nik;
        worksheet.getCell('B6').value = "Posisi:";
        worksheet.getCell('C6').value = posisi;
        worksheet.getCell('B7').value = "Bulan:";
        worksheet.getCell('C7').value = bulan;
        worksheet.getCell('B8').value = "Total Kehadiran:";
        worksheet.getCell('C8').value = totalKerja;

        worksheet.getColumn('C').width = 19;
        worksheet.getColumn('B').width = 13;

        worksheet.getRow(2).height = 30;

        const tableHeader = ['No', 'Hari/Tanggal', 'Clock In', 'Clock Out', 'Status', 'Shift'];
        const headerRow = worksheet.getRow(10);
        tableHeader.forEach((header, index) => {
            const cell = headerRow.getCell(index + 2);
            cell.value = header;
            cell.font = { bold: true, color: { argb: 'ffffffff' } };
            cell.alignment = { vertical: 'middle', horizontal: 'center' };
            cell.border = { top: { style: 'thin' }, bottom: { style: 'thin' }, left: { style: 'thin' }, right: { style: 'thin' } };
            cell.fill = {
                type: 'pattern',
                pattern: 'solid',
                fgColor: { argb: 'FF0087E8' },
            };

        });

        let rowIndex = 11;
        result.data.vReportAbsensiLists.forEach((item, index) => {
            const rowData = [index + 1, item.hariTanggal, item.in, item.out, item.status, item.shift];
            const row = worksheet.getRow(rowIndex++);
            rowData.forEach((data, i) => {
                const cell = row.getCell(i + 2);
                cell.value = data;
                cell.alignment = { vertical: 'middle', horizontal: 'center' };
                cell.border = { top: { style: 'thin' }, bottom: { style: 'thin' }, left: { style: 'thin' }, right: { style: 'thin' } };
            });
        });


        // worksheet.mergeCells(`D${rowIndex}:E${rowIndex}`);
        // const totalAttendanceCell = worksheet.getCell(`D${rowIndex}`);
        // totalAttendanceCell.value = 'Total Kehadiran:';
        // totalAttendanceCell.font = { bold: true };
        // totalAttendanceCell.alignment = { vertical: 'middle', horizontal: 'center' };
        // totalAttendanceCell.border = { top: { style: 'thin' }, bottom: { style: 'thin' }, left: { style: 'thin' }, right: { style: 'thin' } };
        // const formDataCell = worksheet.getCell(`F${rowIndex}`);
        // formDataCell.value = kerja;
        // formDataCell.font = { bold: true };
        // formDataCell.alignment = { vertical: 'middle', horizontal: 'center' };
        // formDataCell.border = { top: { style: 'thin' }, bottom: { style: 'thin' }, left: { style: 'thin' }, right: { style: 'thin' } };

        return workbook.xlsx.writeBuffer().then(buffer => {
            const fileName = `reportAbsensiPerBulan-${nama}-${periode}.xlsx`;
            return { buffer, fileName };
        });
    };



    const handleExcelDownload = async () => {
        try {
            const { buffer, fileName } = await generateExcel();
            const blob = new Blob([buffer], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
            const url = URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = fileName;
            a.click();
            URL.revokeObjectURL(url);
        } catch (error) {
            console.error("Error generating Excel:", error);
        }
    };

    const months = [
        { id: 1, name: "Januari" },
        { id: 2, name: "Februari" },
        { id: 3, name: "Maret" },
        { id: 4, name: "April" },
        { id: 5, name: "Mei" },
        { id: 6, name: "Juni" },
        { id: 7, name: "Juli" },
        { id: 8, name: "Agustus" },
        { id: 9, name: "September" },
        { id: 10, name: "Oktober" },
        { id: 11, name: "November" },
        { id: 12, name: "Desember" },
    ];


    const paginate = pageNumber => setCurrentPage(pageNumber);

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = result && result?.data?.vReportAbsensiLists ? result.data?.vReportAbsensiLists?.slice(indexOfFirstItem, indexOfLastItem) : [];

    const renderedItems = currentItems.map((item, index) => (
        <tr key={index}>
            <td>{indexOfFirstItem + index + 1}</td>
            <td>{item.hariTanggal}</td>
            <td>{item.in}</td>
            <td>{item.out}</td>
            <td>{item.status}</td>
            <td>{item.shift}</td>
        </tr>
    ));

    const handlePrevPage = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
        }
    };

    const handleNextPage = () => {
        if (currentPage < Math.ceil(result.data.vReportAbsensiLists.length / itemsPerPage)) {
            setCurrentPage(currentPage + 1);
        }
    };

    return (
        <Fragment>
            <div className="row mt-3">
                <div className="form-group col-sm-3 mb-2">
                    <label>Nama Karyawan</label>
                    <Select2
                        options={userList}
                        optionValue={(user) => user.userID}
                        optionLabel={(user) => user.name}
                        placeholder={"Pilih Nama Karyawan"}
                        isMulti={false}
                        handleChange={onSelectChange}
                    />

                </div>
                <div className="form-group col-sm-3 mb-2">
                    <label>Bulan</label>
                    <Select2
                        options={months}
                        optionValue={(month) => month.id}
                        optionLabel={(month) => month.name}
                        placeholder={"Pilih Bulan"}
                        isMulti={false}
                        handleChange={(selectedOption) => {
                            setFormData({ ...formData, bulan: selectedOption.id })
                        }}
                    />
                </div>
                <div className="form-group col-sm-3 mb-2">
                    <label>Tahun</label>
                    <input
                        type="number"
                        className="form-control"
                        placeholder="Tahun"
                        maxLength="4"
                        name="tahun"
                    />
                </div>
                <div style={{ marginTop: "30px" }} className="form-group col-sm-3">
                    <Button onClick={handleRun}>Buat Report</Button>
                </div>
            </div>
            {result && (
                <div>
                    <Table ref={tableRef} className="table-list mt-2" striped responsive hover>
                        <thead>
                            <tr>
                                <th>No</th>
                                <th>Hari/Tanggal</th>
                                <th>Clock In</th>
                                <th style={{ marginLeft: "20px" }}>Clock Out</th>
                                <th>Status</th>
                                <th>Shift</th>
                            </tr>
                        </thead>
                        <tbody>
                            {renderedItems}
                        </tbody>
                        <tfoot>
                            <tr>
                                <td></td>
                                <td></td>
                                <td></td>
                                <td></td>
                                <td>Total Kehadiran:</td>
                                <td>{formData.kerja}</td>
                            </tr>
                        </tfoot>
                    </Table>
                    <div>
                        <Button onClick={handlePrevPage} disabled={currentPage === 1}>Sebelumnya</Button>
                        <span style={{ marginLeft: "10px", marginRight: "10px" }}>Halaman {currentPage} dari {Math.ceil(result?.data?.vReportAbsensiLists?.length / itemsPerPage)}</span>
                        <Button onClick={handleNextPage} disabled={currentPage === Math.ceil(result?.data?.vReportAbsensiLists?.length / itemsPerPage)}>Selanjutnya</Button>
                    </div>
                    <div style={{ marginTop: "10px" }}>
                        <div style={{ display: "inline-block", marginRight: "10px" }}>
                            <Button onClick={handleExcelDownload}>
                                <FaFileExcel /> Download Excel
                            </Button>
                        </div>
                        <div style={{ display: "inline-block" }}>
                            {handlePDFDownload()}
                        </div>
                    </div>

                </div>
            )}
        </Fragment>
    );
};

AbsensiReportList.propTypes = {
    loadUser: PropTypes.func,
    user: PropTypes.object,
    master: PropTypes.object
};

const mapStateToProps = (state) => ({
    user: state.auth.user,
    data: state.data,
    master: state.master,
});

export default connect(mapStateToProps, { loadUser })(AbsensiReportList);

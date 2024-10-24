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

const CutiReportList = ({ master, data, loadUser, user }) => {
    let { id } = useParams();
    const url = "Report/ReportCuti";
    const [formData, setFormData] = useState({
        nama: "",
        userID: 0,
        posisi: "",
        bulan: "",
        periode: "",
        nik: "",
        cuti: 0,
        jatahCuti: 0,
        sisaCuti: 0
    });

    const { nama, userID, posisi, bulan, periode, nik, cuti, jatahCuti, sisaCuti } = formData;
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
                    posisi: data.data.posisi,
                    periode: data.data.periode,
                    nik: data.data.nik,
                    cuti: data.data.cuti,
                    jatahCuti: data.data.jatahCuti,
                    sisaCuti: data.data.sisaCuti
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
            const url = `/Report/ReportCuti?userID=${formData.userID}&bulan=${bulan}&tahun=${tahunValue}`;

            const response = await axios.get(url);


            setResult(response.data);

            setFormData({
                ...formData,
                nama: response.data.data.nama,
                posisi: response.data.data.posisi,
                periode: response.data.data.periode,
                nik: response.data.data.nik,
                cuti: response.data.data.cuti,
                jatahCuti: response.data.data.jatahCuti,
                sisaCuti: response.data.data.sisaCuti
                // bulan: response.data.data.periode
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
                        <Text style={styles.headerTitle}>Laporan Cuti Bulanan</Text>
                        <Text style={styles.columnRow}>Nama: {nama}</Text>
                        <Text style={styles.columnRow}>NIK: {nik}</Text>
                        <Text style={styles.columnRow}>Periode: {periode}</Text>
                        <Text style={styles.columnRow}>Jatah Cuti: {jatahCuti}</Text>
                        <Text style={styles.columnRow}>Cuti: {cuti}</Text>
                        <Text style={[styles.columnRow, styles.columnSisaCuti]}>Sisa Cuti: {sisaCuti}</Text>

                        <Table style={styles.table}>
                            <View style={styles.tableRow}>
                                <Text style={[styles.columnHeader, styles.noColumn]}>No</Text>
                                <Text style={styles.columnHeader}>Hari/Tanggal</Text>
                                <Text style={styles.columnHeader}>Keterangan</Text>
                            </View>
                            {result && result.data?.vReportCutiLists.map((item, index) => (
                                <View key={index} style={styles.tableRow}>
                                    <Text style={[styles.column, styles.noColumn]}>{index + 1}</Text>
                                    <Text style={styles.column}>{item.hariTanggal}</Text>
                                    <Text style={styles.column}>{item.description}</Text>
                                </View>
                            ))}
                        </Table>
                        {/* <Text>Total Kehadiran: {kerja}</Text> */}
                    </View>
                </Page>
            </Document>
        );
        const fileName = `reportCutiPerBulan-${nama}-${periode}.pdf`;

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
        columnSisaCuti: {
            marginBottom: 35
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
            // marginTop: 23,
            backgroundColor: "#0087e8",
            color: "#ffff"
        },
        columnRow: {
            fontSize: 12,
            marginTop: 18,
            marginLeft: 24,
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
    });



    const generateExcel = () => {
        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet('Report');

        const titleCell = worksheet.getCell('I1');
        titleCell.value = 'Laporan Cuti Bulanan';
        titleCell.font = { size: 16, bold: true };
        titleCell.alignment = { vertical: 'middle', horizontal: 'center' };
        titleCell.border = {};
        worksheet.mergeCells('I1:I2');
        worksheet.getColumn('I').width = 34;

        worksheet.getCell('B4').value = "Nama:";
        worksheet.getCell('C4').value = nama;
        worksheet.getCell('B5').value = "NIK:";
        worksheet.getCell('C5').value = nik;
        worksheet.getCell('B6').value = "Periode:";
        worksheet.getCell('C6').value = periode;
        worksheet.getCell('B7').value = "Jatah Cuti:";
        worksheet.getCell('C7').value = jatahCuti;
        worksheet.getCell('B8').value = "Cuti:";
        worksheet.getCell('C8').value = cuti;
        worksheet.getCell('B9').value = "Sisa Cuti:";
        worksheet.getCell('C9').value = sisaCuti;

        worksheet.getCell('B7').alignment = { horizontal: 'left' };
        worksheet.getCell('C7').alignment = { horizontal: 'left' };
        worksheet.getCell('B8').alignment = { horizontal: 'left' };
        worksheet.getCell('C8').alignment = { horizontal: 'left' };
        worksheet.getCell('B9').alignment = { horizontal: 'left' };
        worksheet.getCell('C9').alignment = { horizontal: 'left' };

        worksheet.getColumn('C').width = 19;
        worksheet.getColumn('B').width = 13;
        worksheet.getColumn('D').width = 20;

        worksheet.getRow(2).height = 30;

        const tableHeader = ['No', 'Hari/Tanggal', 'Keterangan'];
        const headerRow = worksheet.getRow(11);
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

        let rowIndex = 12;
        result.data?.vReportCutiLists.forEach((item, index) => {
            const rowData = [index + 1, item.hariTanggal, item.description];
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
            const fileName = `reportCutiPerBulan-${nama}-${periode}.xlsx`;
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
    const currentItems = result && result.data?.vReportCutiLists ? result.data?.vReportCutiLists.slice(indexOfFirstItem, indexOfLastItem) : [];

    const renderedItems = currentItems.map((item, index) => (
        <tr key={index}>
            <td>{indexOfFirstItem + index + 1}</td>
            <td>{item.hariTanggal}</td>
            <td>{item.description}</td>
        </tr>
    ));

    const handlePrevPage = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
        }
    };

    const handleNextPage = () => {
        if (currentPage < Math.ceil(result.data?.vReportCutiLists.length / itemsPerPage)) {
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
                                <th>Keterangan</th>

                            </tr>
                        </thead>
                        <tbody>
                            {renderedItems}
                        </tbody>
                        <tfoot style={{ height: "30px" }}>
                            <tr>
                                <td></td>
                                <td></td>
                                <td></td>

                            </tr>
                        </tfoot>
                    </Table>
                    <div>
                        <Button onClick={handlePrevPage} disabled={currentPage === 1}>Sebelumnya</Button>
                        <span style={{ marginLeft: "10px", marginRight: "10px" }}>Halaman {currentPage} dari {Math.ceil(result.data?.vReportCutiLists?.length / itemsPerPage)}</span>
                        <Button onClick={handleNextPage} disabled={currentPage === Math.ceil(result?.data?.vReportCutiLists?.length / itemsPerPage) || result?.data?.vReportCutiLists?.length === 0}>Selanjutnya</Button>

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

CutiReportList.propTypes = {
    loadUser: PropTypes.func,
    user: PropTypes.object,
    master: PropTypes.object
};

const mapStateToProps = (state) => ({
    user: state.auth.user,
    data: state.data,
    master: state.master,
});

export default connect(mapStateToProps, { loadUser })(CutiReportList);

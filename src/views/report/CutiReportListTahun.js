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

const CutiReportListTahun = ({ master, data, loadUser, user }) => {
    let { id } = useParams();
    const url = "Report/ReportCutiPerTahun";
    const [formData, setFormData] = useState({
        periode: 0,

    });

    const { periode } = formData;
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
                    periode: data.data.periode
                });
            }
        }
    }, [id, data, setFormData]);



    const onSelectChange = (selectedOption) => {
        setFormData({ ...formData, userID: selectedOption.id });
    };

    const handleRun = async (e) => {
        e.preventDefault();
        try {
            const tahunValue = document.querySelector('input[name="tahun"]').value;
            const url = `/Report/ReportCutiPerTahun?tahun=${tahunValue}`;

            const response = await axios.get(url);

            setResult(response.data);

            setFormData({
                ...formData,
                periode: response.data.data.periode,
                // kerja: response.data.data.kerja,
                // totalKerja: response.data.data.totalKerja,
                // nama: response.data.data.nama,
                // posisi: response.data.data.posisi,
                // bulan: response.data.data.periode
            });
        } catch (error) {
            console.error("Error:", error);
        }
    };


    const handlePDFDownload = () => {
        const doc = (
            <Document>
                <Page size="LEGAL">
                    <View>
                        <Text style={styles.headerTitle}>Laporan Cuti Per Tahun</Text>
                        <Text style={[styles.columnRow, styles.columnPeriode]}>Periode: {periode}</Text>
                        <Table style={styles.table}>
                            <View style={styles.tableRow}>
                                <Text style={[styles.columnHeader, styles.noColumn]}>No</Text>
                                <Text style={styles.columnHeader}>Nama</Text>
                                <Text style={styles.columnHeader}>NIK</Text>
                                <Text style={styles.columnHeader}>Jatah Cuti</Text>
                                <Text style={styles.columnHeader}>Cuti</Text>
                                <Text style={styles.columnHeader}>Sisa Cuti</Text>
                            </View>
                            {result && result.data?.vReportCutiPerTahuns?.map((item, index) => (
                                <View key={index} style={styles.tableRow}>
                                    <Text style={[styles.column, styles.noColumn]}>{index + 1}</Text>
                                    <Text style={styles.column}>{item.nama}</Text>
                                    <Text style={styles.column}>{item.nik}</Text>
                                    <Text style={styles.column}>{item.jatahCuti}</Text>
                                    <Text style={styles.column}>{item.cuti}</Text>
                                    <Text style={styles.column}>{item.sisaCuti}</Text>
                                </View>
                            ))}
                        </Table>

                    </View>
                </Page>
            </Document>
        );

        const fileName = `reportCutiPerTahun-${periode}.pdf`;

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
        columnPeriode: {
            marginBottom: 30
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
            flex: 2,
            flexWrap: "wrap",
            fontWeight: "bold",
            // borderRightWidth: 1,
            borderColor: "#000",
            paddingVertical: 4,
            borderTopWidth: 1,
            // marginTop: 20,
            backgroundColor: "#0087e8",
            color: "#ffff",
            width: "auto"
        },
        columnRow: {
            fontSize: 12,
            marginTop: 12,
            marginLeft: 24,
        },
        column: {
            flex: 2,
            // borderRightWidth: 1,
            borderColor: "#000",
            paddingVertical: 4,
            width: 100,
            flexWrap: "wrap"
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
        titleCell.value = 'Laporan Absensi Per Tahun';
        titleCell.font = { size: 16, bold: true };
        titleCell.alignment = { vertical: 'middle', horizontal: 'center' };
        titleCell.border = {};
        worksheet.mergeCells('I1:I2');
        worksheet.getColumn('I').width = 34;

        worksheet.getCell('B4').value = "Periode:";
        worksheet.getCell('C4').value = periode;

        worksheet.getColumn('C').width = 19;
        worksheet.getColumn('B').width = 15.1;

        worksheet.getRow(2).height = 30;

        const tableHeader = ['No', 'Nama', 'NIK', 'Jatah Cuti', 'Cuti', 'Sisa Cuti'];
        const headerRow = worksheet.getRow(6);
        tableHeader.forEach((header, index) => {
            const cell = headerRow.getCell(index + 2);
            cell.value = header;
            cell.font = { bold: true };
            cell.alignment = { vertical: 'middle', horizontal: 'center' };
            cell.border = { top: { style: 'thin' }, bottom: { style: 'thin' }, left: { style: 'thin' }, right: { style: 'thin' } };
            cell.fill = {
                type: 'pattern',
                pattern: 'solid',
                fgColor: { argb: 'FF0087E8' },
            };
            cell.font = { bold: true, color: { argb: 'ffffffff' } };
        });

        let rowIndex = 7;
        result.data?.vReportCutiPerTahuns?.forEach((item, index) => {
            const rowData = [index + 1, item.nama, item.nik, item.jatahCuti, item.cuti, item.sisaCuti];
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
            const fileName = `reportCutiPerTahun-${periode}.xlsx`;
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
    const currentItems = result && result.data?.vReportCutiPerTahuns ? result.data?.vReportCutiPerTahuns.slice(indexOfFirstItem, indexOfLastItem) : [];

    const renderedItems = result?.data?.vReportCutiPerTahuns?.map((item, index) => (
        <tr key={index}>
            <td>{index + 1}</td>
            <td>
                {item.nama.length > 20 ? (
                    <span data-toggle="tooltip" title={item.nama}>
                        {item.nama}
                    </span>
                ) : (
                    item.nama
                )}
            </td>
            <td>{item.nik}</td>
            <td>{item.jatahCuti}</td>
            <td>{item.cuti}</td>
            <td>{item.sisaCuti}</td>
        </tr>
    ));


    const handlePrevPage = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
        }
    };

    const handleNextPage = () => {
        if (currentPage < Math.ceil(result.data?.vReportCutiPerTahuns?.length / itemsPerPage)) {
            setCurrentPage(currentPage + 1);
        }
    };

    return (
        <Fragment>
            <div className="row mt-3">

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
                                <th>Nama</th>
                                <th>NIK</th>
                                {/* <th>Posisi</th> */}
                                <th>Jatah Cuti</th>
                                <th>Cuti</th>
                                <th>Sisa Cuti</th>
                            </tr>
                        </thead>
                        <tbody>
                            {renderedItems}
                        </tbody>
                        <tfoot style={{ height: "25px" }}>
                            <tr>
                                <td></td>
                                <td></td>
                                <td></td>
                                <td></td>
                                <td></td>
                                <td></td>

                            </tr>
                        </tfoot>
                    </Table>
                    <div>
                        <Button onClick={handlePrevPage} disabled={currentPage === 1}>Sebelumnya</Button>
                        <span style={{ marginLeft: "10px", marginRight: "10px" }}>Halaman {currentPage} dari {Math.ceil(result.data?.vReportCutiPerTahuns?.length / itemsPerPage)}</span>
                        <Button onClick={handleNextPage} disabled={currentPage === Math.ceil(result.data?.vReportCutiPerTahuns?.length / itemsPerPage)}>Selanjutnya</Button>
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

CutiReportListTahun.propTypes = {
    loadUser: PropTypes.func,
    user: PropTypes.object,
    master: PropTypes.object
};

const mapStateToProps = (state) => ({
    user: state.auth.user,
    data: state.data,
    master: state.master,
});

export default connect(mapStateToProps, { loadUser })(CutiReportListTahun);

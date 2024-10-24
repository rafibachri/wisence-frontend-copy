import React, { Fragment, useEffect, useState } from "react";
import { Button, Table } from "react-bootstrap";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { CSVLink } from "react-csv";
import { GrAdd } from "react-icons/gr";
import { FaBolt, FaCalendar, FaCaretDown, FaFilter, FaPlus, FaPrint, FaSearch } from "react-icons/fa";

import { connect } from "react-redux";
import PropTypes from "prop-types";

import moment from "moment/moment";
import swal from "sweetalert";

import Alert from "../Alert";
import Spinner from "../Spinner";
import { baseURL } from "../../utility/config";

import { addDays } from "date-fns";
import { DateRangePicker } from "react-date-range";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";
import { deleteDataPosisi } from "../../actions/data";
import { GrFormNext } from "react-icons/gr";
import { GrFormPrevious } from "react-icons/gr";
import { MdOutlineDeleteOutline } from "react-icons/md";
import Swal from "sweetalert2";

const ListWrapperPosition = (props) => {
    const navigate = useNavigate();
    const location = useLocation();

    const { img, title, path, url, exportFilename, allowAdd, allowDelete, allowExport, allowFilter, filterSearch, filterDate, allowSearch, bulkAction, handleBulkAction, columns, data, refreshData, exportData, deleteDataPosisi, role, roles, condition, allowEdit, handleCustom, handleAdditionalFilter } = props;

    const { list, module, page, total, loading } = data;

    const [search, setSearch] = useState("");
    const [limit, setLimit] = useState(10);

    // Order
    const [sort, setSort] = useState("");
    const [sortBy, setSortBy] = useState("");
    const [orderBy, setOrderBy] = useState("");

    // Filter Search
    const [filter, setFilter] = useState(false);

    // Export
    const [exportedData, setExportedData] = useState(null);
    const csvLink = React.createRef();

    // Checkbox
    const [checkedAll, setCheckedAll] = useState(false);
    const [checkedItem, setCheckedItem] = useState([]);

    // Role
    const [isCreate, setIsCreate] = useState(true);
    const [isDelete, setIsDelete] = useState(true);
    const [isUpdate, setIsUpdate] = useState(true);
    // const [isRead, setIsRead] = useState(true);

    // Filter Range
    const [showRange, setShowRange] = useState(false);
    const [rangeString, setRangeString] = useState("");
    const [rangeDate, setRangeDate] = useState([
        {
            startDate: addDays(new Date(), -50),
            endDate: addDays(new Date(), 1),
            key: "selection",
        },
    ]);

    // useEffect(() => {
    //   if (exportedData !== null) {
    //     csvLink.current.link.click();
    //     setExportedData(null);
    //   }
    // }, [setExportedData, csvLink]);

    // useEffect(() => {
    //   if (condition !== undefined && condition !== null) {
    //     setFilterSearch(condition);
    //   }
    // }, [condition]);

    useEffect(() => {
        if (rangeDate !== undefined && rangeDate !== null) {
            setRangeString(moment(rangeDate[0].startDate).format("DD-MM-YYYY") + " to " + moment(rangeDate[0].endDate).format("DD-MM-YYYY"));
        }
    }, [rangeDate]);

    useEffect(() => {
        if (role !== undefined && role !== null && roles !== undefined && roles !== null) {
            const roleData = roles.find((obj) => obj.description === role);
            if (roleData !== undefined && roleData !== null) {
                setIsCreate(roleData.isCreate);
                setIsDelete(roleData.isDelete);
                setIsUpdate(roleData.isUpdate);
                // setIsRead(roleData.isRead);
            }
        }
    }, [role, roles]);

    const handleSort = (e) => {
        e.preventDefault();

        const newOrder = e.target.getAttribute("field");
        const newSort = orderBy === newOrder && sortBy === "asc" ? "desc" : "asc";
        const obj = newOrder + (newSort === "" || newSort === "asc" ? "" : ",desc");

        setOrderBy(newOrder);
        setSortBy(newSort);
        setSort(obj);
        refreshData({ url, search, page, limit, sort: obj, filterSearch, rangeDate });
    };

    const handleCheckedAll = () => {
        setCheckedAll(checkedAll ? false : true);
        list.forEach((item) => {
            checkedItem[item.positionID] = checkedAll ? false : true;
            // checkedItem[item.userID] = checkedAll ? false : true;
        });
    };

    const handleClick = (e) => {
        setCheckedItem({ ...checkedItem, [e.target.name]: e.target.checked });
    };

    const handleBulk = (e, type) => {
        e.preventDefault();
        const selectedItems = Object.keys(checkedItem).filter((positionID) => checkedItem[positionID]);
        if (selectedItems.length === 0) {
            Swal("Tidak ada Data yang dipilih", "", "warning");
            return;
        }
        Swal.fire({
            title: "Apakah anda yakin ingin " + type + " data yang dipilih ini ?",
            text: "Pilih OK untuk konfirmasi",
            icon: "warning",
            buttons: true,
            dangerMode: true,
            showCancelButton: true,
            confirmButtonText: "OK",
            confirmButtonColor: "#dc3545",
            cancelButtonText: "Batal"
        }).then(async (succeed) => {
            if (succeed.value) {
                for (let positionID of Object.keys(checkedItem)) {
                    if (checkedItem[positionID]) {
                        if (type === "hapus")
                            await deleteDataPosisi({ url, positionID }).then(() => {
                                refreshData({ url, search, page, limit, sort, filterSearch, rangeDate });
                            });
                        else await handleBulkAction(e, type, positionID);
                    }
                }
                setCheckedAll(false);
                setCheckedItem([]);
                refreshData({ url, search, page, limit, sort, filterSearch, rangeDate });
            }
        });
    };

    const handleExport = () => {
        exportData({ url, search, page, limit, sort, filterSearch }).then((obj) => {
            setExportedData(obj);
        });
    };

    const handleShowDate = (e) => {
        e.preventDefault();
        setShowRange(!showRange);
    };

    const handleSelect = (item) => {
        setRangeDate([item.selection]);
        setShowRange(!showRange);
    };

    const handleRefresh = (e) => {
        e.preventDefault();
        refreshData({ url, search, page, limit, sort, filterSearch, rangeDate });
    };

    const handleFilter = (e) => {
        e.preventDefault();
        // if (filter) setFilterSearch({});

        setFilter(!filter);
    };


    const handleSearch = (e) => {
        e.preventDefault();
        setSearch(e.target.value);
        refreshData({ url, search: e.target.value, page, limit, sort, filterSearch, rangeDate });
    };

    const handleLimit = (e, obj) => {
        e.preventDefault();

        setLimit(obj);
        refreshData({ url, search, page, limit: obj, sort, filterSearch, rangeDate });
    };

    const handleNext = (e, page) => {
        e.preventDefault();
        refreshData({ url, search, page: page + 1, limit, sort, filterSearch, rangeDate });
    };

    const handlePrev = (e, page) => {
        e.preventDefault();
        refreshData({ url, search, page: page - 1, limit, sort, filterSearch, rangeDate });
    };

    const handleView = (e, positionID) => {
        e.preventDefault();
        navigate(`${path}/${positionID}/edit?return_url=${encodeURIComponent(location.pathname)}`);
    };

    const renderModule = () => {
        return (
            <div className="module d-flex justify-content-between">
                <div className="module-title d-flex align-items-center">
                    {img} <span className="mr-2">{title}</span> <span style={{ fontWeight: "normal" }}>Table</span>
                </div>
            </div>
        );
    };

    const renderLeftHeader = () => {
        return (
            <div className="d-flex left-flex">
                {(allowAdd === undefined || allowAdd) && isCreate && (
                    <Link to={`${path}/create?return_url=${encodeURIComponent(location.pathname)}`} className="btn btn-primary btn-module d-flex align-items-center justify-content-center mr-2">
                        <GrAdd className="mr-2" />
                        <span className="mb-1">Tambah</span>
                    </Link>
                )}
                {renderBulkAction()}
                {(allowFilter === undefined || allowFilter) && (filterDate || handleAdditionalFilter !== undefined) && (
                    <button className="btn btn-primary btn-module d-flex align-items-center justify-content-center mr-2" onClick={(e) => handleFilter(e)}>
                        <FaFilter className="mr-2" /> <span>Filter</span>
                    </button>
                )}
            </div>
        );
    };

    const renderBulkAction = () => {
        if ((bulkAction === undefined || bulkAction === null) && ((allowDelete !== undefined && !allowDelete) || !isDelete)) return null;
        if ((bulkAction === undefined || bulkAction === null) && ((allowEdit !== undefined && !allowEdit) || !isUpdate)) return null;

        if (isUpdate && (allowDelete === undefined || allowDelete) && isDelete) {
            return (
                <button type="button" className="btn btn-primary btn-module d-flex align-items-center justify-content-center mr-2" onClick={(e) => handleBulk(e, "hapus")}>
                    <MdOutlineDeleteOutline className="mr-2" /> <span className="mb-1">Hapus</span>
                </button>
            );
        }
    };


    const renderRightHeader = () => {
        return (
            <div className="d-flex right-flex">
                {(allowSearch === undefined || allowSearch) && <input className="search-control mr-2" type="text" name="search" placeholder="Cari" onChange={(e) => handleSearch(e)} />}

            </div>
        );
    };


    const renderHeader = columns.map((item, index) => (
        <th key={index} style={{ minWidth: item.width }} className={"header " + (item.align === "right" ? "text-right" : "text-left") + " " + (orderBy !== item.key || sortBy === "" ? "sorting" : `sorting_${sortBy}`)} field={item.key} onClick={handleSort}>
            {item.label}
        </th>
    ));

    const renderValue = (col, value, item) => {
        if (value === undefined) return null;
        if (col.type === "date") {
            return value === undefined || value === null ? "" : moment(value).format("DD MMM YYYY");
        } else if (col.type === "datetime") {
            return value === undefined || value === null ? "" : moment(value).format("DD-MMM-YYYY HH:mm");
        }
        else if (col.type === "number") {
            if (col.decimals !== undefined) return value.toLocaleString(undefined, { maximumFractionDigits: col.decimals });
            else return value.toLocaleString();
        }


        else if (col.type === "custom") {
            return handleCustom(col, item);
        }
        else {
            return value;
        }
    };



    const renderData =
        list === undefined || list === null || module !== url
            ? null
            : list.map((item, index) => {

                return (
                    <tr key={index}>
                        {(allowDelete === undefined || allowDelete || bulkAction !== undefined) && (
                            <td className="text-center align-middle">
                                <input
                                    type="checkbox"
                                    name={item.positionID}
                                    checked={checkedItem[item.positionID] !== undefined && checkedItem[item.positionID]}
                                    onChange={handleClick}
                                />
                            </td>
                        )}
                        <td className="text-center align-middle data-item" onClick={(e) => handleView(e, item.positionID)}>
                            {page * limit + index + 1}
                        </td>
                        {columns.map((col, key) => {

                            return (
                                <td
                                    key={key}
                                    className={`align-middle data-item ${col.align === "right"
                                        ? "text-right"
                                        : col.align === "center"
                                            ? "text-center"
                                            : "text-left"
                                        }`}
                                    onClick={(e) => (col.link === undefined ? handleView(e, item.positionID) : null)}
                                >
                                    {renderValue(col, item[col.key], item)}
                                </td>
                            );
                        })}
                    </tr>
                );
            });

    const renderLeftFooter = ({ isCard }) => {
        var row1 = page * limit + 1;
        var row2 = (page + 1) * limit;
        if (row2 > total) row2 = total;
        if (total === 0) return <div className={isCard ? "" : "d-flex justify-content-between align-items-center"}> Tidak Ada Data</div>;
        return (
            <div className={isCard ? "" : "d-flex justify-content-between align-items-center ml-2"}>
                {row1}-{row2} dari {total} data
            </div>
        );
    };


    const renderPrev = (page) => {
        return page === 0 ? null : (
            <Button className="btn-prevnex ml-2" onClick={(e) => handlePrev(e, page, search)}>
                <GrFormPrevious className="mt-1" />
            </Button>
        );
    };

    const renderNext = (page, total, limit) => {
        const max = (page + 1) * limit;
        return total <= max ? null : (
            <Button className="btn-prevnex ml-2" onClick={(e) => handleNext(e, page, search)}>
                <GrFormNext className="mt-1" />
            </Button>
        );
    };


    const renderRightFooter = () => {
        return (
            <div className="d-flex justify-content-end align-items-center">
                <span>Baris Per Halaman:</span>
                <div className="dropdown">
                    <button type="button" className="btn btn-module btn-primary d-flex align-items-center justify-content-center dropdown-toggle" data-toggle="dropdown">
                        <span>{limit}</span>
                    </button>
                    <div className="dropdown-menu limit-menu">
                        <div className="btn dropdown-item limit-item" onClick={(e) => handleLimit(e, 10)}>
                            10
                        </div>
                        <div className="btn dropdown-item limit-item" onClick={(e) => handleLimit(e, 50)}>
                            50
                        </div>
                        <div className="btn dropdown-item limit-item" onClick={(e) => handleLimit(e, 100)}>
                            100
                        </div>
                        <div className="btn dropdown-item limit-item" onClick={(e) => handleLimit(e, 500)}>
                            500
                        </div>
                        <div className="btn dropdown-item limit-item" onClick={(e) => handleLimit(e, 1000)}>
                            1000
                        </div>
                    </div>
                </div>
                {renderPrev(page)}
                {renderNext(page, total, limit)}
            </div>
        );
    };

    const renderCardData = () => {
        if (list === undefined || list === null) return null;

        return list.map((item, index) => {
            return (
                <div key={index} className="container">
                    <div className="card module-card">
                        <div className="card-body module-card-body">
                            <div className="card-text" style={{ padding: 5, width: '100%' }}>
                                <div className="d-flex" style={{ padding: 10 }} >
                                    {(allowDelete === undefined || allowDelete || bulkAction !== undefined) && (
                                        <div className="d-flex align-items-center module-card-left">
                                            <input
                                                type="checkbox"
                                                name={item.positionID}
                                                checked={checkedItem[item.positionID] !== undefined && checkedItem[item.positionID]}
                                                onChange={handleClick}
                                            />
                                        </div>
                                    )}
                                    <div>
                                        {columns.map((col, key) => {
                                            if (key === 0)
                                                return (<div key={key} className="module-card-title" onClick={(e) => handleView(e, item.positionID)}>{renderValue(col, item[col.key], item)}</div>)
                                            return (<div key={key} className="module-card-data">{col.label}: {renderValue(col, item[col.key], item)}</div>)
                                        })}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

            );
        });
    };

    const renderCard = () => {
        return (
            <Fragment>
                {/* {renderCardData()} */}
                {renderTable()}
                <div className="text-center">
                    {/* {renderLeftFooter({ isCard: true })}
                    {renderRightFooter()} */}
                </div>
            </Fragment>
        );
    };

    const renderTable = () => {
        return (
            <Table className="table-list" striped responsive hover>
                <thead>
                    <tr>
                        {(allowDelete === undefined || allowDelete || bulkAction !== undefined) && (
                            <th style={{ width: 40 }} className="text-center">
                                <input type="checkbox" checked={checkedAll} onChange={handleCheckedAll} />
                            </th>
                        )}
                        <th style={{ width: 40 }} className="text-center">
                            No
                        </th>
                        {renderHeader}
                    </tr>
                </thead>
                <tbody>{renderData}</tbody>
                <tfoot>
                    <tr>
                        <th colSpan={columns.length + 3}>
                            <div className="d-flex justify-content-between">
                                {renderLeftFooter({ isCard: false })}
                                {renderRightFooter()}
                            </div>
                        </th>
                    </tr>
                </tfoot>
            </Table>
        );
    };

    const renderFilter = () => {
        if (!filter) return null;
        return (
            <div className="filter mb-1">
                <div className="subTitle">Filter</div>
                {/* {filterDate && (
          <div class="row">
            <div class="col-sm-2" style={{ paddingTop: 7, marginBottom: 10 }}>Periode</div>
            <div class="form-group col-sm-10">
              <div className="date-range" onClick={(e) => handleShowDate(e)}>
                <FaCalendar />
                <span>{rangeString}</span>
                <FaCaretDown className="date-range-arrow" />
              </div>
              {showRange && (
                <div className="date-container">
                  <DateRangePicker onChange={(item) => handleSelect(item)} showSelectionPreview={true} moveRangeOnFirstSelection={false} months={2} ranges={rangeDate} inputRanges={[]} direction="horizontal" preventSnapRefocus={true} calendarFocus="backwards" />
                </div>
              )}
            </div>
          </div>
        )} */}
                {handleAdditionalFilter !== undefined && handleAdditionalFilter()}
                <div class="row">
                    <div class="col-2">&nbsp;</div>
                    <div class="form-group col-10">
                        <button className="btn btn-search d-flex align-items-center justify-content-center mr-2" onClick={e => handleRefresh(e)}>
                            <FaSearch className="mr-2" /> <span> Search</span>
                        </button>
                    </div>
                </div>
            </div >
        );
    };

    const renderList = () => {
        return window.innerWidth <= 768 ? renderCard() : renderTable();
    };

    return (
        <Fragment>
            {title !== undefined && renderModule()}
            <div className="content">
                <Alert />

                <div className="card">
                    <div className="card-header list-card-header">
                        {renderLeftHeader()}
                        {renderRightHeader()}
                    </div>
                    <div className="card-body list-card-body">
                        {loading ? <Spinner /> :
                            <Fragment>
                                {renderFilter()}
                                {renderList()}
                            </Fragment>}
                    </div>
                </div>
            </div>
        </Fragment>
    );
};

ListWrapperPosition.propTypes = {
    roles: PropTypes.array,
};

const mapStateToProps = (state) => ({
    roles: state.auth.roles,
});

export default connect(mapStateToProps)(ListWrapperPosition);

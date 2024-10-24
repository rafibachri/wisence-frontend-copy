import { useEffect, useState } from "react";
import { FaLayerGroup, FaBuilding } from "react-icons/fa";

import { connect } from "react-redux";
import PropTypes from "prop-types";

import ListWrapper from "../../../components/Wrapper/ListWrapper";
import { refreshData, deleteData, exportData } from "../../../actions/data";

const CompanyProfileList = ({ user, data, refreshData, deleteData, exportData }) => {
    const title = "Profil Perusahaan";
    const img = <FaBuilding className="module-img" />;
    const path = "/company/profilperusahaan";
    const url = "company";
    const role = "Perusahaan - Profil Perusahaan";

    const [isDataExist, setIsDataExist] = useState(false);
    console.log("data", data)

    const renderCustom = (col, item) => {
        if (col.customName === "jamMasuk") {
            return item.start?.substring(11, 19);
        }
        if (col.customName === "jamKeluar") {
            return item.end?.substring(11, 19);
        }
    }

    const columns = [
        { label: "Nama Perusahaan", key: "name", width: 100, cardTitle: true },
        { label: "Jam Masuk", key: "start", width: 100, type: "custom", customName: "jamMasuk", cardTitle: true },
        { label: "Jam Keluar", key: "end", width: 100, type: "custom", customName: "jamKeluar", cardTitle: true },
        { label: "Jatah Cuti Tahunan", key: "cuti", width: 100, cardTitle: true }
        // { label: "Min Temp", key: "minTemp", width: 80, type: "number", align: "right", cardSubTitle: true },
        // { label: "Max Temp", key: "maxTemp", width: 80, type: "number", align: "right", cardSubTitle: true },
    ];

    const exportFilename = "item-type.csv";

    useEffect(() => {

        setIsDataExist(data && data?.list?.length > 0);
    }, [data]);
    // console.log("c", data.list.length)

    useEffect(() => {
        if (user !== null) {
            refreshData({ url });
        }
    }, [user, refreshData]);

    return <ListWrapper path={path} url={url} exportFilename={exportFilename} role={role} columns={columns} data={data} refreshData={refreshData} exportData={exportData} deleteData={deleteData} handleCustom={renderCustom} allowAdd={!isDataExist} />;
};

CompanyProfileList.propTypes = {
    user: PropTypes.object,
    data: PropTypes.object,
    refreshData: PropTypes.func,
    deleteData: PropTypes.func,
    exportData: PropTypes.func,
};

const mapStateToProps = (state) => ({
    user: state.auth.user,
    data: state.data,
});

export default connect(mapStateToProps, { refreshData, deleteData, exportData })(CompanyProfileList);

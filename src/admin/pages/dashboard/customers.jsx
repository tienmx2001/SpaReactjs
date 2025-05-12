// src/pages/Customers.js

import React, { useEffect, useState } from "react";
import {
  Card,
  CardHeader,
  CardBody,
  Typography,
  Alert,
} from "@material-tailwind/react";
import axios from "axios";
import { PlusCircleIcon } from "@heroicons/react/24/outline";
import Modal from "@mui/material/Modal";
import Slide from "@mui/material/Slide";
import Divider from "@mui/material/Divider";
import CloseIcon from "@mui/icons-material/Close";

import MKBox from "components/MKBox";
import MKButton from "components/MKButton";
import MKTypography from "components/MKTypography";
import MKInput from "components/MKInput";
import Icon from "@mui/material/Icon";
import InputAdornment from "@mui/material/InputAdornment";
import MKPagination from "components/MKPagination";

// @mui icons
import SearchIcon from "@mui/icons-material/Search";

export function Customers() {
  const [customers, setCustomers] = useState([]);
  const [openAddModal, setOpenAddModal] = useState(false);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [editId, setEditId] = useState(null);
  const [searchKeyword, setSearchKeyword] = useState("");


  const filteredCustomers = customers.filter((customer) =>
    customer.full_name.toLowerCase().includes(searchKeyword.toLowerCase())
  );
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const totalPages = Math.ceil(filteredCustomers.length / itemsPerPage);
  const paginatedCustomers = filteredCustomers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  
  const [formAdd, setFormAdd] = useState({
    full_name: "",
    phone_number: "",
    email: "",
    address: "",
  });

  const [formEdit, setFormEdit] = useState({
    full_name: "",
    phone_number: "",
    email: "",
    address: "",
  });

  const [alert, setAlert] = useState({
    open: false,
    color: "green",
    message: "",
  });

  const handleInputChange = (e, isEdit = false) => {
    const { name, value } = e.target;
    if (isEdit) {
      setFormEdit((prev) => ({ ...prev, [name]: value }));
    } else {
      setFormAdd((prev) => ({ ...prev, [name]: value }));
    }
  };

  const toggleAddModal = () => setOpenAddModal(!openAddModal);
  const toggleEditModal = () => setOpenEditModal(!openEditModal);

  const showAlert = (color, message) => {
    setAlert({ open: true, color, message });
    setTimeout(() => setAlert((prev) => ({ ...prev, open: false })), 2000);
  };

  const handleAddSubmit = async () => {
    const { full_name, phone_number, email, address } = formAdd;

    const exists = customers.some(
      (c) => c.email.toLowerCase().trim() === email.toLowerCase().trim()
    );
    if (exists) {
      showAlert("red", "Email này đã tồn tại!");
      return;
    }

    try {
      const res = await axios.post("http://localhost:5000/api/customers", {
        full_name,
        phone_number,
        email,
        address,
      });
      const newCustomer = {
        customer_id: res.data.customer_id,
        full_name,
        phone_number,
        email,
        address,
      };
      setCustomers((prev) => [...prev, newCustomer]);
      showAlert("green", "Thêm khách hàng thành công!");
      setFormAdd({ full_name: "", phone_number: "", email: "", address: "" });
      toggleAddModal();
    } catch (err) {
      console.error(err);
      showAlert("red", "Lỗi khi thêm khách hàng!");
    }
  };

  const handleEditSubmit = async () => {
    const { full_name, phone_number, email, address } = formEdit;

    const exists = customers.some(
      (c) => c.email.toLowerCase().trim() === email.toLowerCase().trim() && c.customer_id !== editId
    );
    if (exists) {
      showAlert("red", "Email này đã tồn tại!");
      return;
    }

    try {
      await axios.put(`http://localhost:5000/api/customers/${editId}`, {
        full_name,
        phone_number,
        email,
        address,
      });

      setCustomers((prev) =>
        prev.map((c) =>
          c.customer_id === editId
            ? { ...c, full_name, phone_number, email, address }
            : c
        )
      );
      showAlert("green", "Cập nhật khách hàng thành công!");
      setEditId(null);
      toggleEditModal();
    } catch (err) {
      console.error(err);
      showAlert("red", "Lỗi khi cập nhật khách hàng!");
    }
  };

  const handleEdit = (id) => {
    const customer = customers.find((c) => c.customer_id === id);
    if (!customer) return;
    setEditId(id);
    setFormEdit({ ...customer });
    toggleEditModal();
  };

  const handleDelete = async (id) => {
   
      showAlert("red", "Không thể xóa khách hàng");
  };

  useEffect(() => {
    setCurrentPage(1);
  }, [searchKeyword]);
  

  useEffect(() => {
    axios
      .get("http://localhost:5000/api/customers")
      .then((res) => setCustomers(res.data))
      .catch((err) => console.error(err));
  }, []);

  const renderModal = (isEdit = false) => {
    const form = isEdit ? formEdit : formAdd;
    return (
      <Modal open={isEdit ? openEditModal : openAddModal} onClose={isEdit ? toggleEditModal : toggleAddModal}>
        <Slide direction="down" in={isEdit ? openEditModal : openAddModal}>
          <MKBox
            position="relative"
            width="500px"
            display="flex"
            flexDirection="column"
            borderRadius="xl"
            bgColor="white"
            shadow="xl"
            sx={{ m: "auto", mt: 10 }}
          >
            <MKBox display="flex" alignItems="center" justifyContent="space-between" p={2}>
              <MKTypography variant="h5">
                {isEdit ? "Cập nhật khách hàng" : "Thêm khách hàng"}
              </MKTypography>
              <CloseIcon
                fontSize="medium"
                sx={{ cursor: "pointer" }}
                onClick={isEdit ? toggleEditModal : toggleAddModal}
              />
            </MKBox>
            <Divider />
            <MKBox p={2} display="flex" flexDirection="column" gap={2}>
              <MKInput label="Họ tên" name="full_name" value={form.full_name} onChange={(e) => handleInputChange(e, isEdit)} fullWidth />
              <MKInput label="Số điện thoại" name="phone_number" value={form.phone_number} onChange={(e) => handleInputChange(e, isEdit)} fullWidth />
              <MKInput label="Email" name="email" value={form.email} onChange={(e) => handleInputChange(e, isEdit)} fullWidth />
            </MKBox>
            <Divider />
            <MKBox display="flex" justifyContent="space-between" p={1.5}>
              <MKButton variant="gradient" color="dark" onClick={isEdit ? toggleEditModal : toggleAddModal}>
                Đóng
              </MKButton>
              <MKButton variant="gradient" color="info" onClick={isEdit ? handleEditSubmit : handleAddSubmit}>
                {isEdit ? "Cập nhật" : "Lưu"}
              </MKButton>
            </MKBox>
          </MKBox>
        </Slide>
      </Modal>
    );
  };

  return (
    <div className="mt-12 mb-8 flex flex-col gap-12">
      {alert.open && (
        <div className="fixed top-10 left-1/2 -translate-x-1/2 z-50">
          <Alert color={alert.color} open={alert.open} onClose={() => setAlert((prev) => ({ ...prev, open: false }))}>
            {alert.message}
          </Alert>
        </div>
      )}

      <Card>
        <CardHeader variant="gradient" color="gray" className="mb-8 p-6 justify-between flex">
          <Typography variant="h6" color="white">
            Customers Table
          </Typography>
          
        </CardHeader>

        <CardBody className="overflow-x-scroll px-0 pt-0 pb-2">
        <div className="flex items-center gap-2 justify-between px-2 py-1 ">
            <MKButton onClick={toggleAddModal} className="flex items-center gap-2"  variant="gradient" color="dark">
              Thêm
              <PlusCircleIcon className="w-5 h-5 text-white" />
            </MKButton>
            <MKInput
              variant="standard"
              placeholder="Tìm kiếm"
              value={searchKeyword}
              onChange={(e) => setSearchKeyword(e.target.value)}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon fontSize="small" />
                  </InputAdornment>
                ),
              }}
            />
          </div>
          <table className="w-full min-w-[640px] table-auto">
            <thead>
              <tr>
                {["ID", "Họ tên", "Điện thoại", "Email", "Trạng thái","Ngày hẹn","Giờ hẹn","Ghi chú", "Hành động"].map((el) => (
                  <th key={el} className="border-b border-blue-gray-50 py-3 px-5 text-left">
                    <Typography variant="small" className="text-[11px] font-bold uppercase text-blue-gray-400">
                      {el}
                    </Typography>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {paginatedCustomers.map(({ customer_id, full_name, phone_number, email, appointment_time,status,note,date_of_visit }, index) => {
                const className = `py-3 px-5 ${index === customers.length - 1 ? "" : "border-b border-blue-gray-50"}`;
                return (
                  <tr key={customer_id}>
                    <td className={className}><Typography className="text-sm text-blue-gray-700 font-medium">{customer_id}</Typography></td>
                    <td className={className}><Typography className="text-sm text-blue-gray-700 font-medium">{full_name}</Typography></td>
                    <td className={className}><Typography className="text-sm text-blue-gray-700 font-medium">{phone_number}</Typography></td>
                    <td className={className}><Typography className="text-sm text-blue-gray-700">{email}</Typography></td>
                    <td className={className}><Typography className="text-sm text-blue-gray-700">{status}</Typography></td>
                    <td className={className}><Typography className="text-sm text-blue-gray-700">{new Date(date_of_visit).toLocaleDateString()}</Typography></td>
                    <td className={className}>
                      <Typography className="text-sm text-blue-gray-700">
                        {new Date(appointment_time).toISOString().substring(11, 19)}
                      </Typography>
                    </td>
                    <td className={className}><Typography className="text-sm text-blue-gray-700">{note}</Typography></td>

                    <td className={className}>
                      <Icon sx={{ cursor: "pointer", mr: 1 }} onClick={() => handleEdit(customer_id)}>edit</Icon>
                      <Icon sx={{ cursor: "pointer" }} onClick={() => handleDelete(customer_id)}>delete</Icon>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          <div className="flex justify-center py-4">
            <MKPagination>
              <MKPagination item onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}>
                <Icon>keyboard_arrow_left</Icon>
              </MKPagination>

              {Array.from({ length: totalPages }, (_, i) => (
                <MKPagination
                  key={i}
                  item
                  active={i + 1 === currentPage}
                  onClick={() => setCurrentPage(i + 1)}
                >
                  {i + 1}
                </MKPagination>
              ))}

              <MKPagination item onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}>
                <Icon>keyboard_arrow_right</Icon>
              </MKPagination>
            </MKPagination>
          </div>

        </CardBody>
      </Card>

      {renderModal(false)}
      {renderModal(true)}
    </div>
  );
}

export default Customers;

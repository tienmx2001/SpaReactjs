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
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

import MKBox from "components/MKBox";
import MKButton from "components/MKButton";
import MKTypography from "components/MKTypography";
import MKInput from "components/MKInput";
import Icon from "@mui/material/Icon";
import InputAdornment from "@mui/material/InputAdornment";
import SearchIcon from "@mui/icons-material/Search";
import MKPagination from "components/MKPagination";

export function Services() {
  const [services, setServices] = useState([]);
  const [openAddModal, setOpenAddModal] = useState(false);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [editId, setEditId] = useState(null);
  const [searchKeyword, setSearchKeyword] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const [formAdd, setFormAdd] = useState({
    service_name: "",
    price: "",
    duration_minute: "",
    description: "",
    service_type: "",
    service_image: null,
    service_contents: "",
  });

  const [formEdit, setFormEdit] = useState({
    service_name: "",
    price: "",
    duration_minute: "",
    description: "",
    service_type: "",
    service_image: null,
    service_contents: "",
  });

  const [alert, setAlert] = useState({
    open: false,
    color: "green",
    message: "",
  });

  const filteredServices = services.filter((service) =>
    service.service_name.toLowerCase().includes(searchKeyword.toLowerCase())
  );

  const totalPages = Math.ceil(filteredServices.length / itemsPerPage);
  const paginatedServices = filteredServices.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleInputChange = (e, isEdit = false) => {
    const { name, value } = e.target;
    const setForm = isEdit ? setFormEdit : setFormAdd;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageUpload = async (e, isEdit) => {
    const file = e.target.files[0];
    if (!file) return;
  
    const formData = new FormData();
    formData.append("image", file);
  
    try {
      const res = await axios.post("http://localhost:5000/api/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
  
      const imageUrl = res.data.url; // đường dẫn trả về từ backend
      if (isEdit) {
        setFormEdit(prev => ({ ...prev, service_image: imageUrl }));
      } else {
        setFormAdd(prev => ({ ...prev, service_image: imageUrl }));
      }
    } catch (err) {
      console.error("Image upload error:", err);
      showAlert("red", "Lỗi khi tải ảnh lên!");
    }
  }

  const toggleAddModal = () => setOpenAddModal(!openAddModal);
  const toggleEditModal = () => setOpenEditModal(!openEditModal);

  const showAlert = (color, message) => {
    setAlert({ open: true, color, message });
    setTimeout(() => setAlert((prev) => ({ ...prev, open: false })), 2000);
  };

  const handleAddSubmit = async () => {
    const { service_name, price, duration_minute, description, service_type, service_image, service_contents } = formAdd;
    const exists = services.some(
      (s) => s.service_name.toLowerCase().trim() === service_name.toLowerCase().trim()
    );
    if (exists) {
      showAlert("red", "Dịch vụ này đã tồn tại!");
      return;
    }

    try {
      const res = await axios.post("http://localhost:5000/api/services", {
        service_name,
        price,
        duration_minute,
        description,
        service_type,
        service_image: service_image,
        service_contents,
      });
      setServices((prev) => [...prev, res.data.service]);
      showAlert("green", "Thêm dịch vụ thành công!");
      setFormAdd({
        service_name: "",
        price: "",
        duration_minute: "",
        description: "",
        service_type: "",
        service_image: null,
        service_contents: "",
      });
      toggleAddModal();
    } catch (err) {
      console.error(err);
      showAlert("red", "Lỗi khi thêm dịch vụ!");
    }
  };

  const handleEditSubmit = async () => {
    const { service_name, price, duration_minute, description, service_type, service_image, service_contents } = formEdit;
    const exists = services.some(
      (s) => s.service_name.toLowerCase().trim() === service_name.toLowerCase().trim() && s.service_id !== editId
    );
    if (exists) {
      showAlert("red", "Dịch vụ này đã tồn tại!");
      return;
    }

    try {
      await axios.put(`http://localhost:5000/api/services/${editId}`, {
        service_name,
        price,
        duration_minute,
        description,
        service_type,
        service_image: service_image,
        service_contents,
      });
      setServices((prev) =>
        prev.map((s) =>
          s.service_id === editId
            ? { ...s, service_name, price, duration_minute, description, service_type, service_image: service_image, service_contents }
            : s
        )
      );
      showAlert("green", "Cập nhật dịch vụ thành công!");
      setEditId(null);
      toggleEditModal();
    } catch (err) {
      console.error(err);
      showAlert("red", "Lỗi khi cập nhật dịch vụ!");
    }
  };

  const handleEdit = (id) => {
    const service = services.find((s) => s.service_id === id);
    if (!service) return;
    setEditId(id);
    setFormEdit({ ...service, service_image: service.service_image });
    toggleEditModal();
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/services/${id}`);
      setServices((prev) => prev.filter((s) => s.service_id !== id));
      showAlert("green", "Xóa dịch vụ thành công!");
    } catch (err) {
      console.error(err);
      showAlert("red", "Lỗi khi xóa dịch vụ!");
    }
  };

  useEffect(() => {
    axios
      .get("http://localhost:5000/api/services")
      .then((res) => setServices(res.data))
      .catch((err) => console.error(err));
  }, []);

  const renderModal = (isEdit = false) => {
    const form = isEdit ? formEdit : formAdd;
    return (
      <Modal open={isEdit ? openEditModal : openAddModal} onClose={isEdit ? toggleEditModal : toggleAddModal}>
        <Slide direction="down" in={isEdit ? openEditModal : openAddModal}>
          <MKBox width="90%"
          maxWidth="1400px"
          maxHeight="90vh"
          bgColor="white"
          shadow="xl"
          borderRadius="xl"
          sx={{
            m: "auto",
            mt: 5,
            display: "flex",
            flexDirection: "column",
          }}>
            <MKBox display="flex" justifyContent="space-between" p={2}>
              <MKTypography variant="h5">{isEdit ? "Cập nhật dịch vụ" : "Thêm dịch vụ"}</MKTypography>
              <CloseIcon sx={{ cursor: "pointer" }} onClick={isEdit ? toggleEditModal : toggleAddModal} />
            </MKBox>
            <Divider />
            <MKBox p={2} sx={{ overflowY: "auto", flexGrow: 1 }} display="flex" flexDirection="column" gap={2}>
              <MKInput label="Tên dịch vụ" fullWidth name="service_name" value={form.service_name} onChange={(e) => handleInputChange(e, isEdit)} />
              <MKInput label="Giá" fullWidth name="price" value={form.price} onChange={(e) => handleInputChange(e, isEdit)} />
              <MKInput label="Thời lượng (phút)" fullWidth name="duration_minute" value={form.duration_minute} onChange={(e) => handleInputChange(e, isEdit)} />
              <MKInput label="Loại dịch vụ" fullWidth name="service_type" value={form.service_type} onChange={(e) => handleInputChange(e, isEdit)} />
              <MKInput label="Mô tả" fullWidth name="description" value={form.description} onChange={(e) => handleInputChange(e, isEdit)} />
              
              <MKButton variant="outlined" size="small" color="info" component="label">
                Chọn ảnh bìa cho dịch vụ
                <input type="file" hidden onChange={(e) => handleImageUpload(e, isEdit)} />
              </MKButton>
              {form.service_image && (
                <img src={`http://localhost:5000${form.service_image}`} alt="Preview" style={{ width: "100px", marginTop: "10px", borderRadius: "8px" }} />
              )}

              <MKTypography variant="subtitle2">Nội dung chi tiết</MKTypography>
              <ReactQuill  style={{ height: "400px",  }} value={form.service_contents} onChange={(value) => isEdit ? setFormEdit((prev) => ({ ...prev, service_contents: value })) : setFormAdd((prev) => ({ ...prev, service_contents: value }))} />
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
          <Typography variant="h6" color="white">Services Table</Typography>
        </CardHeader>

        <CardBody className="overflow-x-scroll px-0 pt-0 pb-2">
          <div className="flex items-center gap-2 justify-between px-2 py-1">
            <MKButton onClick={toggleAddModal} className="flex items-center gap-2" variant="gradient" color="dark">
              Thêm <PlusCircleIcon className="w-5 h-5 text-white" />
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
                {["ID", "Tên", "Giá", "Thời lượng", "Loại", "Hành động"].map((el) => (
                  <th key={el} className="border-b border-blue-gray-50 py-3 px-5 text-left">
                    <Typography variant="small" className="text-[11px] font-bold uppercase text-blue-gray-400">{el}</Typography>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {paginatedServices.map(({ service_id, service_name, price, duration_minute, service_type }, index) => {
                const className = `py-3 px-5 ${index === services.length - 1 ? "" : "border-b border-blue-gray-50"}`;
                return (
                  <tr key={service_id}>
                    <td className={className}><Typography className="text-sm">{service_id}</Typography></td>
                    <td className={className}><Typography className="text-sm">{service_name}</Typography></td>
                    <td className={className}><Typography className="text-sm">{parseInt(price).toLocaleString()} ₫</Typography></td>
                    <td className={className}><Typography className="text-sm">{duration_minute} phút</Typography></td>
                    <td className={className}><Typography className="text-sm">{service_type}</Typography></td>
                    <td className={className}>
                      <Icon sx={{ cursor: "pointer", mr: 1 }} onClick={() => handleEdit(service_id)}>edit</Icon>
                      <Icon sx={{ cursor: "pointer" }} onClick={() => handleDelete(service_id)}>delete</Icon>
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
                <MKPagination key={i} item active={i + 1 === currentPage} onClick={() => setCurrentPage(i + 1)}>
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

export default Services;

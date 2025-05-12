import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import {
  Card, CardHeader, CardBody, Typography, Alert,
} from "@material-tailwind/react";
import { PlusCircleIcon } from "@heroicons/react/24/outline";
import Modal from "@mui/material/Modal";
import Divider from "@mui/material/Divider";
import CloseIcon from "@mui/icons-material/Close";
import Icon from "@mui/material/Icon";
import InputAdornment from "@mui/material/InputAdornment";
import SearchIcon from "@mui/icons-material/Search";

import MKBox from "components/MKBox";
import MKButton from "components/MKButton";
import MKTypography from "components/MKTypography";
import MKInput from "components/MKInput";
import MKPagination from "components/MKPagination";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

export function News() {
  const [news, setNews] = useState([]);
  const [search, setSearch] = useState("");
  const [alert, setAlert] = useState({ open: false, color: "green", message: "" });

  const [formAdd, setFormAdd] = useState({ new_title: "", new_content: "<p></p>", new_image: "", new_description: "", new_type: 1 });
  const [formEdit, setFormEdit] = useState({ new_title: "", new_content: "<p></p>", new_image: "", new_description: "", new_type: 1 });


  const [openAddModal, setOpenAddModal] = useState(false);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [editId, setEditId] = useState(null);
  const [editorVisible, setEditorVisible] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const filtered = news.filter((n) =>
    n.new_title.toLowerCase().includes(search.toLowerCase())
  );

  const paginated = filtered.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
  const totalPages = Math.ceil(filtered.length / itemsPerPage);

  useEffect(() => { setCurrentPage(1); }, [search]);

  useEffect(() => {
    axios.get("http://localhost:5000/api/news")
      .then(res => setNews(res.data))
      .catch(err => console.error(err));
  }, []);

  const showAlert = (color, message) => {
    setAlert({ open: true, color, message });
    setTimeout(() => setAlert({ ...alert, open: false }), 2000);
  };

  const toggleAddModal = () => {
    setOpenAddModal(true);
    setTimeout(() => setEditorVisible(true), 100);
  };

  const toggleEditModal = () => {
    setOpenEditModal(true);
    setTimeout(() => setEditorVisible(true), 100);
  };

  const handleAfterOpenModal = () => {
    setEditorVisible(true);
  };

  const handleCloseModal = () => {
    setOpenAddModal(false);
    setEditorVisible(false);
  };

  const handleCloseEditModal = () => {
    setOpenEditModal(false);
    setEditorVisible(false);
  };

  const handleInputChange = (e, isEdit) => {
    const { name, value } = e.target;
    if (isEdit) {
      setFormEdit(prev => ({ ...prev, [name]: value }));
    } else {
      setFormAdd(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleAddSubmit = async () => {
    try {
      const res = await axios.post("http://localhost:5000/api/news", formAdd);
      setNews(prev => [{ ...formAdd, new_id: res.data.new_id, new_time: new Date() }, ...prev]);
      showAlert("green", "Thêm tin tức thành công!");
      setFormAdd({ new_title: "", new_content: "", new_image: "", new_description: "", new_type: 1 });
      handleCloseModal();
    } catch (err) {
      console.error(err);
      showAlert("red", "Lỗi khi thêm tin tức!");
    }
  };

  const handleEditSubmit = async () => {
    try {
      await axios.put(`http://localhost:5000/api/news/${editId}`, formEdit);
      setNews(prev =>
        prev.map((n) => (n.new_id === editId ? { ...n, ...formEdit } : n))
      );
      showAlert("green", "Cập nhật tin tức thành công!");
      handleCloseEditModal();
    } catch (err) {
      console.error(err);
      showAlert("red", "Lỗi khi cập nhật tin tức!");
    }
  };

  const handleEdit = (id) => {
    const item = news.find((n) => n.new_id === id);
    if (item) {
      setEditId(id);
      setFormEdit({
        ...item,
        new_content: item.new_content || "", // Đảm bảo giá trị không phải null
      });
      toggleEditModal();
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/news/${id}`);
      setNews(prev => prev.filter(n => n.new_id !== id));
      showAlert("green", "Xóa tin tức thành công!");
    } catch (err) {
      console.error(err);
      showAlert("red", "Lỗi khi xóa tin tức!");
    }
  };

  const quillRef = useRef(null);

// 1. Khai báo handleImageInsert trước
const handleImageInsert = () => {
  const input = document.createElement("input");
  input.setAttribute("type", "file");
  input.setAttribute("accept", "image/*");
  input.click();

  input.onchange = async () => {
    const file = input.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        const editor = quillRef.current?.getEditor();
        const range = editor?.getSelection(true);
        if (range) {
          editor.insertEmbed(range.index, "image", reader.result);
        } else {
          editor.insertEmbed(editor.getLength(), "image", reader.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };
};

// 2. Sau đó mới định nghĩa quillModules
const quillModules = {
  toolbar: {
    container: [
      [{ header: [1, 2, 3, false] }],
      ["bold", "italic", "underline", "strike"],
      [{ list: "ordered" }, { list: "bullet" }],
      [{ align: [] }],
      ["link", "image"],
      ["clean"],
    ],
    handlers: {
      image: handleImageInsert,
    },
  },
};

// 3. Formats giữ nguyên
const quillFormats = [
  "header", "bold", "italic", "underline", "strike",
  "list", "bullet", "align",
  "link", "image",
];

  

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
        setFormEdit(prev => ({ ...prev, new_image: imageUrl }));
      } else {
        setFormAdd(prev => ({ ...prev, new_image: imageUrl }));
      }
    } catch (err) {
      console.error("Image upload error:", err);
      showAlert("red", "Lỗi khi tải ảnh lên!");
    }
  };
  

  const renderModal = (isEdit = false) => {
    const form = isEdit ? formEdit : formAdd;
    console.log("Form Add:", formAdd);
    console.log("Form Edit:", formEdit);
    return (
        <Modal
        open={isEdit ? openEditModal : openAddModal}
        onClose={isEdit ? handleCloseEditModal : handleCloseModal}
        keepMounted
      >
        <MKBox
          width="90%"
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
          }}
        >
          <MKBox p={2} display="flex" justifyContent="space-between">
            <MKTypography variant="h5">
              {isEdit ? "Cập nhật tin tức" : "Thêm tin tức"}
            </MKTypography>
            <CloseIcon sx={{ cursor: "pointer" }} onClick={isEdit ? handleCloseEditModal : handleCloseModal} />
          </MKBox>

          <Divider />

          <MKBox p={2} px={5}  sx={{ overflowY: "auto", flexGrow: 1 }} display="flex" flexDirection="column" gap={2}>
            <MKInput
              label="Tiêu đề"
              name="new_title"
              value={form.new_title}
              onChange={(e) => handleInputChange(e, isEdit)}
              fullWidth
            />

            <MKTypography variant="caption" color="text" fontWeight="medium">Nội dung</MKTypography>

            <MKBox style={{ height: "400px",marginBottom: "40px" }}>
              {editorVisible && (
                <ReactQuill
                theme="snow"
                value={form.new_content || ""}
                onChange={(value) => {
                    if (isEdit) {
                    setFormEdit((prev) => ({ ...prev, new_content: value }));
                    } else {
                    setFormAdd((prev) => ({ ...prev, new_content: value }));
                    }
                }}

                style={{ height: "400px",  }}
                />

              )}
            </MKBox>

            <MKButton  variant="outlined" size="small" color="info" component="label">
              Chọn ảnh bìa cho bài viết
              <input type="file" hidden onChange={(e) => handleImageUpload(e, isEdit)} />
            </MKButton>
            {form.new_image && (
            <img
                src={`http://localhost:5000${form.new_image}`}
                alt="Preview"
                style={{ width: "100px", marginTop: "10px", borderRadius: "8px" }}
            />
            )}


            <MKInput
              label="Mô tả"
              name="new_description"
              value={form.new_description}
              onChange={(e) => handleInputChange(e, isEdit)}
              fullWidth
              multiline 
              rows={4}
            />
          </MKBox>

          <Divider />

          <MKBox p={2} display="flex" justifyContent="space-between">
            <MKButton variant="gradient" color="dark" onClick={isEdit ? handleCloseEditModal : handleCloseModal}>
              Đóng
            </MKButton>
            <MKButton variant="gradient" color="info" onClick={isEdit ? handleEditSubmit : handleAddSubmit}>
              {isEdit ? "Cập nhật" : "Lưu"}
            </MKButton>
          </MKBox>
        </MKBox>
      </Modal>
    );
  };

  return (
    <div className="mt-12 mb-8 flex flex-col gap-12">
      {alert.open && (
        <div className="fixed top-10 left-1/2 -translate-x-1/2 z-50">
          <Alert color={alert.color}>{alert.message}</Alert>
        </div>
      )}

      <Card>
        <CardHeader variant="gradient" color="gray" className="mb-8 p-6 flex justify-between items-center">
          <Typography variant="h6" color="white">News Table</Typography>
        </CardHeader>

        <CardBody className="overflow-x-scroll px-0 pt-0 pb-2">
          <div className="flex justify-between items-center px-4 py-2">
            <MKButton onClick={toggleAddModal} className="flex items-center gap-2" variant="gradient" color="dark">
              Thêm <PlusCircleIcon className="w-5 h-5 text-white" />
            </MKButton>
            <MKInput
              placeholder="Tìm kiếm..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
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
                {["ID", "Tiêu đề", "Ngày đăng", "Mô tả", "Hành động"].map((h) => (
                  <th key={h} className="border-b border-blue-gray-50 py-3 px-5 text-left">
                    <Typography variant="small" className="text-[11px] font-bold uppercase text-blue-gray-400">
                      {h}
                    </Typography>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {paginated.map(({ new_id, new_title, new_time, new_description }) => (
                <tr key={new_id}>
                  <td className="py-3 px-5"><Typography className="text-sm font-medium">{new_id}</Typography></td>
                  <td className="py-3 px-5"><Typography className="text-sm">{new_title}</Typography></td>
                  <td className="py-3 px-5"><Typography className="text-sm">{new Date(new_time).toLocaleDateString()}</Typography></td>
                  <td className="py-3 px-5"><Typography className="text-sm">{new_description}</Typography></td>
                  <td className="py-3 px-5">
                    <Icon sx={{ cursor: "pointer", mr: 1 }} onClick={() => handleEdit(new_id)}>
                      edit
                    </Icon>
                    <Icon sx={{ cursor: "pointer" }} onClick={() => handleDelete(new_id)}>
                      delete
                    </Icon>
                  </td>
                </tr>
              ))}
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

     {/* Add Modal */}
    {openAddModal && renderModal()}

    {/* Edit Modal */}
    {openEditModal && renderModal(true)}

    </div>
  );
}

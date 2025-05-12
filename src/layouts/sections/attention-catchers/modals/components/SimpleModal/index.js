import React, { useState, useEffect } from "react";
import axios from "axios";
import PropTypes from "prop-types";
import {
  Container,
  Grid,
  Modal,
  Divider,
  Slide,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import MKBox from "components/MKBox";
import MKInput from "components/MKInput";
import MKButton from "components/MKButton";
import MKTypography from "components/MKTypography";
import MKDatePicker from "components/MKDatePicker";
import dayjs from "dayjs";

function SimpleModal({ open, onClose }) {
  const [fullName, setFullName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [email, setEmail] = useState("");
  const [dateOfVisit, setDateOfVisit] = useState(null);
  const [note, setNote] = useState("");
  const [services, setServices] = useState([]);
  const [selectedService, setSelectedService] = useState("");
  const [selectedTimeSlot, setSelectedTimeSlot] = useState("");

  useEffect(() => {
    axios
      .get("http://localhost:5000/api/services")
      .then((res) => setServices(res.data))
      .catch((err) => console.error("Error fetching services:", err));
  }, []);

  const generateTimeSlots = () => {
    const slots = [];
    let start = new Date();
    start.setHours(9, 0, 0, 0);
    for (let i = 0; i <= 21; i++) {
      const hours = start.getHours().toString().padStart(2, "0");
      const minutes = start.getMinutes().toString().padStart(2, "0");
      slots.push(`${hours}:${minutes}`);
      start.setMinutes(start.getMinutes() + 30);
    }
    return slots;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const missingFields = [];
    if (!fullName.trim()) missingFields.push("Họ và tên");
    if (!email.trim()) missingFields.push("Email");
    if (!dateOfVisit) missingFields.push("Ngày đến");
    if (!selectedService) missingFields.push("Dịch vụ");
    if (!selectedTimeSlot) missingFields.push("Khung giờ");

    if (missingFields.length > 0) {
      alert(`Vui lòng điền đầy đủ thông tin: ${missingFields.join(", ")}`);
      return;
    }

    const formattedTime = `${selectedTimeSlot}:00`;
    const appointmentData = {
      full_name: fullName,
      phone_number: phoneNumber,
      email: email,
      date_of_visit: dayjs(dateOfVisit).format("YYYY-MM-DD"),
      service_id: Number(selectedService),
      time_slot: formattedTime,
      note: note,
    };

    console.log("Appointment data:", appointmentData);

    axios
      .post("http://localhost:5000/api/appointments", appointmentData)
      .then((res) => {
        console.log("Appointment response:", res.data);
        if (res.data.success) {
          alert("Đặt lịch thành công!");
          onClose();
        } else {
          alert("Lỗi: " + res.data.message);
        }
      })
      .catch((err) => {
        console.error("Error during appointment:", err);
        alert("Lỗi server, vui lòng thử lại.");
      });
  };

  return (
    <Modal open={open} onClose={onClose} sx={{ display: "grid", placeItems: "center" }}>
      <Slide direction="down" in={open} timeout={500}>
        <MKBox
          position="relative"
          width="600px"
          maxHeight="90vh"
          overflow="auto"
          display="flex"
          flexDirection="column"
          borderRadius="xl"
          bgColor="white"
          shadow="xl"
          p={3}
        >
          <MKBox display="flex" alignItems="center" justifyContent="space-between" mb={2}>
            <MKTypography variant="h5">Đặt lịch Spa</MKTypography>
            <CloseIcon fontSize="medium" sx={{ cursor: "pointer" }} onClick={onClose} />
          </MKBox>

          <Divider sx={{ my: 1 }} />

          <Container>
            <form onSubmit={handleSubmit}>
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <MKInput
                    variant="standard"
                    label="Họ và tên"
                    fullWidth
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <MKInput
                    variant="standard"
                    label="Số điện thoại"
                    fullWidth
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <MKInput
                    variant="standard"
                    type="email"
                    label="Email"
                    fullWidth
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <MKDatePicker
                    label="Ngày đến"
                    fullWidth
                    inputProps={{ placeholder: "DD/MM/YYYY" }}
                    value={dateOfVisit || null}
                    onChange={(selectedDates) => {
                      const selected = selectedDates?.[0] || null;
                      setDateOfVisit(selected);
                    }}
                    renderInput={(props) => (
                      <MKInput {...props} InputLabelProps={{ shrink: true }} />
                    )}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <FormControl fullWidth variant="standard" sx={{ minHeight: 58 }}>
                    <InputLabel id="service-label" shrink>
                      Dịch vụ
                    </InputLabel>
                    <Select
                      labelId="service-label"
                      value={selectedService}
                      onChange={(e) => setSelectedService(e.target.value)}
                      displayEmpty
                      sx={{ paddingTop: "10px", fontSize: "16px" }}
                      renderValue={(val) => {
                        if (!val) return <em>Chọn dịch vụ</em>;
                        const svc = services.find((s) => String(s.service_id) === val);
                        return svc
                          ? `${svc.service_name} – ${svc.price} VND (${svc.duration_minute} phút)`
                          : "Dịch vụ không tồn tại";
                      }}
                    >
                      <MenuItem disabled value="">
                        <em>Chọn dịch vụ</em>
                      </MenuItem>
                      {services.map((service) => (
                        <MenuItem key={service.service_id} value={String(service.service_id)}>
                          {service.service_name} – {service.price} VND ({service.duration_minute} phút)
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} md={6}>
                  <FormControl fullWidth variant="standard" sx={{ minHeight: 58 }}>
                    <InputLabel id="time-slot-label" shrink>
                      Khung giờ
                    </InputLabel>
                    <Select
                      labelId="time-slot-label"
                      value={selectedTimeSlot}
                      onChange={(e) => setSelectedTimeSlot(e.target.value)}
                      displayEmpty
                      sx={{ paddingTop: "10px", fontSize: "16px" }}
                    >
                      <MenuItem disabled value="">
                        <em>Chọn khung giờ</em>
                      </MenuItem>
                      {generateTimeSlots().map((slot, index) => (
                        <MenuItem key={index} value={slot}>
                          {slot}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12}>
                  <MKInput
                    variant="standard"
                    label="Nhập yêu cầu"
                    multiline
                    fullWidth
                    rows={4}
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                  />
                </Grid>
                <Grid item xs={12}>
                  <MKButton type="submit" variant="gradient" color="primary" fullWidth>
                    Đăng ký
                  </MKButton>
                </Grid>
              </Grid>
            </form>
          </Container>
        </MKBox>
      </Slide>
    </Modal>
  );
}

SimpleModal.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default SimpleModal;

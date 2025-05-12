import React, { useEffect, useState } from "react";
import {
  Card,
  CardHeader,
  CardBody,
  Typography,
  Alert,
  Chip
} from "@material-tailwind/react";
import axios from "axios";

import MKBox from "components/MKBox";
import MKInput from "components/MKInput";
import MKTypography from "components/MKTypography";
import MKPagination from "components/MKPagination";
import InputAdornment from "@mui/material/InputAdornment";
import SearchIcon from "@mui/icons-material/Search";

export function Reminders() {
  const [reminders, setReminders] = useState([]);
  const [searchKeyword, setSearchKeyword] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const filteredReminders = reminders.filter((r) =>
    r.full_name?.toLowerCase().includes(searchKeyword.toLowerCase()) ||
    r.email?.toLowerCase().includes(searchKeyword.toLowerCase())
  );

  const totalPages = Math.ceil(filteredReminders.length / itemsPerPage);
  const paginatedReminders = filteredReminders.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  useEffect(() => {
    axios
      .get("http://localhost:5000/api/reminders")
      .then((res) => setReminders(res.data))
      .catch((err) => console.error(err));
  }, []);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchKeyword]);

  return (
    <div className="mt-12 mb-8 flex flex-col gap-12">
      <Card>
        <CardHeader variant="gradient" color="gray" className="mb-8 p-6 justify-between flex">
          <Typography variant="h6" color="white">
            Reminders Table
          </Typography>
        </CardHeader>

        <CardBody className="overflow-x-scroll px-0 pt-0 pb-2">
          <div className="flex items-center justify-end px-4 py-2">
            <MKInput
              variant="standard"
              placeholder="Tìm kiếm khách hàng"
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

          <table className="w-full min-w-[900px] table-auto">
            <thead>
              <tr>
                {["ID", "Tên khách", "Email", "Thời gian nhắc", "Phương thức", "Trạng thái", "Ngày hẹn", "Giờ hẹn"].map((el) => (
                  <th key={el} className="border-b border-blue-gray-50 py-3 px-5 text-left">
                    <Typography variant="small" className="text-[11px] font-bold uppercase text-blue-gray-400">
                      {el}
                    </Typography>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {paginatedReminders.map((reminder, index) => {
                const className = `py-3 px-5 ${index === reminders.length - 1 ? "" : "border-b border-blue-gray-50"}`;
                return (
                  <tr key={reminder.reminder_id}>
                    <td className={className}><Typography className="text-sm text-blue-gray-700">{reminder.reminder_id}</Typography></td>
                    <td className={className}><Typography className="text-sm text-blue-gray-700">{reminder.full_name}</Typography></td>
                    <td className={className}><Typography className="text-sm text-blue-gray-700">{reminder.email}</Typography></td>
                    <td className={className}><Typography className="text-sm text-blue-gray-700">{new Date(reminder.reminder_time).toLocaleString()}</Typography></td>
                    <td className={className}><Typography className="text-sm text-blue-gray-700">{reminder.method}</Typography></td>
                    <td className={className}><Typography className="text-sm text-blue-gray-700">
                    <Chip
                      variant="gradient"
                      color={reminder.status === "Sent" ? "green" : "blue-gray"}
                      value={reminder.status === "Sent" ? "Sent" : "Pending"}
                      className="py-0.5 px-2 text-[11px] font-medium w-fit"
                    />
                    </Typography></td>
                    <td className={className}><Typography className="text-sm text-blue-gray-700">{new Date(reminder.reminder_time).toLocaleDateString()}</Typography></td>
                    <td className={className}><Typography className="text-sm text-blue-gray-700">{new Date(reminder.appointment_time).toISOString().substring(11, 19)}</Typography></td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          <div className="flex justify-center py-4">
            <MKPagination>
              <MKPagination item onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}>
                <span className="material-icons">keyboard_arrow_left</span>
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
                <span className="material-icons">keyboard_arrow_right</span>
              </MKPagination>
            </MKPagination>
          </div>
        </CardBody>
      </Card>
    </div>
  );
}

export default Reminders;

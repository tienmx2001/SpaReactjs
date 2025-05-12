
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const moment = require('moment-timezone');
const { sql, poolPromise } = require('./db.js'); // MSSQL connection
const multer = require('multer');
const path = require('path');
const router = express.Router();
const app = express();
app.use(bodyParser.json({ limit: '10mb' }));

const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

app.use("/assets", express.static(path.join(__dirname, "public/uploads")));


const fs = require('fs');
const uploadDir = path.join(__dirname, 'public/uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}
// ======================== MULTER UPLOAD ========================
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, 'public/uploads')); // lưu vào public/uploads
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname);
    cb(null, `${Date.now()}${ext}`);
  },
});


const upload = multer({ storage });

app.post("/api/upload", upload.single("image"), (req, res) => {
  const filePath = `/assets/${req.file.filename}`; // vì ảnh nằm trong /assets
  res.json({ url: filePath });
});

// ========================== API ===============================

app.use(cors({
  origin: "http://localhost:3000",
  credentials: true, // để gửi cookie qua request
}));

const session = require('express-session');

app.use(session({
  secret: process.env.API_KEY_USER, // thay bằng chuỗi bí mật bảo mật
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge: 24 * 60 * 60 * 1000, // 1 ngày
    httpOnly: true,
  }
}));

// Login user
app.post('/api/users', async (req, res) => {
  try {
    const { email, password } = req.body;
    const pool = await poolPromise;
    const result = await pool
      .request()
      .input('email', sql.VarChar, email)
      .input('password', sql.VarChar, password)
      .query('SELECT * FROM [User] WHERE email = @email AND password = @password');

    if (result.recordset.length > 0) {
      // Lưu user vào session
      req.session.user = {
        id: result.recordset[0].id,
        email: result.recordset[0].email
      };

      res.json({ success: true, message: 'Đăng nhập thành công!' });
    } else {
      res.json({ success: false, message: 'Thông tin đăng nhập không chính xác.' });
    }
  } catch (err) {
    console.error('Error during login:', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});
app.post('/api/logout', (req, res) => {
  req.session.destroy(err => {
    if (err) {
      return res.status(500).json({ success: false, message: 'Đăng xuất thất bại' });
    }
    res.clearCookie('connect.sid'); // xoá cookie nếu cần
    res.json({ success: true, message: 'Đã đăng xuất' });
  });
});


app.get('/api/check-auth', (req, res) => {
  if (req.session.user) {
    res.json({ success: true, user: req.session.user });
  } else {
    res.json({ success: false });
  }
});




// Register new customer
app.post('/api/register', async (req, res) => {
  try {
    const { full_name, phone_number, email, date_of_visit } = req.body;

    if (!full_name || !email || !date_of_visit) {
      return res.status(400).json({ success: false, message: 'Vui lòng điền đầy đủ thông tin!' });
    }

    const pool = await poolPromise;

    const existingUser = await pool
      .request()
      .input('email', sql.VarChar, email)
      .query('SELECT * FROM Customers WHERE email = @email');

    if (existingUser.recordset.length > 0) {
      return res.status(400).json({ success: false, message: 'Email này đã được sử dụng.' });
    }

    await pool
      .request()
      .input('full_name', sql.NVarChar, full_name)
      .input('phone_number', sql.NVarChar, phone_number)
      .input('email', sql.NVarChar, email)
      .input('date_of_visit', sql.Date, date_of_visit)
      .query(`
        INSERT INTO Customers (full_name, phone_number, email, date_of_visit)
        VALUES (@full_name, @phone_number, @email, @date_of_visit)
      `);

    res.json({ success: true, message: 'Đăng ký thành công!' });
  } catch (err) {
    console.error('Error during registration:', err);
    res.status(500).json({ success: false, message: 'Lỗi server, vui lòng thử lại sau.' });
  }
});

// ==================== SERVICES ======================

// Get all services
app.get('/api/services', async (req, res) => {
  try {
    const pool = await poolPromise;
    const result = await pool
      .request()
      .query('SELECT * FROM Services');
    res.json(result.recordset);
  } catch (err) {
    console.error('Error fetching services:', err);
    res.status(500).json({ success: false, message: 'Lỗi khi lấy danh sách dịch vụ' });
  }
});

// Get all services with id

app.get('/api/services/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const pool = await poolPromise;
    const result = await pool
      .request()
      .input('service_id', sql.Int, id)
      .query('SELECT * FROM Services WHERE service_id = @service_id');

    if (result.recordset.length === 0) {
      return res.status(404).json({ success: false, message: 'Không tìm thấy dịch vụ' });
    }

    res.json(result.recordset[0]);
  } catch (err) {
    console.error('Error fetching service by ID:', err);
    res.status(500).json({ success: false, message: 'Lỗi khi lấy chi tiết dịch vụ' });
  }
});

// Create a new service
app.post('/api/services', async (req, res) => {
  try {
    const {
      service_name,
      description,
      price,
      duration_minute,
      service_type,
      service_image,
      service_contents
    } = req.body;

    const pool = await poolPromise;

    const checkResult = await pool
      .request()
      .input('service_name', sql.NVarChar, service_name)
      .query('SELECT * FROM Services WHERE service_name = @service_name');

    if (checkResult.recordset.length > 0) {
      return res.status(400).json({ success: false, message: 'Dịch vụ đã tồn tại.' });
    }

    const result = await pool
      .request()
      .input('service_name', sql.NVarChar, service_name)
      .input('description', sql.NVarChar, description)
      .input('price', sql.Decimal(10, 2), price)
      .input('duration_minute', sql.Int, duration_minute)
      .input('service_type', sql.Int, service_type)
      .input('service_image', sql.NVarChar(255), service_image)
      .input('service_contents', sql.NVarChar(sql.MAX), service_contents)
      .query(`
        INSERT INTO Services (service_name, description, price, duration_minute, service_type, service_image, service_contents)
        VALUES (@service_name, @description, @price, @duration_minute, @service_type, @service_image, @service_contents);
        SELECT SCOPE_IDENTITY() AS service_id;
      `);

    const service_id = result.recordset[0].service_id;

    res.json({
      success: true,
      message: 'Thêm dịch vụ thành công!',
      service: {
        service_id,
        service_name,
        description,
        price,
        duration_minute,
        service_type,
        service_image,
        service_contents
      }
    });
  } catch (err) {
    console.error('Error creating service:', err);
    res.status(500).json({ success: false, message: 'Lỗi server khi thêm dịch vụ' });
  }
});


// Cập nhật dịch vụ
app.put("/api/services/:id", async (req, res) => {
  const { id } = req.params;
  const {
    service_name,
    price,
    duration_minute,
    description,
    service_type,
    service_image,
    service_contents
  } = req.body;

  try {
    const pool = await poolPromise;

    await pool.request()
      .input("id", sql.Int, id)
      .input("service_name", sql.NVarChar, service_name)
      .input("price", sql.Decimal(10, 2), price)
      .input("duration_minute", sql.Int, duration_minute)
      .input("description", sql.NVarChar, description)
      .input("service_type", sql.Int, service_type)
      .input("service_image", sql.NVarChar(255), service_image)
      .input("service_contents", sql.NVarChar(sql.MAX), service_contents)
      .query(`
        UPDATE Services
        SET service_name = @service_name,
            price = @price,
            duration_minute = @duration_minute,
            description = @description,
            service_type = @service_type,
            service_image = @service_image,
            service_contents = @service_contents
        WHERE service_id = @id
      `);

    const result = await pool.request()
      .input("id", sql.Int, id)
      .query("SELECT * FROM Services WHERE service_id = @id");

    res.json({ message: "Service updated", service: result.recordset[0] });
  } catch (err) {
    console.error("Update error:", err);
    res.status(500).json({ error: "Update failed" });
  }
});



// Xóa dịch vụ
app.delete("/api/services/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const pool = await poolPromise;
    await pool.request()
      .input("id", sql.Int, id)
      .query("DELETE FROM Services WHERE service_id = @id");

    res.json({ message: "Service deleted" });
  } catch (err) {
    console.error("Delete error:", err);
    res.status(500).json({ error: "Delete failed" });
  }
});



// ==================== APPOINTMENTS ======================

app.post('/api/appointments', async (req, res) => {
  try {
    const { full_name, phone_number, email, date_of_visit, service_id, time_slot, note } = req.body;

    if (!full_name || !email || !date_of_visit || !service_id || !time_slot) {
      return res.status(400).json({ success: false, message: 'Thiếu thông tin lịch hẹn' });
    }

    const pool = await poolPromise;

    // Kiểm tra email đã tồn tại chưa
    const existingCustomer = await pool
      .request()
      .input('email', sql.NVarChar, email)
      .query('SELECT * FROM Customers WHERE email = @email');

    if (existingCustomer.recordset.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'Email đã được sử dụng cho một lịch hẹn khác. Vui lòng sử dụng email khác.',
      });
    }

    // Insert customer
    const customerResult = await pool
      .request()
      .input('full_name', sql.NVarChar, full_name)
      .input('phone_number', sql.NVarChar, phone_number)
      .input('email', sql.NVarChar, email)
      .query(`
        INSERT INTO Customers (full_name, phone_number, email)
        VALUES (@full_name, @phone_number, @email);
        SELECT SCOPE_IDENTITY() AS customer_id;
      `);
    const customerId = customerResult.recordset[0].customer_id;

    // Convert time_slot to time only (HH:mm:ss)
    const appointmentTimeOnly = time_slot;    
  // Insert appointment
  const appointmentResult = await pool
    .request()
    .input('customer_id', sql.Int, customerId)
    .input('service_id', sql.Int, service_id)
    .input('appointment_time', sql.VarChar, appointmentTimeOnly)
    .input('note', sql.NVarChar, note || '')
    .input('date_of_visit', sql.Date, date_of_visit)
    .query(`
      INSERT INTO Appointments (customer_id, service_id, appointment_time, status, note, date_of_visit)
      VALUES (@customer_id, @service_id, @appointment_time, 'Scheduled', @note,@date_of_visit);
      SELECT SCOPE_IDENTITY() AS appointment_id;
    `);

      const appointmentId = appointmentResult.recordset[0].appointment_id;
      const reminderDateTime = moment.tz(
        `${date_of_visit} ${appointmentTimeOnly}`,
        'YYYY-MM-DD HH:mm',
        'Asia/Ho_Chi_Minh'
      ).utc().toDate();
      // Insert reminder
      try {
        await pool
          .request()
          .input('appointment_id', sql.Int, appointmentId)
          .input('reminder_time', sql.DateTime, reminderDateTime)
          .query(`
            INSERT INTO Reminders (appointment_id, reminder_time, method, status)
            VALUES (@appointment_id, @reminder_time, 'Email', 'Pending');
          `);
      } catch (reminderErr) {
        console.warn("Reminder insert failed, but ignoring:", reminderErr.message);
      }

      res.json({ success: true, message: 'Đặt lịch thành công!' });

    } catch (err) {
      console.error('Error creating appointment:', err);
      res.status(500).json({ success: false, message: 'Lỗi server khi đặt lịch' });
    }
  });
// ==================== Customer ======================
// Get all customers
app.get('/api/customers', async (req, res) => {
  try {
    const pool = await poolPromise;
    const result = await pool
      .request()
      .query(`
        SELECT 
          c.customer_id,
          c.full_name,
          c.phone_number,
          c.email,
          a.appointment_time,
          a.status,
          a.note,
          a.date_of_visit
        FROM Customers c
        LEFT JOIN Appointments a ON c.customer_id = a.customer_id
      `);
    
    res.json(result.recordset);
  } catch (err) {
    console.error('Error fetching customers with appointments:', err);
    res.status(500).json({ success: false, message: 'Lỗi khi lấy danh sách khách hàng' });
  }
});


// Create a new customer
app.post('/api/customers', async (req, res) => {
  try {
    const { full_name, phone_number, email, address } = req.body;

    if (!full_name || !email) {
      return res.status(400).json({ success: false, message: 'Vui lòng nhập đầy đủ họ tên và email' });
    }

    const pool = await poolPromise;

    const check = await pool
      .request()
      .input('email', sql.NVarChar, email)
      .query('SELECT * FROM Customers WHERE email = @email');

    if (check.recordset.length > 0) {
      return res.status(400).json({ success: false, message: 'Email đã tồn tại' });
    }

    const result = await pool
      .request()
      .input('full_name', sql.NVarChar, full_name)
      .input('phone_number', sql.NVarChar, phone_number)
      .input('email', sql.NVarChar, email)
      .input('address', sql.NVarChar, address)
      .query(`
        INSERT INTO Customers (full_name, phone_number, email, address, created_at)
        VALUES (@full_name, @phone_number, @email, @address, GETDATE());
        SELECT SCOPE_IDENTITY() AS customer_id;
      `);

    res.json({
      success: true,
      message: 'Thêm khách hàng thành công!',
      customer_id: result.recordset[0].customer_id
    });
  } catch (err) {
    console.error('Error creating customer:', err);
    res.status(500).json({ success: false, message: 'Lỗi server khi thêm khách hàng' });
  }
});

// Update customer
app.put('/api/customers/:id', async (req, res) => {
  const { id } = req.params;
  const { full_name, phone_number, email, address } = req.body;

  try {
    const pool = await poolPromise;
    await pool.request()
      .input("id", sql.Int, id)
      .input("full_name", sql.NVarChar, full_name)
      .input("phone_number", sql.NVarChar, phone_number)
      .input("email", sql.NVarChar, email)
      .input("address", sql.NVarChar, address)
      .query(`
        UPDATE Customers
        SET full_name = @full_name,
            phone_number = @phone_number,
            email = @email,
            address = @address
        WHERE customer_id = @id
      `);

    const updated = await pool.request()
      .input("id", sql.Int, id)
      .query("SELECT * FROM Customers WHERE customer_id = @id");

    res.json({ message: 'Cập nhật thành công', customer: updated.recordset[0] });
  } catch (err) {
    console.error("Update customer error:", err);
    res.status(500).json({ error: 'Lỗi khi cập nhật khách hàng' });
  }
});
// Edit customer
app.put('/api/customers/:id', async (req, res) => {
  const { id } = req.params;
  const { full_name, phone_number, email, address } = req.body;

  try {
    const pool = await poolPromise;
    await pool.request()
      .input("id", sql.Int, id)
      .input("full_name", sql.NVarChar, full_name)
      .input("phone_number", sql.NVarChar, phone_number)
      .input("email", sql.NVarChar, email)
      .input("address", sql.NVarChar, address)
      .query(`
        UPDATE Customers
        SET full_name = @full_name,
            phone_number = @phone_number,
            email = @email,
            address = @address
        WHERE customer_id = @id
      `);

    const updated = await pool.request()
      .input("id", sql.Int, id)
      .query("SELECT * FROM Customers WHERE customer_id = @id");

    res.json({ message: 'Cập nhật thành công', customer: updated.recordset[0] });
  } catch (err) {
    console.error("Update customer error:", err);
    res.status(500).json({ error: 'Lỗi khi cập nhật khách hàng' });
  }
});

// ==================== Employees ======================

// Get all employees
app.get('/api/employees', async (req, res) => {
  try {
    const pool = await poolPromise;
    const result = await pool
      .request()
      .query(`SELECT employee_id, full_name, specialization, phone_number, email, hire_date FROM Employees`);
    res.json(result.recordset);
  } catch (err) {
    console.error('Error fetching employees:', err);
    res.status(500).json({ success: false, message: 'Lỗi khi lấy danh sách nhân viên' });
  }
});


// Create a new employee
app.post('/api/employees', async (req, res) => {
  try {
    const { full_name, specialization, phone_number, email, hire_date } = req.body;

    const pool = await poolPromise;

    // Check if email already exists
    const checkResult = await pool
      .request()
      .input('email', sql.NVarChar, email)
      .query('SELECT * FROM Employees WHERE email = @email');

    if (checkResult.recordset.length > 0) {
      return res.status(400).json({ success: false, message: 'Email đã tồn tại.' });
    }

    const result = await pool
      .request()
      .input('full_name', sql.NVarChar, full_name)
      .input('specialization', sql.NVarChar, specialization)
      .input('phone_number', sql.NVarChar, phone_number)
      .input('email', sql.NVarChar, email)
      .input('hire_date', sql.Date, hire_date)
      .query(`
        INSERT INTO Employees (full_name, specialization, phone_number, email, hire_date)
        VALUES (@full_name, @specialization, @phone_number, @email, @hire_date);
        SELECT SCOPE_IDENTITY() AS employee_id;
      `);

    const employee_id = result.recordset[0].employee_id;

    res.json({
      success: true,
      message: 'Thêm nhân viên thành công!',
      employee: { employee_id, full_name, specialization, phone_number, email, hire_date }
    });
  } catch (err) {
    console.error('Error creating employee:', err);
    res.status(500).json({ success: false, message: 'Lỗi server khi thêm nhân viên' });
  }
});

// Edit employee
app.put('/api/employees/:id', async (req, res) => {
  const { id } = req.params;
  const { full_name, specialization, phone_number, email, hire_date } = req.body;

  try {
    const pool = await poolPromise;

    // Check if email belongs to another employee
    const checkResult = await pool.request()
      .input('email', sql.NVarChar, email)
      .input('id', sql.Int, id)
      .query('SELECT * FROM Employees WHERE email = @email AND employee_id != @id');

    if (checkResult.recordset.length > 0) {
      return res.status(400).json({ success: false, message: 'Email đã tồn tại với nhân viên khác.' });
    }

    await pool
      .request()
      .input('id', sql.Int, id)
      .input('full_name', sql.NVarChar, full_name)
      .input('specialization', sql.NVarChar, specialization)
      .input('phone_number', sql.NVarChar, phone_number)
      .input('email', sql.NVarChar, email)
      .input('hire_date', sql.Date, hire_date)
      .query(`
        UPDATE Employees
        SET full_name = @full_name,
            specialization = @specialization,
            phone_number = @phone_number,
            email = @email,
            hire_date = @hire_date
        WHERE employee_id = @id
      `);

    const updated = await pool.request()
      .input('id', sql.Int, id)
      .query('SELECT * FROM Employees WHERE employee_id = @id');

    res.json({ message: 'Employee updated', employee: updated.recordset[0] });
  } catch (err) {
    console.error('Update error:', err);
    res.status(500).json({ error: 'Cập nhật thất bại' });
  }
});

// Delete employee
app.delete('/api/employees/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const pool = await poolPromise;
    await pool
      .request()
      .input('id', sql.Int, id)
      .query('DELETE FROM Employees WHERE employee_id = @id');

    res.json({ message: 'Xóa nhân viên thành công' });
  } catch (err) {
    console.error('Delete error:', err);
    res.status(500).json({ error: 'Lỗi khi xóa nhân viên' });
  }
});

// ==================== REMINDER ======================
const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: process.env.MAIL_ACCOOUNT,
    pass: process.env.MAIL_PASSWORD,
  },
  logger: true,
  debug: true,
});

transporter.verify((err, success) => {
  if (err) {
    console.error("Transporter error:", err);
  } else {
    console.log("Server is ready to take messages");
  }
});

const sendReminderEmail = async (to, subject, text) => {
  try {
    await transporter.sendMail({
      from: process.env.MAIL_ACCOOUNT,
      to,
      subject,
      text,
    });
    console.log("Email sent to:", to);
  } catch (error) {
    console.error("Failed to send email:", error);
  }
};

// Test call

module.exports = { sendReminderEmail };

const cron = require("node-cron");

cron.schedule("* * * * *", async () => {
  console.log("Cron job chạy lúc:", new Date().toLocaleString());

  try {
    const pool = await poolPromise;
    const now = new Date();

    const result = await pool
      .request()
      .input('now', sql.DateTime, now)
      .query(`
        SELECT r.reminder_id, r.reminder_time, r.status,
               c.full_name, c.email, a.appointment_time
        FROM Reminders r
        JOIN Appointments a ON r.appointment_id = a.appointment_id
        JOIN Customers c ON a.customer_id = c.customer_id
        WHERE r.status = 'Pending' AND CAST(r.reminder_time AS DATE) = CAST(@now AS DATE)
      `);

    console.log("Số nhắc nhở cần gửi:", result.recordset.length);

    for (const r of result.recordset) {
      const subject = 'Nhắc nhở lịch hẹn tại Như Mơ Spa';
      const text = `Xin chào ${r.full_name},\n\nĐây là nhắc nhở về cuộc hẹn của bạn vào lúc ${r.reminder_time}.\n\nTrân trọng,\nSpa Clinic`;

      await sendReminderEmail(r.email, subject, text);

      await pool
        .request()
        .input('id', sql.Int, r.reminder_id)
        .query(`UPDATE Reminders SET status = 'Sent' WHERE reminder_id = @id`);

      console.log(`✅ Đã gửi nhắc nhở tới ${r.email}`);
    }
  } catch (err) {
    console.error("❌ Lỗi trong cron job:", err.message);
  }
});





// GET all reminders
app.get("/api/reminders", async (req, res) => {
  try {
    const pool = await poolPromise;
    const result = await pool.query(`
      SELECT r.*, a.customer_id, c.full_name, c.email, a.appointment_time
      FROM Reminders r
      JOIN Appointments a ON r.appointment_id = a.appointment_id
      JOIN Customers c ON a.customer_id = c.customer_id
      ORDER BY r.reminder_time DESC
    `);
    res.json(result.recordset);
  } catch (err) {
    console.error("Error fetching reminders:", err);
    res.status(500).send("Server error");
  }
});

// Update status of a reminder
app.put('/api/reminders/:id/status', async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  try {
    const pool = await poolPromise;

    // Optional: validate status input
    if (typeof status !== 'string' || status.trim() === '') {
      return res.status(400).json({ success: false, message: 'Trạng thái không hợp lệ.' });
    }

    // Update reminder status
    await pool.request()
      .input('id', sql.Int, id)
      .input('status', sql.NVarChar, status)
      .query(`
        UPDATE Reminders
        SET status = @status
        WHERE reminder_id = @id
      `);

    // Fetch updated reminder
    const result = await pool.request()
      .input('id', sql.Int, id)
      .query('SELECT * FROM Reminders WHERE reminder_id = @id');

    if (result.recordset.length === 0) {
      return res.status(404).json({ success: false, message: 'Không tìm thấy nhắc nhở.' });
    }

    res.json({ success: true, message: 'Cập nhật trạng thái thành công.', reminder: result.recordset[0] });
  } catch (err) {
    console.error('Error updating reminder status:', err);
    res.status(500).json({ success: false, message: 'Lỗi máy chủ khi cập nhật trạng thái.' });
  }
});


// POST send reminder by ID
app.post("/send/:id", async (req, res) => {
  const reminder_id = req.params.id;

  try {
    const pool = await poolPromise;

    const result = await pool.query(`
      SELECT r.*, c.email, c.full_name, a.appointment_time
      FROM Reminders r
      JOIN Appointments a ON r.appointment_id = a.appointment_id
      JOIN Customers c ON a.customer_id = c.customer_id
      WHERE r.reminder_id = @reminder_id
    `, { reminder_id });

    const reminder = result.recordset[0];
    if (!reminder) return res.status(404).send("Reminder not found");

    // Simulate sending email (replace with real nodemailer or other service)
    console.log(`Sending reminder to ${reminder.email} for ${reminder.full_name}`);

    // Update status to 'sent'
    await db.query(`
      UPDATE Reminders SET status = 'sent' WHERE reminder_id = @reminder_id
    `, { reminder_id });

    res.send("Reminder sent");
  } catch (err) {
    console.error("Error sending reminder:", err);
    res.status(500).send("Server error");
  }
});



// ==================== News ======================

app.get('/api/news', async (req, res) => {
  try {
    const pool = await poolPromise;
    const result = await pool.request().query(`
      SELECT * FROM News ORDER BY new_time DESC
    `);
    
    // Kiểm tra xem kết quả trả về có hợp lệ không
    if (!result.recordset || result.recordset.length === 0) {
      return res.status(404).json({ success: false, message: 'Không có bài viết nào.' });
    }
    
    res.json(result.recordset); // Trả về dữ liệu JSON
  } catch (err) {
    console.error("Error fetching news:", err);
    res.status(500).json({ success: false, message: "Lỗi khi lấy danh sách tin tức" });
  }
});


// Lấy bài viết theo new_id
app.get('/api/news/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const pool = await poolPromise;
    const result = await pool.request()
      .input('new_id', sql.Int, id)
      .query('SELECT * FROM News WHERE new_id = @new_id');

    if (!result.recordset || result.recordset.length === 0) {
      return res.status(404).json({ success: false, message: 'Không tìm thấy bài viết.' });
    }

    res.json(result.recordset[0]); // Trả về 1 bài viết
  } catch (err) {
    console.error("Error fetching news by ID:", err);
    res.status(500).json({ success: false, message: "Lỗi khi lấy bài viết" });
  }
});

// Thêm bài viết mới
app.post('/api/news', async (req, res) => {
  const { new_type, new_title, new_content, new_image, new_description } = req.body;

  if (!new_title || !new_content) {
    return res.status(400).json({ success: false, message: 'Vui lòng nhập đầy đủ tiêu đề và nội dung' });
  }

  try {
    const pool = await poolPromise;
    const result = await pool.request()
      .input("new_type", sql.Int, new_type)
      .input("new_title", sql.NVarChar, new_title)
      .input("new_content", sql.NVarChar, new_content)
      .input("new_image", sql.NVarChar, new_image)
      .input("new_time", sql.DateTime, new Date())
      .input("new_description", sql.NVarChar, new_description)
      .query(`
        INSERT INTO News (new_type, new_title, new_content, new_image, new_time, new_description)
        VALUES (@new_type, @new_title, @new_content, @new_image, @new_time, @new_description);
        SELECT SCOPE_IDENTITY() AS new_id;
      `);

    res.json({
      success: true,
      message: 'Thêm tin tức thành công!',
      new_id: result.recordset[0].new_id
    });
  } catch (err) {
    console.error("Error creating news:", err);
    res.status(500).json({ success: false, message: 'Lỗi server khi thêm tin tức' });
  }
});

// Cập nhật bài viết
app.put('/api/news/:id', async (req, res) => {
  const { id } = req.params;
  const { new_type, new_title, new_content, new_image, new_description } = req.body;

  try {
    const pool = await poolPromise;
    await pool.request()
      .input("id", sql.Int, id)
      .input("new_type", sql.Int, new_type)
      .input("new_title", sql.NVarChar, new_title)
      .input("new_content", sql.NVarChar, new_content)
      .input("new_image", sql.NVarChar, new_image)
      .input("new_description", sql.NVarChar, new_description)
      .query(`
        UPDATE News
        SET new_type = @new_type,
            new_title = @new_title,
            new_content = @new_content,
            new_image = @new_image,
            new_description = @new_description
        WHERE new_id = @id
      `);

    const updated = await pool.request()
      .input("id", sql.Int, id)
      .query("SELECT * FROM News WHERE new_id = @id");

    res.json({ success: true, message: 'Cập nhật thành công', news: updated.recordset[0] });
  } catch (err) {
    console.error("Update news error:", err);
    res.status(500).json({ success: false, message: 'Lỗi khi cập nhật tin tức' });
  }
});

// Xoá bài viết
app.delete('/api/news/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const pool = await poolPromise;
    await pool.request()
      .input("id", sql.Int, id)
      .query("DELETE FROM News WHERE new_id = @id");

    res.json({ success: true, message: "Xóa tin tức thành công!" });
  } catch (err) {
    console.error("Delete news error:", err);
    res.status(500).json({ success: false, message: "Lỗi khi xóa tin tức" });
  }
});

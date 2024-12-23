import api from "../untils/api";

// Fetch all accounts with filters and pagination
export const getAccounts = async (filters, currentPage) => {
  try {
    const response = await api.get("/accounts", {
      params: {
        page: currentPage,              // Số trang hiện tại
        username: filters.username,     // Lọc theo username
        email: filters.email,           // Lọc theo email
        status: filters.status,         // Lọc theo trạng thái
      },
    });
    return response.data; // Trả về dữ liệu từ API
  } catch (error) {
    console.error("Error fetching accounts:", error);
    if (error.response) {
      // Nếu server trả về lỗi
      throw new Error(`Error ${error.response.status}: ${error.response.data.message || 'Unknown error'}`);
    } else if (error.request) {
      // Nếu không có phản hồi từ server
      throw new Error('No response from server');
    } else {
      // Nếu có lỗi không mong muốn xảy ra
      throw new Error(`Unexpected error: ${error.message}`);
    }
  }
};

// Create a new account
export const createAccount = async (accountData) => {
  try {
    const response = await api.post("/accounts", accountData); // Gửi dữ liệu tạo tài khoản
    return response.data;
  } catch (error) {
    console.error("Error creating account:", error);
    throw error;
  }
};

// Edit an existing account
export const editAccount = async (accountId, updatedData) => {
  try {
    const response = await api.put(`/accounts/${accountId}`, updatedData); // Cập nhật tài khoản theo ID
    return response.data;
  } catch (error) {
    console.error("Error editing account:", error);
    throw error;
  }
};

// Delete an account
export const deleteAccount = async (accountId) => {
  try {
    const response = await api.delete(`/accounts/${accountId}`); // Xóa tài khoản theo ID
    return response.data;
  } catch (error) {
    console.error("Error deleting account:", error);
    throw error;
  }
};

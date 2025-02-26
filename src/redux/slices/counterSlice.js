import { createSlice } from '@reduxjs/toolkit';

// Tạo một slice để quản lý trạng thái counter
const counterSlice = createSlice({
  name: 'counter', // Tên slice
  initialState: {
    value: 0, // Trạng thái ban đầu
  },
  reducers: {
    increment: (state) => {
      state.value += 1; // Tăng giá trị
    },
    decrement: (state) => {
      state.value -= 1; // Giảm giá trị
    },
    incrementByAmount: (state, action) => {
      state.value += action.payload; // Tăng theo giá trị payload
    },
  },
});

// Export các action
export const { increment, decrement, incrementByAmount } = counterSlice.actions;

// Export reducer để sử dụng trong store
export default counterSlice.reducer;

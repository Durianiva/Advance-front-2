import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { getData, addData, editData, deleteData } from "../../services/api";
export const fetchCourses = createAsyncThunk("courses/get", getData, {
  condition: (_, { getState }) => getState().courses.status !== "loading",
});
export const addCourse = createAsyncThunk("courses/add", addData);
export const editCourse = createAsyncThunk("courses/edit", ({ id, data }) => editData(id, data));
export const deleteCourse = createAsyncThunk("courses/delete", deleteData);
const slice = createSlice({
  name: "courses", initialState: { items: [], status: "idle", error: null }, reducers: {},
  extraReducers: builder => {
    builder.addCase(fetchCourses.pending, state => { state.status = "loading"; state.error = null; })
      .addCase(fetchCourses.fulfilled, (state, action) => { state.items = action.payload; state.status = "succeeded"; })
      .addCase(fetchCourses.rejected, (state, action) => { state.status = "failed"; state.error = action.error.message; })
      .addCase(addCourse.fulfilled, (state, action) => { state.items.push(action.payload); })
      .addCase(editCourse.fulfilled, (state, action) => {
        state.items = state.items.map(row => String(row.id) === String(action.payload.id) ? action.payload : row);
      })
      .addCase(deleteCourse.fulfilled, (state, action) => {
        state.items = state.items.filter(row => String(row.id) !== String(action.payload));
      });
  },
});
export default slice.reducer;

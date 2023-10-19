import { createSlice } from "@reduxjs/toolkit";
import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { fetchBudget } from "../Budget/BudgetSlice";


export const fetchExpense = createAsyncThunk("expenses/fetchExpense", async (user, { rejectWithValue }) => {
  try {
    const response = await axios.get('http://localhost:5174/expenses', {
      params: {
        user: user,
      },
      // headers: {
      //   Authorization: `Bearer ${accessToken}`,
      // },
    });
    return response.data;
  } catch (error) {
    return rejectWithValue(error.message);
  }
});

export const addExpense = createAsyncThunk(
  "expenses/addExpense",
  async (formData,{ getState, dispatch }) => {
    const user = getState().login.user
    try {
      const response = await axios.post('http://localhost:5174/expenses', formData);
      dispatch(fetchExpense(user))
      dispatch(fetchBudget(user))
      return response.data;
    } catch (error) {
      throw error;
    }
  }
);

export const updateExpense = createAsyncThunk(
  "expenses/updateExpense",
  async (formData, { getState, dispatch }) => {
    const user = getState().login.user
    try {
      const response = await axios.patch('http://localhost:5174/expenses', formData);
      dispatch(fetchExpense(user))
      dispatch(fetchBudget(user))
      return response.data;
    } catch (error) {
      throw error;
    }
  }
);


export const fetchPieChart = createAsyncThunk("expenses/fetchPieChart", async ( user, { getState, dispatch } ) => {
  try {
    const response = await axios.get('http://localhost:5174/expenses/pie', {
      params: {
        user: user
      },
      // headers: {
      //   Authorization: `Bearer ${accessToken}`,
      // },
    })
    return response.data;
  } catch (error) {
    console.log(error)
  }
});

export const fetchLineChart = createAsyncThunk("expenses/fetchLineChart", async ( user, { getState, dispatch } ) => {
  try {
    const response = await axios.get('http://localhost:5174/expenses/line', {
      params: {
        user: user
      },
      // headers: {
      //   Authorization: `Bearer ${accessToken}`,
      // },
    })
    return response.data;
  } catch (error) {
    console.log(error)
  }
});

const initialState = {
  fetchState: "idle",
  addState: "idle",
  editState: "idle",
  tableInfo: [],
  error: '',
  categoryData: [],
  overallTotal: 0,
  expensesTotal: []
}

const expensesSlice = createSlice({
  name: 'expenses',
  initialState,
  reducers: {
    expensesGet: (state, action) => {
      state.tableInfo = action.payload
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchExpense.fulfilled, (state, action) => {
        state.fetchState = "success"
        state.tableInfo = action.payload
      })
      .addCase(fetchExpense.rejected, (state, action) => {
        console.error(action.error.message);
      })
      .addCase(fetchExpense.pending, (state,action) => {
        state.fetchState = "loading"
      })
      .addCase(addExpense.fulfilled, (state, action) => {
        state.addState = "success"
      })
      .addCase(addExpense.pending, (state, action) => {
        state.addState = "loading"
      })
      .addCase(addExpense.rejected, (state, action) => {
        state.addState = "rejected"
      })
      .addCase(updateExpense.fulfilled, (state, action) => {
        state.editState = "success"
      })
      .addCase(updateExpense.pending, (state, action) => {
        state.editState = "loading"
      })
      .addCase(updateExpense.rejected, (state, action) => {
        state.editState = "rejected"
      })
      .addCase(fetchPieChart.fulfilled, (state, action) => {
        state.categoryData = action.payload.categoryData
        state.overallTotal = action.payload.overallTotal
      })
      .addCase(fetchLineChart.fulfilled, (state, action) => {
        state.expensesTotal = action.payload
      })
  },
})


export const { expensesGet } = expensesSlice.actions;
export default expensesSlice.reducer;
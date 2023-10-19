import { createSlice } from "@reduxjs/toolkit";
import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";


export const fetchBudget = createAsyncThunk("budget/fetchBudget", async ( user, { getState, dispatch } ) => {
  try {
    const response = await axios.get('http://localhost:5174/budget', {
      params: {
        user: user,
        month: getState().budget.currentMonth
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



export const addBudget = createAsyncThunk(
  "budget/addBudget",
  async (formData,{ getState, dispatch }) => {
    const user = getState().login.user
    try {
      const response = await axios.post('http://localhost:5174/budget', formData);
      dispatch(fetchBudget(user))
      return response.data;
    } catch (error) {
      console.log(error);
    }
  }
);

export const checkBudget = createAsyncThunk(
  "budget/checkBudget",
  async (user, { getState, dispatch }) => {
    try {
      const arr = []
      const response = await axios.get('http://localhost:5174/budget/check', {
        params: {
          user: user,
        },
        // headers: {
        //   Authorization: `Bearer ${accessToken}`,
        // },
      });
      if(response.status === 200)
      {
        response.data.forEach((budget) => {
          arr.push(budget.category)
        })
        return arr
      }
    }
    catch (error) {
      console.log(error);
    }
  }
)

const allMonths = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]
const getMonthName = () => {
  const date = new Date();
  const month = date.getMonth() + 1;
  return(allMonths[month - 1])
}



const initialState = {
  fetchState: "idle",
  addState: "idle",
  editState: "idle",
  lowBudgetCategory: [],
  notifFlag: false,
  budgetInfo: [],
  error: '',
  currentMonth: getMonthName()
}

const budgetSlice = createSlice({
  name: 'budget',
  initialState,
  reducers: {
    budgetGet: (state, action) => {
      state.budgetInfo = action.payload
    },
    notifReset: (state) => {
      state.notifFlag = false,
      state.lowBudgetCategory = []
    },
    setStateMonth: (state, action) => {
      state.currentMonth = action.payload
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchBudget.fulfilled, (state, action) => {
        state.fetchState = "success"
        state.budgetInfo = action.payload
      })
      .addCase(fetchBudget.rejected, (state, action) => {
        console.fetchState = "rejected"
      })
      .addCase(fetchBudget.pending, (state,action) => {
        state.fetchState = "loading"
      })
      .addCase(addBudget.fulfilled, (state, action) => {
        state.addState = "success"
      })
      .addCase(addBudget.pending, (state, action) => {
        state.addState = "loading"
      })
      .addCase(addBudget.rejected, (state, action) => {
        state.addState = "rejected"
      })
      .addCase(checkBudget.fulfilled, (state, action) => {
        if(Array.isArray(action.payload) && action.payload.length > 0)
        {
          state.lowBudgetCategory = action.payload
          state.notifFlag = true
        }
      })
      
  },
})


export const { budgetGet, notifReset, setStateMonth } = budgetSlice.actions;
export default budgetSlice.reducer;
import { Card, Typography } from "@material-tailwind/react"
import { useSelector } from "react-redux/es/hooks/useSelector";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { expensesGet } from "../Expenses/ExpensesSlice";
import expensesCategories from "../../backend/models/expensesCategories";
import { Spinner } from "@material-tailwind/react";

const TABLE_HEAD = ["Expense", "Category", "Date", "Description", ""];
 
 
export default function Table({ onEditClick, onDeleteClick }) {
  const tableInfo = useSelector(state => state.expenses.tableInfo)
  const loading = useSelector(state => state.expenses.fetchState)
  const dispatch = useDispatch()
  const [selectedColumns, setSelectedColumns] = useState(TABLE_HEAD);  
  const [ expensesCategory, setExpensesCategory ] = useState('')




  return (
    <div>
      {loading === "loading" ? (
        <Spinner className="animate-spin" />
      ) : (
        <Card className="max-h-80 w-full overflow-y-scroll rounded-md">
          <table className="w-full min-w-max table-auto text-left">
            <thead>
              <tr>
                {selectedColumns.map((head, index) => (
                  <th
                    key={head}
                    className="border-b border-blue-gray-100 bg-blue-gray-50 p-4"
                  >
                    <Typography
                      variant="small"
                      color="blue-gray"
                      className="font-normal leading-none opacity-70 hover:cursor-pointer"
                      onClick={() => sortByHeader(selectedColumns[index])}
                    >
                      {head}
                    </Typography>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {tableInfo.map(({ _id, amount, category, date, description }, index) => {
                const isLast = index === tableInfo.length - 1;
                const classes = isLast ? "p-4" : "p-4 border-b border-blue-gray-50";

                return (
                  <tr key={_id}>
                    <td className={classes}>
                      <Typography variant="small" color="blue-gray" className="font-normal">
                        {amount}
                      </Typography>
                    </td>
                    <td className={classes}>
                      <Typography variant="small" color="blue-gray" className="font-normal">
                        {category}
                      </Typography>
                    </td>
                    <td className={classes}>
                      <Typography variant="small" color="blue-gray" className="font-normal">
                        {date}
                      </Typography>
                    </td>
                    <td className={`${classes} break-word max-w-[10rem]`}>
                      <Typography variant="small" color="blue-gray" className="font-normal">
                        {description}
                      </Typography>
                    </td>
                    <td className={classes}>
                      <Typography variant="small" color="blue-gray" className="font-medium hover:cursor-pointer" onClick={() => onEditClick({ _id })}>
                        Edit
                      </Typography>
                    </td>
                    <td className={classes}>
                      <Typography variant="small" color="blue-gray" className="font-medium hover:cursor-pointer" onClick={() => onDeleteClick(_id)}>
                        Delete
                      </Typography>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </Card>
      )}
    </div>

  );
}



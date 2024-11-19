import React, { useState, useEffect } from "react";
import { auth, db } from "../firebase";
import {
  collection,
  addDoc,
  onSnapshot,
  updateDoc,
  deleteDoc,
  doc,
  getDoc,
} from "firebase/firestore";
import {
  Box,
  Typography,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  MenuItem,
  IconButton,

} from "@mui/material";
import LightModeIcon from "@mui/icons-material/LightMode";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import { Delete, Edit } from "@mui/icons-material";
import { PieChart } from "@mui/x-charts/PieChart";
import { ThemeProvider } from "@mui/material/styles";
import { lightTheme, darkTheme } from "../theme";
import SaveIcon from "@mui/icons-material/Save";
import EditIcon from "@mui/icons-material/Edit";
import AddIcon from '@mui/icons-material/Add';

const Dashboard = () => {
  const [expenses, setExpenses] = useState([]);
  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("");
  const [date, setDate] = useState("");
  const [comments, setComments] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [userName, setUserName] = useState("User");
  const [isEditingName, setIsEditingName] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);

  const categories = ["Food", "Travel", "Shopping", "Utilities", "Other"];

useEffect(() => {
  const fetchUserName = async () => {
    if (auth.currentUser) {
      const userInfoRef = doc(
        db,
        "users",
        auth.currentUser.uid,
        "userInfo",
        "default"
      );
      const userInfoDoc = await getDoc(userInfoRef);
      if (userInfoDoc.exists()) {
        setUserName(userInfoDoc.data().name || "User");
      }
    }
  };

  fetchUserName();

  if (auth.currentUser) {
    const userExpensesRef = collection(
      db,
      "users",
      auth.currentUser.uid,
      "expenses"
    );

    const unsubscribe = onSnapshot(userExpensesRef, (snapshot) => {
      const expenseData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      // Sort expenses by createdAt in descending order
      expenseData.sort((a, b) => new Date(b.date) - new Date(a.date));
      setExpenses(expenseData);
    });

    return () => unsubscribe();
  }
}, []);
  
  const handleAddExpense = async () => {
    if (!title || !amount || !category || !date) {
      alert("Please fill in all fields!");
      return;
    }

    const userExpensesRef = collection(
      db,
      "users",
      auth.currentUser.uid,
      "expenses"
    );

   const expenseData = {
    title,
    amount: parseFloat(amount),
    category,
    date,
    comments: comments || " ", 
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

    try {
      if (editingId) {
        const expenseDocRef = doc(
          db,
          "users",
          auth.currentUser.uid,
          "expenses",
          editingId
        );
        await updateDoc(expenseDocRef, { ...expenseData, updatedAt: new Date().toISOString() });
        setEditingId(null);
      } else {
        await addDoc(userExpensesRef, expenseData);
      }
      setTitle("");
      setAmount("");
      setCategory("");
      setDate("");
      setComments("");
    } catch (error) {
      console.error("Error adding expense: ", error.message);
      alert("Error adding expense: " + error.message);
    }
  };

  const handleEditExpense = (expense) => {
    setTitle(expense.title);
    setAmount(expense.amount);
    setCategory(expense.category);
    setDate(expense.date);
    setComments(expense.comments);
    setEditingId(expense.id);
  };

  const handleDeleteExpense = async (id) => {
    const expenseDocRef = doc(db, "users", auth.currentUser.uid, "expenses", id);
    try {
      await deleteDoc(expenseDocRef);
    } catch (error) {
      console.error("Error deleting expense: ", error.message);
      alert("Error deleting expense: " + error.message);
    }
  };

  const handleNameEdit = async () => {
    if (!userName.trim()) {
      alert("Name cannot be empty.");
      return;
    }
    const userInfoDocRef = doc(db, "users", auth.currentUser.uid, "userInfo", "default");
    try {
      await updateDoc(userInfoDocRef, { name: userName });
      setIsEditingName(false);
    } catch (error) {
      console.error("Error updating name: ", error.message);
      alert("Error updating name: " + error.message);
    }
  };

  const toggleTheme = () => setIsDarkMode(!isDarkMode);
 const getAggregatedPieChartData = () => {
  const categoryTotals = expenses.reduce((acc, expense) => {
    if (expense.category in acc) {
      acc[expense.category] += expense.amount;
    } else {
      acc[expense.category] = expense.amount;
    }
    return acc;
  }, {});


  return Object.entries(categoryTotals).map(([category, total]) => ({
    label: category,
    value: total,
  }));
};

const pieChartData = getAggregatedPieChartData();

  return (
    <ThemeProvider theme={isDarkMode ? darkTheme : lightTheme}>
      <Box
        sx={{
          minHeight: "100vh",
          bgcolor: "background.default",
          color: "text.primary",
          padding: 4,
          position: "relative",
        }}
      >
        <IconButton
          onClick={toggleTheme}
          sx={{ position: "absolute", top: 16, right: 16 }}
        >
          {isDarkMode ? <LightModeIcon /> : <DarkModeIcon />}
        </IconButton>
        <Box display="flex" justifyContent="flex-start" alignItems="center" mb={4}>
  <Box display="flex" alignItems="center" gap={1}>
    <Typography variant="h4">
      Hi, {isEditingName ? (
        <TextField
          variant="outlined"
          size="small"
          value={userName}
          onChange={(e) => setUserName(e.target.value)}
          onBlur={handleNameEdit}
        />
      ) : (
        userName
      )}
    </Typography>
    <IconButton
      onClick={() => setIsEditingName(!isEditingName)}
      color="primary"
    >
      {isEditingName ? <SaveIcon /> : <EditIcon />}
    </IconButton>
  </Box>
</Box>

        <Box my={2}>
          <Typography variant="h6">Add Expense</Typography>
          <Box display="flex" gap={2} my={2}>
            <TextField
              label="Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              fullWidth
            />
            <TextField
              label="Amount"
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              fullWidth
            />
            <TextField
              select
              label="Category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              fullWidth
            >
              {categories.map((cat) => (
                <MenuItem key={cat} value={cat}>
                  {cat}
                </MenuItem>
              ))}
            </TextField>
            <TextField
              label="Date"
              type="date"
              InputLabelProps={{ shrink: true }}
              value={date}
              onChange={(e) => setDate(e.target.value)}
              fullWidth
            />
            <TextField
  label="Comments (Optional)"
  value={comments}
  onChange={(e) => setComments(e.target.value)}
  fullWidth
/>
            <IconButton
  color="primary"
  onClick={handleAddExpense}
  sx={{ display: "flex", alignItems: "center", justifyContent: "center" }}
>
  {editingId ? <EditIcon /> : <AddIcon />} {/* Edit or Add icon depending on editing state */}
</IconButton>
          </Box>
        </Box>
<Box sx={{ display: "flex", alignItems: "stretch", justifyContent: "space-between" }}>
  {/* Table Section */}
  <Box flex={1} mr={2}>
    <Typography variant="h5" gutterBottom>
      Expenses
    </Typography>
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Title</TableCell>
            <TableCell>Amount</TableCell>
            <TableCell>Category</TableCell>
            <TableCell>Created At</TableCell>
            <TableCell>Comments</TableCell>
            <TableCell>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {expenses.map((expense) => (
            <TableRow key={expense.id}>
              <TableCell>{expense.title}</TableCell>
              <TableCell>{expense.amount}</TableCell>
              <TableCell>{expense.category}</TableCell>
              <TableCell>{expense.date}</TableCell>
              <TableCell>{expense.comments}</TableCell>
              <TableCell>
                <IconButton onClick={() => handleEditExpense(expense)}>
                  <Edit />
                </IconButton>
                <IconButton onClick={() => handleDeleteExpense(expense.id)}>
                  <Delete />
                </IconButton>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  </Box>

  {/* Black Line Separator */}
<Box
  sx={{
    borderLeft: "2px solid #ccc",
    boxShadow: "inset 4px 0px 8px rgba(0, 0, 0, 0.1)",
    height: "auto",
    mx: 4,
  }}
/>

  {/* Pie Chart Section */}
  <Box flex={1} textAlign="centre" >
    <Typography variant="h5" gutterBottom marginBottom={5}>
      Expense Breakdown
    </Typography>
    <PieChart
      series={[
        {
          data: pieChartData,
      paddingAngle:1,
      cornerRadius:3,    
      cx: 200,
      cy: 150,
        },
      ]}
      width={500}
      height={300}

      
    />
  </Box>
</Box>

      </Box>
      
    </ThemeProvider>
  );
};

export default Dashboard;

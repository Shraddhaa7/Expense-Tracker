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
  Button,
  List,
  ListItem,
  IconButton,
  Switch,
} from "@mui/material";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { Delete, Edit } from "@mui/icons-material";
import { PieChart } from "@mui/x-charts/PieChart";

const Dashboard = () => {
  const [expenses, setExpenses] = useState([]);
  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [date, setDate] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [userName, setUserName] = useState("User");
  const [isEditingName, setIsEditingName] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

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
        expenseData.sort((a, b) => new Date(b.date) - new Date(a.date));
        setExpenses(expenseData);
      });

      return () => unsubscribe();
    }
  }, []);

  const handleAddExpense = async () => {
    if (!title || !amount || !date) return alert("Please fill in all fields!");

    const userExpensesRef = collection(
      db,
      "users",
      auth.currentUser.uid,
      "expenses"
    );

    try {
      if (editingId) {
        const expenseDocRef = doc(
          db,
          "users",
          auth.currentUser.uid,
          "expenses",
          editingId
        );
        await updateDoc(expenseDocRef, { title, amount: parseFloat(amount), date });
        setEditingId(null);
      } else {
        await addDoc(userExpensesRef, { title, amount: parseFloat(amount), date });
      }
      setTitle("");
      setAmount("");
      setDate("");
    } catch (error) {
      console.error("Error adding expense: ", error.message);
      alert("Error adding expense: " + error.message);
    }
  };

  const handleEditExpense = (expense) => {
    setTitle(expense.title);
    setAmount(expense.amount);
    setDate(expense.date);
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
    if (!userName.trim()) return alert("Name cannot be empty.");
    const userInfoDocRef = doc(db, "users", auth.currentUser.uid, "userInfo", "default");
    try {
      await updateDoc(userInfoDocRef, { name: userName });
      setIsEditingName(false);
    } catch (error) {
      console.error("Error updating name: ", error.message);
      alert("Error updating name: " + error.message);
    }
  };

  const totalExpense = expenses.reduce((total, expense) => total + expense.amount, 0);

  const pieChartData = expenses.map((expense) => ({
    id: expense.id,
    label: expense.title,
    value: expense.amount,
  }));

  const theme = createTheme({
    palette: {
      mode: darkMode ? "dark" : "light",
    },
  });

  return (
    <ThemeProvider theme={theme}>
      <Box p={2}>
        <Box display="flex" justifyContent="space-between" alignItems="center">
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
          <Button onClick={() => setIsEditingName(!isEditingName)}>
            {isEditingName ? "Save" : "Edit Name"}
          </Button>
          <Switch
            checked={darkMode}
            onChange={() => setDarkMode(!darkMode)}
            color="default"
          />
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
              label="Date"
              type="date"
              InputLabelProps={{ shrink: true }}
              value={date}
              onChange={(e) => setDate(e.target.value)}
              fullWidth
            />
            <Button
              variant="contained"
              color="primary"
              onClick={handleAddExpense}
            >
              {editingId ? "Update" : "Add"}
            </Button>
          </Box>
        </Box>

        <List>
          {expenses.map((expense) => (
            <ListItem
              key={expense.id}
              secondaryAction={
                <Box>
                  <IconButton onClick={() => handleEditExpense(expense)}>
                    <Edit />
                  </IconButton>
                  <IconButton onClick={() => handleDeleteExpense(expense.id)}>
                    <Delete />
                  </IconButton>
                </Box>
              }
            >
              <Typography>
                {expense.date}: {expense.title} - ₹{expense.amount}
              </Typography>
            </ListItem>
          ))}
        </List>

        <Box mt={4}>
          <Typography variant="h6">Expense Breakdown</Typography>
          <PieChart
            series={[
              {
                data: pieChartData,
              },
            ]}
            width={600}
            height={400}
          />
        </Box>
      </Box>
    </ThemeProvider>
  );
};

export default Dashboard;
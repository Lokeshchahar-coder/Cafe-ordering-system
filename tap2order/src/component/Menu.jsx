import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Card,
  CardContent,
  CardMedia,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  Snackbar,
  TextField,
  Typography,
  MenuItem,
} from "@mui/material";
import { Alert } from "@mui/material";
import { motion } from "framer-motion";

const App = () => {
  const [foods, setFoods] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formVisible, setFormVisible] = useState(false);
  const [editingFoodId, setEditingFoodId] = useState(null);
  const [form, setForm] = useState({
    name: "",
    description: "",
    price: "",
    rating: "",
    image: "",
    category: "All",
    isBestSeller: false,
  });
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const categories = [
    "All","Veg Pizza","Non-Veg Pizza","Veg-Burger","Noodles","Mocktail","Non-veg Burger","Beverages",
    "Hot Coffee","Wrap","Sandwich","Veg Mains","Cold Coffee",
    "Non-veg Mains","Soup","Rice","Sweet"
  ];

  const fetchFoods = async () => {
    try {
      const res = await fetch(
        "https://login1-7a2e0-default-rtdb.firebaseio.com/Menu.json"
      );
      const data = await res.json();

      const formatted = data
        ? Object.entries(data).map(([id, food]) => ({
            id,
            ...food,
          }))
        : [];

      setFoods(formatted);
    } catch (err) {
      setSnackbar({
        open: true,
        message: "Failed to load data",
        severity: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFoods();
  }, []);

  const resetForm = () => {
    setForm({
      name: "",
      description: "",
      price: "",
      rating: "",
      image: "",
      category: "All",
      isBestSeller: false,
    });
    setEditingFoodId(null);
  };

  const openAddDialog = () => {
    resetForm();
    setFormVisible(true);
  };

  const openEditDialog = (food) => {
    setEditingFoodId(food.id);
    setForm({
      name: food.name || "",
      description: food.description || "",
      price: food.price ?? "",
      rating: food.rating ?? "",
      image: food.image || "",
      category: food.category || "All",
      isBestSeller: !!food.isBestSeller,
    });
    setFormVisible(true);
  };

  const closeDialog = () => {
    setFormVisible(false);
    resetForm();
  };

  const handleAddFood = async () => {
    if (!form.name || !form.price || !form.description || !form.image) {
      setSnackbar({
        open: true,
        message: "Fill all fields",
        severity: "error",
      });
      return;
    }

    const newFood = {
      ...form,
      price: parseFloat(form.price),
      isAvailable: true,
    };

    try {
      await fetch(
        "https://login1-7a2e0-default-rtdb.firebaseio.com/Menu.json",
        {
          method: "POST",
          body: JSON.stringify(newFood),
        }
      );

      setSnackbar({
        open: true,
        message: "Food Added ✅",
        severity: "success",
      });

      closeDialog();
      fetchFoods();
    } catch {
      setSnackbar({
        open: true,
        message: "Error adding food",
        severity: "error",
      });
    }
  };

  const handleEditFood = async () => {
    if (!editingFoodId) return;

    if (!form.price || !form.description || !form.image) {
      setSnackbar({
        open: true,
        message: "Price, description and image are required",
        severity: "error",
      });
      return;
    }

    const updatedFood = {
      ...form,
      price: parseFloat(form.price),
      rating: form.rating === "" ? "" : parseFloat(form.rating),
      isBestSeller: !!form.isBestSeller,
    };

    try {
      await fetch(
        `https://login1-7a2e0-default-rtdb.firebaseio.com/Menu/${editingFoodId}.json`,
        {
          method: "PATCH",
          body: JSON.stringify(updatedFood),
        }
      );

      setSnackbar({
        open: true,
        message: "Food Updated ✏️",
        severity: "success",
      });

      closeDialog();
      fetchFoods();
    } catch {
      setSnackbar({
        open: true,
        message: "Error updating food",
        severity: "error",
      });
    }
  };

  const handleToggleAvailability = async (id, status) => {
    await fetch(
      `https://login1-7a2e0-default-rtdb.firebaseio.com/Menu/${id}.json`,
      {
        method: "PATCH",
        body: JSON.stringify({ isAvailable: !status }),
      }
    );
    fetchFoods();
  };

  const handleDeleteFood = async (id) => {
    await fetch(
      `https://login1-7a2e0-default-rtdb.firebaseio.com/Menu/${id}.json`,
      { method: "DELETE" }
    );
    fetchFoods();
  };

  return (
    <Box sx={{ minHeight: "100vh", background: "#0b0b0b", p: 4 }}>
      
      {/* Heading */}
      <Typography
        variant="h3"
        align="center"
        sx={{ color: "#facc15", mb: 4, fontWeight: "bold" }}
      >
        Admin Dashboard
      </Typography>

      {/* Add Button */}
      <Box textAlign="center" mb={4}>
        <Button
          variant="contained"
          onClick={openAddDialog}
          sx={{
            background: "#facc15",
            color: "#000",
            "&:hover": { background: "#eab308" },
          }}
        >
          Add Food
        </Button>
      </Box>

      {/* Dialog */}
      <Dialog open={formVisible} onClose={closeDialog}>
        <DialogTitle>{editingFoodId ? "Edit Item" : "Add New Item"}</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} mt={1}>
            {["name","price","rating","description","image"].map((field, i) => (
              <Grid item xs={12} key={i}>
                <TextField
                  label={field}
                  fullWidth
                  value={form[field]}
                  onChange={(e) =>
                    setForm({ ...form, [field]: e.target.value })
                  }
                />
              </Grid>
            ))}

            <Grid item xs={12}>
              <TextField
                select
                fullWidth
                label="Category"
                value={form.category}
                onChange={(e) =>
                  setForm({ ...form, category: e.target.value })
                }
              >
                {categories.map((c) => (
                  <MenuItem key={c} value={c}>{c}</MenuItem>
                ))}
              </TextField>
            </Grid>

            <Grid item xs={12}>
              <Button
                fullWidth
                variant="contained"
                color={form.isBestSeller ? "success" : "inherit"}
                onClick={() =>
                  setForm({ ...form, isBestSeller: !form.isBestSeller })
                }
              >
                {form.isBestSeller ? "Best Seller ✓" : "Mark Best Seller"}
              </Button>
            </Grid>
          </Grid>
        </DialogContent>

        <DialogActions>
          <Button
            onClick={editingFoodId ? handleEditFood : handleAddFood}
            color="success"
          >
            {editingFoodId ? "Update" : "Add"}
          </Button>
          <Button onClick={closeDialog} color="error">
            Cancel
          </Button>
        </DialogActions>
      </Dialog>

      {/* Cards */}
      {loading ? (
        <Typography align="center" color="#fff" sx={{ width: "100%" }}>
          Loading menu...
        </Typography>
      ) : (
      <Grid container spacing={3}>
        {foods.map((food, index) => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={food.id}>
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <Card
                sx={{
                  background: "rgba(255,255,255,0.05)",
                  backdropFilter: "blur(10px)",
                  border: "1px solid rgba(255,255,255,0.1)",
                  borderRadius: "16px",
                  color: "#fff",
                }}
              >
                <CardMedia
                  component="img"
                  height="150"
                  image={food.image}
                />

                <CardContent>
                  <Typography fontWeight="bold">
                    {food.name}
                  </Typography>

                  <Typography variant="body2" color="gray">
                    {food.description}
                  </Typography>

                  <Typography color="#facc15">
                    ₹{food.price}
                  </Typography>

                  <Typography color={food.isBestSeller ? "#facc15" : "#9ca3af"}>
                    {food.isBestSeller ? "Best Seller ⭐" : "Regular Item"}
                  </Typography>

                  <Typography
                    color={food.isAvailable ? "lightgreen" : "red"}
                  >
                    {food.isAvailable ? "Available" : "Unavailable"}
                  </Typography>
                </CardContent>

                <Box display="flex" justifyContent="space-between" p={2} gap={1}>
                  <Button
                    size="small"
                    variant="contained"
                    color="info"
                    onClick={() => openEditDialog(food)}
                  >
                    Edit
                  </Button>

                  <Button
                    size="small"
                    variant="contained"
                    color="warning"
                    onClick={() =>
                      handleToggleAvailability(food.id, food.isAvailable)
                    }
                  >
                    Toggle
                  </Button>

                  <Button
                    size="small"
                    variant="contained"
                    color="error"
                    onClick={() => handleDeleteFood(food.id)}
                  >
                    Delete
                  </Button>
                </Box>
              </Card>
            </motion.div>
          </Grid>
        ))}
      </Grid>
      )}

      {/* Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert severity={snackbar.severity}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default App;
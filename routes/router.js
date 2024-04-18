const router = require("express").Router();
const dbModel = require("../databaseAccessLayer");


function calculateTotal(items) {
  let total = 0;
  items.forEach(item => {
    const cost = parseFloat(item.cost);
    const quantity = parseInt(item.quantity, 10);
    if (!isNaN(cost) && !isNaN(quantity)) {
      total += cost * quantity;
    }
  });
  return total;
}

router.get("/", async (req, res) => {
  try {
    const items = await dbModel.getPurchaseItems();
    const totalCost = calculateTotal(items); 
    console.log("Total Cost: ", totalCost);
    res.render("index", { items, calculateTotal: calculateTotal }); 
  } catch (err) {
    console.error("Error retrieving purchase items:", err);
    res.status(500).render("error", { message: "Error retrieving data from the database." });
  }
});

router.post("/addItem", async (req, res) => {
  try {
    const postData = {
      name: req.body.itemName,
      description: req.body.itemDescription,
      cost: req.body.cost,
      quantity: req.body.quantity
    };
    console.log("Received post data:", postData);
    const success = await dbModel.addPurchaseItem(postData);
    if (success) {
      res.redirect("/");
    } else {
      res.status(500).render("error", { message: "Failed to add item to the database." });
    }
  } catch (err) {
    console.error("Error adding purchase item:", err);
    res.status(500).render("error", { message: "Error processing your request." });
  }
});

router.get("/deleteItem", async (req, res) => {
  const itemId = req.query.itemId;
  if (!itemId) {
    return res.status(400).send("Item ID is required for deletion.");
  }

  try {
    const success = await dbModel.deletePurchaseItem(itemId);
    if (success) {
      res.redirect("/");
    } else {
      res.status(500).render("error", { message: "Failed to delete item from the database." });
    }
  } catch (err) {
    console.error("Error deleting purchase item:", err);
    res.status(500).render("error", { message: "Error processing your request." });
  }
});

router.get("/updateQuantity", async (req, res) => {
  const itemId = req.query.itemId;
  const change = req.query.change;
  console.log("Received GET data:", itemId, change);

  if (!itemId || change === undefined) {
    return res.status(400).send("Item ID and change in quantity are required.");
  }

  try {
    const success = await dbModel.updateItemQuantity(itemId, parseInt(change, 10));
    if (success) {
      res.redirect("/");
    } else {
      res.status(500).render("error", { message: "Failed to update item quantity in the database." });
    }
  } catch (err) {
    console.error("Error updating item quantity:", err);
    res.status(500).render("error", { message: "Error processing your request." });
  }
});


module.exports = router;

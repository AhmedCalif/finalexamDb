const database = require("./databaseConnection");

async function getPurchaseItems() {
  let sqlQuery = `
        SELECT purchase_item_id, item_name, item_description, cost, quantity
        FROM purchase_item;
    `;
  try {
    const results = await database.query(sqlQuery);
    return results[0];
  } catch (err) {
    console.log("Cannot select purchase_item table", err);
    throw err;
  }
}

async function addPurchaseItem(postData) {
  let sqlInsert = `
        INSERT INTO purchase_item (item_name, item_description, cost, quantity)
        VALUES (:name, :description, :cost, :quantity);
    `;

  let params = {
    name: postData.name,
    description: postData.description,
    cost: postData.cost,
    quantity: postData.quantity
  };

  try {
    const results = await database.query(sqlInsert, params);
    console.log("Item added successfully. Insert ID:", results.insertId);
    return true;
  } catch (err) {
    console.log("Error adding purchase item:", err);
    return false;
  }
}

async function deletePurchaseItem(itemId) {
  let sqlDelete = `
        DELETE FROM purchase_item
        WHERE purchase_item_id = :itemId;
    `;
  let params = {
    itemId: itemId
  };

  try {
    await database.query(sqlDelete, params);
    return true;
  } catch (err) {
    console.log("Error deleting purchase item:", err);
    return false;
  }
}

async function updateItemQuantity(itemId, change) {
  let sqlUpdate = `
        UPDATE purchase_item
        SET quantity = quantity + (:change)
        WHERE purchase_item_id = :itemId;
    `;
  let params = {
    itemId: itemId,
    change: change
  };

  try {
    await database.query(sqlUpdate, params);
    return true;
  } catch (err) {
    console.log("Error updating item quantity:", err);
    return false;
  }
}



module.exports = {
  getPurchaseItems,
  addPurchaseItem,
  deletePurchaseItem,
  updateItemQuantity 
};

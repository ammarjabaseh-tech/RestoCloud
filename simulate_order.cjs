async function run() {
  const tenantId = "tenant-1783520026240";
  try {
    const res = await fetch(`http://localhost:3000/api/tenants/${tenantId}/orders`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        orderType: "dine_in",
        tableNumber: 3,
        customerName: "Simulated Test Order",
        customerPhone: "0555555555",
        items: [
          { itemId: "item-123", nameAr: "وجبة تجريبية", price: 15, quantity: 1 }
        ],
        subtotal: 15,
        taxAmount: 2.25,
        discountAmount: 0,
        total: 17.25,
        paymentMethod: "pending",
        paymentStatus: "pending",
        cashierName: "طلب ذاتي (QR Menu)"
      })
    });

    const data = await res.json();
    console.log("Response from server:", data);
  } catch (e) {
    console.error("Error during simulated order POST:", e);
  }
}
run();

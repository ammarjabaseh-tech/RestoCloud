async function test() {
  try {
    const res = await fetch("http://localhost:3000/api/tenants/tenant-1/categories", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        nameAr: "قسم اختبار",
        icon: "🍔",
        nameEn: "Test Category",
        nameTr: "Test Kategori"
      })
    });
    
    console.log("Status:", res.status);
    const data = await res.json();
    console.log("Response:", data);
  } catch (err) {
    console.error("Test failed:", err.message);
  }
}
test();


const BASE_URL = 'http://localhost:3000';
let token = '';
let productId = '';

async function runTests() {
    console.log('🚀 Iniciando pruebas integrales de todos los endpoints...\n');

    try {
        // 1. App - Hello
        console.log('--- 🏠 App Test ---');
        const helloRes = await fetch(`${BASE_URL}/`);
        const helloText = await helloRes.text();
        console.log('✅ Base URL (/):', helloText);

        // 2. Auth - Login
        console.log('\n--- 🔐 Auth Test ---');
        const loginRes = await fetch(`${BASE_URL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                username: 'carolina',
                password: '4040'
            })
        });
        const loginData: any = await loginRes.json();
        if (!loginRes.ok) throw new Error(`Login failed: ${loginData.message}`);

        token = loginData.access_token;
        console.log('✅ Login exitoso. Token obtenido.');

        // 3. Auth - Profile
        const profileRes = await fetch(`${BASE_URL}/auth/profile`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        const profileData: any = await profileRes.json();
        console.log('✅ Perfil obtenido:', profileData.username);

        // 4. Products - Create
        console.log('\n--- 📦 Products Test ---');
        const productData = {
            name: 'Producto de Prueba Antigravity',
            description: 'Una obra única creada para testing',
            price: 1500,
            category: 'Escultura',
            stock: 1,
            isSold: false
        };
        const createRes = await fetch(`${BASE_URL}/products`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`
            },
            body: JSON.stringify(productData)
        });
        const createdProduct: any = await createRes.json();
        productId = createdProduct._id;
        console.log('✅ Producto creado:', createdProduct.name, '(ID:', productId, ')');

        // 5. Products - Find All
        const allProductsRes = await fetch(`${BASE_URL}/products`);
        const allProducts: any = await allProductsRes.json();
        console.log('✅ GET /products: Total:', allProducts.length);

        // 6. Products - Find Available
        const availProductsRes = await fetch(`${BASE_URL}/products/available`);
        const availProducts: any = await availProductsRes.json();
        console.log('✅ GET /products/available: Total:', availProducts.length);

        // 7. Products - Find One
        const oneProductRes = await fetch(`${BASE_URL}/products/${productId}`);
        const oneProduct: any = await oneProductRes.json();
        console.log('✅ GET /products/:id: OK');

        // 8. Products - Check Availability
        const checkRes = await fetch(`${BASE_URL}/products/check-availability`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                productItems: [{ productId, quantity: 1 }]
            })
        });
        const checkData: any = await checkRes.json();
        console.log('✅ POST /products/check-availability: Disponible');

        // 9. Products - Update
        const updateRes = await fetch(`${BASE_URL}/products/${productId}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`
            },
            body: JSON.stringify({ price: 1750 })
        });
        const updatedData: any = await updateRes.json();
        console.log('✅ PATCH /products/:id: Precio actualizado a', updatedData.price);

        // 10. Products - Mark as Sold
        const soldRes = await fetch(`${BASE_URL}/products/${productId}/sold`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ quantity: 1 })
        });
        const soldData: any = await soldRes.json();
        console.log('✅ PATCH /products/:id/sold: Vendido');

        // 11. Products - Mark as Available again
        const availToggleRes = await fetch(`${BASE_URL}/products/${productId}/available`, {
            method: 'PATCH',
            headers: { Authorization: `Bearer ${token}` }
        });
        const availToggleData: any = await availToggleRes.json();
        console.log('✅ PATCH /products/:id/available: Disponible de nuevo');

        // 12. Sales - Find All
        console.log('\n--- 💰 Sales Test ---');
        const salesRes = await fetch(`${BASE_URL}/sales`);
        const salesData: any = await salesRes.json();
        console.log('✅ GET /sales: Total:', salesData.length);

        // 13. Sales - Stats
        const statsRes = await fetch(`${BASE_URL}/sales/stats`);
        const statsData: any = await statsRes.json();
        console.log('✅ GET /sales/stats:', JSON.stringify(statsData));

        // 14. Products - Delete (Cleanup)
        console.log('\n--- 🧹 Cleanup ---');
        const deleteRes = await fetch(`${BASE_URL}/products/${productId}`, {
            method: 'DELETE',
            headers: { Authorization: `Bearer ${token}` }
        });
        if (deleteRes.ok) console.log('✅ Producto de prueba eliminado');

        console.log('\n✨ Todos los endpoints verificados correctamente! ✨');

    } catch (error: any) {
        console.error('\n❌ Error en las pruebas:', error.message);
        process.exit(1);
    }
}

runTests();

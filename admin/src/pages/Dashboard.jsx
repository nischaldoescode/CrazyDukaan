import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, 
  ResponsiveContainer, LabelList, PieChart, Pie, Cell 
} from 'recharts';
import { backendUrl, currency } from '../App';
import './Dashboard.css';

const monthNames = ['All Time', 'January', 'February', 'March', 'April', 'May', 'June', 
  'July', 'August', 'September', 'October', 'November', 'December'];

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];

const Dashboard = ({ token }) => {
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedMonth, setSelectedMonth] = useState(0);
  const [paidRevenue, setPaidRevenue] = useState(0);
  const [categoryStats, setCategoryStats] = useState([]);
  const [topProducts, setTopProducts] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      if (!token) return;

      try {
        const [orderRes, productRes] = await Promise.all([
          axios.post(`${backendUrl}/api/order/list`, {}, { headers: { token } }),
          axios.get(`${backendUrl}/api/product/list`),
        ]);

        setOrders(orderRes.data.orders || []);
        setProducts(productRes.data.products || []);
      } catch (err) {
        console.error('Dashboard Error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [token]);

  useEffect(() => {
    if (orders.length && products.length) {
      const paidOrders = orders.filter(order => order.payment);
      const paid = paidOrders.reduce((acc, order) => acc + order.amount, 0);
      setPaidRevenue(paid);

      const categoryMap = {};
      const productSales = {};
      
      orders.forEach(order => {
        order.items.forEach(item => {
          // Category stats
          if (item.category) {
            categoryMap[item.category] = (categoryMap[item.category] || 0) + 1;
          }
          
          // Product sales count
          if (item._id) {
            productSales[item._id] = (productSales[item._id] || 0) + item.quantity;
          }
        });
      });

      setCategoryStats(
        Object.entries(categoryMap).map(([name, value]) => ({
          name,
          value
        }))
      );
      

      // Get top selling products
      const productSalesArray = Object.entries(productSales)
        .map(([productId, sales]) => {
          const product = products.find(p => p._id === productId);
          return product ? { ...product, sales } : null;
        })
        .filter(Boolean)
        .sort((a, b) => b.sales - a.sales)
        .slice(0, 5);

      setTopProducts(productSalesArray);
    }
  }, [orders, products]);

  const filterOrdersByMonth = () => {
    if (selectedMonth === 0) return orders;
    return orders.filter(order => {
      const orderDate = new Date(Number(order.date));
      return orderDate.getMonth() + 1 === selectedMonth;
    });
  };

  const filteredOrders = filterOrdersByMonth();
  const paidOrdersCount = orders.filter(order => order.paymentMethod === 'Razorpay').length;

  const chartData = [
    { name: 'Total Orders', count: filteredOrders.length },
    { name: 'Paid Orders', count: paidOrdersCount },
    { name: 'Products', count: products.length }
  ];

  const revenueData = [
    { name: 'Paid Revenue', amount: paidRevenue }
  ];

  return (
    <div className="dashboard">
      {loading ? (
        <div className="loading">Loading Dashboard Data...</div>
      ) : (
        <>
          <header className="dashboard-header">
            <h1>Admin Dashboard</h1>
            <div className="month-selector">
              <select 
                onChange={(e) => setSelectedMonth(Number(e.target.value))} 
                value={selectedMonth}
                className="month-dropdown"
              >
                {monthNames.map((month, index) => (
                  <option key={index} value={index}>{month}</option>
                ))}
              </select>
            </div>
          </header>

          <div className="metrics-grid">
            <div className="metric-card">
              <div className="metric-content">
                <h3>Total Orders</h3>
                <p className="metric-value">{filteredOrders.length}</p>
              </div>
              <div className="metric-icon">
                <i className="fas fa-shopping-cart"></i>
              </div>
            </div>
            
            <div className="metric-card">
              <div className="metric-content">
                <h3>Total Products</h3>
                <p className="metric-value">{products.length}</p>
              </div>
              <div className="metric-icon">
                <i className="fas fa-box-open"></i>
              </div>
            </div>
            
            <div className="metric-card">
              <div className="metric-content">
                <h3>Paid Revenue</h3>
                <p className="metric-value">{currency}{paidRevenue.toLocaleString()}</p>
              </div>
              <div className="metric-icon">
                <i className="fas fa-money-bill-wave"></i>
              </div>
            </div>
          </div>

          <div className="charts-container">
            <div className="chart-card">
              <div className="chart-header">
                <h3>Orders & Products Overview</h3>
              </div>
              <div className="chart-body">
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="count" fill="#8884d8" radius={[4, 4, 0, 0]}>
                      <LabelList dataKey="count" position="top" />
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="chart-card">
              <div className="chart-header">
                <h3>Revenue Breakdown</h3>
              </div>
              <div className="chart-body">
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={revenueData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip formatter={(value) => [`${currency}${value}`, 'Amount']} />
                    <Bar dataKey="amount" fill="#82ca9d" radius={[4, 4, 0, 0]}>
                      <LabelList dataKey="amount" position="top" formatter={(value) => `${currency}${value}`} />
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {categoryStats.length > 0 && (
              <div className="chart-card">
                <div className="chart-header">
                  <h3>Category Distribution</h3>
                </div>
                <div className="chart-body">
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={categoryStats}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                        nameKey="name"
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      >
                        {categoryStats.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value, name) => [value, name]} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>
            )}
          </div>

          <div className="data-tables">
            <div className="table-card">
              <div className="table-header">
                <h3>Recent Orders ({filteredOrders.length})</h3>
              </div>
              <div className="table-responsive">
                <table>
                  <thead>
                    <tr>
                      <th>Order ID</th>
                      <th>Amount</th>
                      <th>Status</th>
                      <th>Payment</th>
                      <th>Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredOrders.slice(0, 5).map(order => (
                      <tr key={order._id}>
                        <td data-label="Order ID">{order._id.substring(0, 8)}...</td>
                        <td data-label="Amount">{currency}{order.amount}</td>
                        <td data-label="Status" className={`status-${order.status.toLowerCase().replace(' ', '-')}`}>
                          {order.status}
                        </td>
                        <td data-label="Payment" className={order.payment ? 'paid' : 'unpaid'}>
                          {order.paymentMethod} ({order.payment ? 'Paid' : 'Unpaid'})
                        </td>
                        <td data-label="Date">{new Date(Number(order.date)).toLocaleDateString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="table-card">
              <div className="table-header">
                <h3>Top Selling Products ({topProducts.length})</h3>
              </div>
              <div className="table-responsive">
                <table>
                  <thead>
                    <tr>
                      <th>Product</th>
                      <th>Image</th>
                      <th>Category</th>
                      <th>Price</th>
                      <th>Sales</th>
                    </tr>
                  </thead>
                  <tbody>
                    {topProducts.length > 0 ? (
                      topProducts.map(product => (
                        <tr key={product._id}>
                          <td data-label="Product">{product.name}</td>
                          <td data-label="Image">
                            {product.image?.url ? (
                              <img 
                                src={product.image.url} 
                                alt={product.name} 
                                className="product-thumbnail"
                              />
                            ) : (
                              <span className="no-image">No Image</span>
                            )}
                          </td>
                          <td data-label="Category">{product.category}/{product.subCategory}</td>
                          <td data-label="Price">{currency}{product.price}</td>
                          <td data-label="Sales">{product.sales}</td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="5" className="text-center">No sales data available</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Dashboard;
            {/* <div className="metric-card total-revenue">
              <h3>Total Revenue</h3>
              <p>{currency}{totalRevenue}</p>
            </div> */}
                // { name: 'COD Revenue', amount: codRevenue }
                    // { name: 'Total Revenue', amount: totalRevenue },
                    // const codOrdersCount = orders.filter(order => order.paymentMethod === 'COD').length;
                    // const cod = codOrders.reduce((acc, order) => acc + order.amount, 0);
                    // { name: 'COD Orders', count: codOrdersCount },
                    // const [totalRevenue, setTotalRevenue] = useState(0);
                          // setCodRevenue(cod);
                          
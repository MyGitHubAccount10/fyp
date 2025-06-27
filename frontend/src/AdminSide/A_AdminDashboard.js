// This js file is made by ai. But is heavily edited in accordance to fair use.
// It is also heavilly tested to work as intended by me
// Prompts includes: why does these not work, how to make this work, submitting error messages, how does these lines of codes work. Where can i find these part of the code. How to fix it. Make these Page look like the image provided.(did like 7 tries before, before it finally worked, and then started coding. I did took note of the css because each file has its own css and it was too long, so i chose the pages between the products, orders and customers with the best css, and reused it for all 3 pages, deleted the ones that are no longer used, and create divs to accomodate the new ones. I did also a lot some of my own css, and edited some that was not looking/working as intended. Magority of it was overflowing text. Which apparently the ai is really bad at fixing)
// Output such as giving me codes(which still fails majority of the time) and giving me suggestions on how to fix it. And also gives ingenius improvement tht i did not thought of.


import React, { useState, useEffect } from 'react';
import AdminHeader from '../AdminHeader';
import { useNavigate } from 'react-router-dom';


import { FaDollarSign } from "react-icons/fa6";
import { GoPackage } from "react-icons/go";
import { FaRegClock } from "react-icons/fa";
import { CgDanger } from "react-icons/cg";
import { PiSealWarning } from "react-icons/pi";
import { IoIosAddCircle } from "react-icons/io";
import { MdEdit } from "react-icons/md";




// Default sales data structure
const initialSalesData = {
    totalMonthlySales: 0,
    newOrdersToday: 0,
    pendingFulfillment: 0,
    lowStockItems: 0,
    outOfStockItems: 0,
    dailySales: [],
};

const initialRecentOrders = [];

function AdminDashboard() {
    const navigate = useNavigate();
    const [salesData, setSalesData] = useState(initialSalesData);
    const [recentOrders, setRecentOrders] = useState(initialRecentOrders);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    // Fetch data once per reload
    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            setLoading(true);
            
            // Check if admin has logged in
            const checkAdmin = JSON.parse(localStorage.getItem('admin_user'));
            if (!checkAdmin || !checkAdmin.token) {
                setError('This admin has not logged in yet.');
            }

            // Fetch orders data
            const ordersRes = await fetch('/api/orders/admin/all', {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${checkAdmin.token}`,
                    'Content-Type': 'application/json'
                }
            });

            if (!ordersRes.ok) {
                setError('Load Order Failded. Please try again later.');
            }

            const orders = await ordersRes.json();

            // Fetch product datas
            let deezProducts = [];
            try {
                const productsRes = await fetch('/api/product', {
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });

                deezProducts = await productsRes.json();

            } catch (err) {
                console.warn('Failed to fetch products data:', err);
            }

            // IMPORTANT! Uses the fetched data
            clacOrders(orders);
            processProducts(deezProducts);
            setError('');
        } catch (err) {
            console.error('Error fetching dashboard data:', err);
            setError('Failed to load dashboard data');
        } finally {
            setLoading(false);
        }
    };

    const clacOrders = (orders) => {
        const now = new Date();
        const today = new Date(now.getFullYear(), now.getMonth(), now.getDate(), now.getHours(), now.getMinutes(), now.getSeconds());
        const month = new Date(now.getFullYear(), now.getMonth(), 1);
        let totalMonthlySales = 0;
        let newOrdersToday = 0;
        console.log('today:', today);

        orders.forEach(order => {
        const orderDate = new Date(order.createdAt);

        // Count toward this month's sales
        if (orderDate >= month && order.total_amount) {
            totalMonthlySales += order.total_amount;
        }

        // Count orders for today
        if (orderDate >= today) {
            // This helps to ensure that the order is counted only if it was created today
            // and the reason it is comparing if the orderDate is greater than or equal to today
            newOrdersToday++;
        }
        });

        // Calculate pending fulfillment
        const pendingOrders = orders.filter(order => 
            order.status_id?.status_name === 'Order Placed' ||
            order.status_id?.status_name === 'Processing' ||
            order.status_id?.status_name === 'Confirmed'
        );
        const pendingFulfillment = pendingOrders.length;

        setSalesData({
            totalMonthlySales: Math.round(totalMonthlySales), 
            newOrdersToday,
            pendingFulfillment
        });

        // Fetch recent orders (up to 5)
        const fiveRecentOrdersUWU = orders
        // Sort by newest to oldest
            .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
            // Map 5 orders
            .slice(0, 5)
            .map(order => {
                const id = order._id || 'Nyaa fu~';
                // Shorten the order ID to better fit in the table
                const shortId = order._id?.slice(-8) || 'Nyaa~';
                // Use full_name or username, or fallback to 'N/A'
                const customer = order.user_id?.full_name || order.user_id?.username || 'N/Mystewy';
                // Rewrite to js format
                const date= new Date(order.createdAt).toLocaleDateString();
                const total= order.total_amount || 0;
                const status= order.status_id?.status_name || 'Unknyown';

                return { id, shortId, customer, date, total, status };
            });

        setRecentOrders(fiveRecentOrdersUWU);

        // Generate daily sales data for chart
        generateSalesChartForAWeek(orders);
    };

    const generateSalesChartForAWeek = (ordersData) => {
        const dailyData = {};
        const sevenDays = [];
        
        // Create array of last 7 days
        for (let i = 6; i >= 0; i--) {
            const date = new Date();
            date.setDate(date.getDate() - i);
            const dateStr = date.toLocaleDateString();
            sevenDays.push({
                fullDate: dateStr,
                month: date.toLocaleDateString('en-SG', {  month: 'short', day: 'numeric', }),
                week: date.toLocaleDateString('en-SG', { weekday: 'short' })
            });
            dailyData[dateStr] = 0;
        }
        
        ordersData.forEach(order => {
            const orderDate = new Date(order.createdAt).toLocaleDateString();
            if (dailyData.hasOwnProperty(orderDate)) {
                dailyData[orderDate] += order.total_amount || 0;
            }
        });

        const chartData = sevenDays.map(dateObj => ({
            month: dateObj.month, 
            week: dateObj.week,
            date: dateObj.month + ', ' + dateObj.week,
            fullDate: dateObj.fullDate, // Keep full date for data lookup
            amount: dailyData[dateObj.fullDate]
        }));
        
        setSalesData(prev => ({ ...prev, dailySales: chartData }));
    };

    const processProducts = (iCanCallThisAnythingIWant) => {
        
        // Getting product status
        const getProductStatus = (thiszItem) => {
            if (thiszItem.warehouse_quantity === 0) return 'Out of Stock';
            if (thiszItem.warehouse_quantity <= (thiszItem.threshold || 10)) return 'Limited Stock';
            return 'In Stock';
        };
        
        // Calculate low stock and out of stock items using the same logic as AllProductsPage
        const outOfStockItems = iCanCallThisAnythingIWant.filter(product => 
            getProductStatus(product) === 'Out of Stock'
        ).length;
        
        const lowStockItems = iCanCallThisAnythingIWant.filter(product => 
            getProductStatus(product) === 'Limited Stock'
        ).length;

        // Console output to check if its right
        console.log('Products data:', iCanCallThisAnythingIWant.length);
        console.log('Out of stock items:', outOfStockItems);
        console.log('Low stock items:', lowStockItems);

        setSalesData(prev => ({
            ...prev,
            lowStockItems,
            outOfStockItems
        }));
    };

    // Set currency to Singapore Dollar (Could be changed to US dollar) 
    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-SG', {
            style: 'currency',
            currency: 'SGD'
        }).format(amount || 0);
    };

    // Function to get status class (reusing or similar to ManageProductsPage)
    // Basically Clouring the Satus column
    const getStatusClass = (status) => {
        switch (status) {
            case 'Order Placed':
            case 'Delivered':
            case 'Completed': return 'status-shipped';
            case 'Processing':
            case 'Confirmed': return 'status-processing';
            case 'Pending': return 'status-complete';
            default: return '';
        }
    };

     // Reusable navigation functions
     const navigatetoAddP = () => { navigate('/add-product'); };
     const navigatetoAllO = () => { navigate('/all-orders'); };
     const navigatetoAllP = () => { navigate('/all-products'); };
     const navigatetoSales = () => { navigate('/sales-report'); };
     const navigatetoAllC = () => { navigate('/all-customers'); };
     const navigatetoAddAdmin = () => { navigate('/add-admin'); };
     const navigatetoIndividualOrder = (orderId) => { navigate(`/order-details/${orderId}`); };


     // This shows when you reload the page, but it have not yet fetched the datas
    if (loading) {
        return (
            <div className="admin-dashboard-page">
                <AdminHeader />
                <div>
                    <div style={{ textAlign: 'center', paddingTop: '50px', flex: 1 }}>
                        Loading dashboard...
                    </div>
                </div>
            </div>
        );
    }

// ------------------------RETURN ---------------------------------------
// ------------------------RETURN ---------------------------------------
// ------------------------RETURN ---------------------------------------
// ------------------------RETURN ---------------------------------------
// ------------------------RETURN ---------------------------------------
// ------------------------RETURN ---------------------------------------
// ------------------------RETURN ---------------------------------------
// ------------------------RETURN ---------------------------------------
// ------------------------RETURN ---------------------------------------
// ------------------------RETURN ---------------------------------------
// ------------------------RETURN ---------------------------------------
// ------------------------RETURN ---------------------------------------

    return (
        <div> 
        <AdminHeader />
            <div className="manage-products-page"> 
                <h2 className="page-title">Admin Dashboard</h2> 

                <div className="dashboard-stats">

                    <div className="stat-card" onClick={navigatetoSales}>
                        <div className="stat-icon icon-sales"><FaDollarSign color="white" size={30} /></div>
                        <div className="stat-info">
                            <div className="stat-label">Total Sales (Month)</div>
                            <div className="stat-value">{formatCurrency(salesData.totalMonthlySales)}</div>
                        </div>
                    </div>
                    <div className="stat-card" onClick={navigatetoAllO}>
                        <div className="stat-icon icon-new-orders"><GoPackage color="white" size={30} /></div>
                        <div className="stat-info">
                            <div className="stat-label">New Orders (Today)</div>
                            <div className="stat-value">{salesData.newOrdersToday}</div>
                        </div>
                    </div>
                    <div className="stat-card"  onClick={navigatetoAllO}>
                        <div className="stat-icon icon-fulfillment"><FaRegClock color="white" size={30} /></div>
                        <div className="stat-info">
                            <div className="stat-label">Pending Fulfillment</div>
                            <div className="stat-value">{salesData.pendingFulfillment}</div>
                        </div>
                    </div>
                    <div className="stat-card stat-warning" onClick={navigatetoAllP}>
                        <div className="stat-icon icon-low-stock"><PiSealWarning color="white" size={30} /></div>
                        <div className="stat-info">
                            <div className="stat-label">Low Stock Items</div>
                            <div className="stat-value">{salesData.lowStockItems}</div>
                        </div>
                    </div>
                    <div className="stat-card stat-danger" onClick={navigatetoAllP}>
                        <div className="stat-icon icon-out-stock"><CgDanger color="white" size={30} /></div>
                        <div className="stat-info">
                            <div className="stat-label">Out of Stock Items</div>
                            <div className="stat-value">{salesData.outOfStockItems}</div>
                        </div>
                    </div>
                    {/* End of stat cards */}
                </div>
                {/* ---------------------------------------------------------------------- */}

                <div className="card">
                    <h3 className="section-title">Quick Actions</h3>
                    <div className="quick-action-buttons">
                        <button className="btn-quick-action" onClick={navigatetoAddP}>
                            <IoIosAddCircle color="#FA704C" /> Add New Product
                        </button>
                        <button className="btn-quick-action" onClick={navigatetoAllP}>
                            <MdEdit color="#FA704C" /> Manage Inventory
                        </button>
                        <button className="btn-quick-action" onClick={navigatetoAllO}>
                            <FaRegClock color="#FA704C" /> View All Orders
                        </button>
                        <button className="btn-quick-action" onClick={navigatetoAllC}>
                            <MdEdit color="#FA704C" /> View All Customers
                        </button>
                        <button className="btn-quick-action" onClick={navigatetoAddAdmin}>
                            <IoIosAddCircle color="#FA704C" /> Add an Admin/User
                        </button>
                    </div>
                </div>

                <div className="card">
                    <h3 className="section-title">Recent Orders</h3>
                    <div>
                        <table className="recent-orders-table">
                            <thead>
                                <tr>
                                    <th>Order ID</th>
                                    <th>Customer</th>
                                    <th>Date</th>
                                    <th>Total</th>
                                    <th>Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {recentOrders.length > 0 ? (
                                    recentOrders.map(order => (
                                        <tr key={order.id}>
                                            <td><div className="coloured-link" onClick={() => navigatetoIndividualOrder(order.id)}>{order.shortId}</div></td>
                                            <td>{order.customer}</td>
                                            <td>{order.date}</td>
                                            <td>{formatCurrency(order.total)}</td>
                                            <td className={getStatusClass(order.status)}>{order.status}</td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="5" style={{ textAlign: 'center', padding: '20px', color: 'grey' }}>
                                            No recent orders found
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                    <div>
                        <div className='coloured-link' onClick={navigatetoAllO}>
                            View All Orders {"->"}
                        </div>
                    </div>
                </div>

                {/* Sales Snapshot */}
                <div className="card">
                    <h3 className="section-title">Sales Snapshot (Last 7 Days)</h3>
                    <div style={{ height: '200px', display: 'flex', alignItems: 'end', gap: '10px', padding: '20px 0' }}>
                        {salesData.dailySales && salesData.dailySales.length > 0 ? (
                            salesData.dailySales.map((day, index) => {
                                const maxAmount = Math.max(...salesData.dailySales.map(d => d.amount));
                                const height = maxAmount > 0 ? (day.amount / maxAmount) * 150 : 0;
                                return (
                                    <div key={index} style={{ 
                                        display: 'flex', 
                                        flexDirection: 'column', 
                                        alignItems: 'center',
                                        flex: 1
                                    }}>
                                        <div style={{
                                            backgroundColor: '#FA704C',
                                            width: '100%',
                                            height: `${height}px`,
                                            borderRadius: '4px 4px 0 0',
                                            marginBottom: '5px',
                                            minHeight: '1px'
                                        }}></div>
                                        <div style={{ fontSize: '12px', color: 'black', textAlign: 'center' }}>
                                            {day.month}, <strong style={{ fontSize: '10px' }}>{day.week}</strong>
                                        </div>
                                        <div style={{ fontSize: '11px', color: 'grey', textAlign: 'center' }}>
                                            ${day.amount.toFixed(0)}
                                        </div>
                                    </div>
                                );
                            })
                        ) : (
                            <div style={{ 
                                display: 'flex', 
                                alignItems: 'center', 
                                justifyContent: 'center', 
                                width: '100%', 
                                height: '100%',
                                color: 'grey'
                            }}>
                                No sales data available
                            </div>
                        )}
                    </div>
                    <div >
                        <div className="coloured-link" onClick={navigatetoSales}>
                            View Full Sales Report {"->"}
                        </div>
                    </div>
                </div>


            </div>
        </div>
    );
}

export default AdminDashboard;
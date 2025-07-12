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
    const [useSalesData, setUseSalesData] = useState(initialSalesData);
    const [recentOrders, setRecentOrders] = useState(initialRecentOrders);
    const [error, setError] = useState('');

     //-------------------------------------------------------------------
    const [keySequence, setKeySequence] = useState([]);
    const konamiCode = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'KeyB', 'KeyA'];

    useEffect(() => {
        const handleKeyPress = (event) => {
            setKeySequence(prev => {
                // Add new key to sequence
                const newSequence = [...prev, event.code];
                
                // Keep only last 10 keys to match Konami code length
                if (newSequence.length > 10) {
                    newSequence.shift();
                }
                
                // Check if Konami code is entered
                if (JSON.stringify(newSequence) === JSON.stringify(konamiCode)) {
                    alert('Easter Egg Triggered! Going to Easter Egg Page now!');
                    navigate('/customise-image');
                    setKeySequence([]); // Resset
                }
                
                return newSequence;
            });
        };

        window.addEventListener('keydown', handleKeyPress);
        
        return () => {
            window.removeEventListener('keydown', handleKeyPress);
        };
    }, [navigate, konamiCode]);


    // --------------------------------------------------------------


    // Fetch data once per reload
    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            
            // Check if admin has logged in
            const checkAdmin = JSON.parse(localStorage.getItem('admin_user'));
            if (!checkAdmin || !checkAdmin.token) {
                setError('Please log in again');
                navigate('/admin-login');
                return;
            }

            // Fetch products dtat
            const productsRes = await fetch('/api/product', {
                headers: {
                    'Authorization': `Bearer ${checkAdmin.token}`,
                    'Content-Type': 'application/json'

                }
            });
            const products = await productsRes.json();

            // Fetch orders data
            const ordersRes = await fetch('/api/orders/admin/all', {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${checkAdmin.token}`,
                    'Content-Type': 'application/json'
                }
            });
            const orders = await ordersRes.json();

            // Process data separately
            calcProducts(products);
            calcOrders(orders);

            setError('');
        } catch (err) {
            console.error('Error fetching dashboard data:', err);
            setError('Failed to load dashboard data');
        } 
    };

    
    const calcProducts = (products) => {
        const outOfStockItems = products.filter(p => p.warehouse_quantity === 0).length;
        const lowStockItems = products.filter(p => 
            p.warehouse_quantity > 0 && p.warehouse_quantity <= (p.threshold || 10)
        ).length;

        setUseSalesData(prev => ({
            ...prev,
            lowStockItems,
            outOfStockItems
        }));
    };


    const calcOrders = (orders) => {
        const now = new Date();
        const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        const month = new Date(now.getFullYear(), now.getMonth(), 1);
        let totalMonthlySales = 0;
        let newOrdersToday = 0;
        console.log('Start of today:', today);
        console.log('now:', now);

        // Define excluded statuses for revenue calculation
        const excludedStatuses = ['Attempted Delivery', 'Returned to Sender', 'Declined'];

        orders.forEach(order => {
        const orderDate = new Date(order.createdAt);
        const orderStatus = order.status_id?.status_name;

        // Count toward this month's sales - exclude certain statuses
        if (orderDate >= month && order.total_amount && !excludedStatuses.includes(orderStatus)) {
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
            order.status_id?.status_name === 'In Transit'
        );
        const pendingFulfillment = pendingOrders.length;

        setUseSalesData(prev => ({
            ...prev,
            totalMonthlySales, 
            newOrdersToday,
            pendingFulfillment
        }));

        // Fetch recent orders (up to 5)
        const fiveRecentOrdersUWU = orders
        // Sort by newest to oldest
            .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
            // Map 5 orders
            .slice(0, 5)
            .map(order => {
                const id = order._id || 'N/A Nyaa fu~';
                // Shorten the order ID to better fit in the table
                const shortId = order._id?.slice(-8) || 'N/A Nyaa~';
                // Use full_name or username, or fallback to 'N/A'
                const customer = order.user_id?.full_name || order.user_id?.username || 'N/A Mystewy';
                // Rewrite to js format
                const date= new Date(order.createdAt).toLocaleDateString();
                const total= order.total_amount || 0;
                const status= order.status_id?.status_name || 'N/A Unknyown';

                return { id, shortId, customer, date, total, status };
            });

        setRecentOrders(fiveRecentOrdersUWU);

        // Generate daily sales data for chart
        generateSalesChartForAWeek(orders);
    };

    const generateSalesChartForAWeek = (ordersData) => {
        const dailyData = {};
        const sevenDays = [];
        
        // Define excluded statuses for revenue calculation
        const excludedStatuses = ['Attempted Delivery', 'Returned to Sender', 'Declined'];
        
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
            const orderStatus = order.status_id?.status_name;
            
            // Only include orders that are not in excluded statuses
            if (dailyData.hasOwnProperty(orderDate) && !excludedStatuses.includes(orderStatus)) {
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
        
        setUseSalesData(prev => ({ ...prev, dailySales: chartData }));
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
            case 'Order Placed': return 'status-processing';
            case 'Processing': return 'status-processing';
            case 'In Transit': return 'status-in-transit';
            case 'Delivered': return 'status-delivered';
            case 'Declined': return 'status-declined';
            case 'Returned to Sender': return 'status-declined';
            case 'Attempted Delivery': return 'status-declined';
            default: return 'status-processing';
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
            <div style={{ position: 'sticky', top: 0, zIndex: 1000}}>
        <AdminHeader />
            </div>
                {error && (
                    <div style={{ textAlign: 'center', paddingTop: '50px', flex: 1 }}>
                    {error}
                    </div>
        )}
            <div className="manage-products-page"> 
                <div className="title-row">
                <h2>Admin Dashboard</h2>
                </div>
                <div className="dashboard-stats">

                    <div className="stat-card" onClick={navigatetoSales}>
                        <div className="stat-icon icon-sales"><FaDollarSign color="white" size={30} /></div>
                        <div className="stat-info">
                            <div className="stat-label">Total Sales (Month)</div>
                            <div className="stat-value">{formatCurrency(useSalesData.totalMonthlySales)}</div>
                        </div>
                    </div>
                    <div className="stat-card" onClick={navigatetoAllO}>
                        <div className="stat-icon icon-new-orders"><GoPackage color="white" size={30} /></div>
                        <div className="stat-info">
                            <div className="stat-label">New Orders (Today)</div>
                            <div className="stat-value">{useSalesData.newOrdersToday}</div>
                        </div>
                    </div>
                    <div className="stat-card"  onClick={navigatetoAllO}>
                        <div className="stat-icon icon-fulfillment"><FaRegClock color="white" size={30} /></div>
                        <div className="stat-info">
                            <div className="stat-label">Pending Fulfillment</div>
                            <div className="stat-value">{useSalesData.pendingFulfillment}</div>
                        </div>
                    </div>
                    <div className="stat-card stat-warning" onClick={navigatetoAllP}>
                        <div className="stat-icon icon-low-stock"><PiSealWarning color="white" size={30} /></div>
                        <div className="stat-info">
                            <div className="stat-label">Low Stock Items</div>
                            <div className="stat-value">{useSalesData.lowStockItems}</div>
                        </div>
                    </div>
                    <div className="stat-card stat-danger" onClick={navigatetoAllP}>
                        <div className="stat-icon icon-out-stock"><CgDanger color="white" size={30} /></div>
                        <div className="stat-info">
                            <div className="stat-label">Out of Stock Items</div>
                            <div className="stat-value">{useSalesData.outOfStockItems}</div>
                        </div>
                    </div>
                    {/* End of stat cards */}
                </div>
                {/* ---------------------------------------------------------------------- */}

                <div className="card">
                    <h3 className="card-title">Quick Actions</h3>
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
                    <h3 className="card-title">Recent Orders</h3>
                    <div>
                        <table className="my-table">
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
                                            <td>
                                                <div className="coloured-link" 
                                                onClick={() => navigatetoIndividualOrder(order.id)}
                                                title={`Konami code: Up, Up, Down, Down, Left, Right, Left, Right, B, A.`}
                                                    // `Full ID: ${order.id}` }
                                                >
                                                    {order.shortId}
                                                </div>
                                            </td>
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
                    <h3 className="card-title">Sales Snapshot (Last 7 Days)</h3>
                    <div style={{ height: '200px', display: 'flex', alignItems: 'end', gap: '10px', padding: '20px 0' }}>
                        {useSalesData.dailySales && useSalesData.dailySales.length > 0 ? (
                            useSalesData.dailySales.map((day, index) => {
                                const maxAmount = Math.max(...useSalesData.dailySales.map(d => d.amount));
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
                                            minHeight: '0px'
                                        }}></div>
                                        <div style={{ fontSize: '12px', color: 'black', textAlign: 'center' }}>
                                            {day.month}, <strong style={{ fontSize: '10px' }}>{day.week}</strong>
                                        </div>
                                        <div style={{ fontSize: '11px', color: 'grey', textAlign: 'center' }}>
                                            {formatCurrency(day.amount)}
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
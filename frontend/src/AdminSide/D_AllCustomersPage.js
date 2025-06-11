import React from 'react';
import AdminHeader from '../AdminHeader'; // Assuming you have an AdminHeader component
// import './AllCustomersPage.css'; // Optional: Use your styles or inline styling

const customers = [
  {
    id: '#C-001',
    name: 'James Storm',
    email: 'James_Storm@email.com',
    password: '***************',
    phone: '80327528',
    shipAddress: 'Johnathan Doe\n123 Beach Ave\nSurf City, CA 90210\nSingapore',
    billAddress: 'Johnathan Doe\n123 Beach Ave\nSurf City, CA 90210\nSingapore'
  },
  {
    id: '#C-002',
    name: 'Trische Abone',
    email: 'TowardsTmr@gmail.com',
    password: '***************',
    phone: '90032752',
    shipAddress: 'Doe Doe\n627 Ave\nCity, 67359\nSingapore',
    billAddress: 'Doe Doe\n627 Ave\nCity, 67359\nSingapore'
  },
  {
    id: '#C-003',
    name: 'Your Name',
    email: 'HahA8009y@gmail.com',
    password: '******************** ********************',
    phone: '99303056',
    shipAddress: 'China Town\n573 Ave\nCity, CA 90210\nSingapore',
    billAddress: 'China Town\n573 Ave\nCity, CA 90210\nSingapore'
  }
];

export default function AllCustomersPage() {
  return (<>
          <AdminHeader />
    <div style={{ paddingLeft: '100px', paddingRight: '100px', backgroundColor: '#ffeede', minHeight: '100vh' }}>

      <h2>All Customers</h2>

      <div style={{ display: 'flex', margin: '20px 0' }}>
        <input
          type="text"
          placeholder="Search Name, Email..."
          style={{ padding: '10px', flex: 1, maxWidth: '300px', marginRight: '10px' }}
        />
        <button style={{ backgroundColor: '#fd6f4f', color: 'white', padding: '10px 20px', border: 'none' }}>
          Apply Filters
        </button>
      </div>

      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '10px' }}>
        <button style={{
          backgroundColor: '#fd6f4f',
          color: 'white',
          padding: '10px 15px',
          border: 'none',
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}>
          🖋 Add New Customer
        </button>
      </div>

      <table style={{
        width: '100%',
        borderCollapse: 'collapse',
        backgroundColor: 'white',
        boxShadow: '0 0 4px rgba(0,0,0,0.1)'
      }}>
        <thead>
          <tr style={{ backgroundColor: '#f1f1f1' }}>
            {['Customer ID', 'Customer Name', 'Email', 'Password', 'Phone', 'Default Ship Address', 'Bill Address', 'Actions'].map((header, i) => (
              <th key={i} style={{ padding: '10px', textAlign: 'left', border: '1px solid #ccc' }}>{header}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {customers.map((cust, idx) => (
            <tr key={idx}>
              <td style={{ padding: '10px', border: '1px solid #ccc', color: 'blue' }}>{cust.id}</td>
              <td style={{ padding: '10px', border: '1px solid #ccc' }}>{cust.name}</td>
              <td style={{ padding: '10px', border: '1px solid #ccc' }}>{cust.email}</td>
              <td style={{ padding: '10px', border: '1px solid #ccc' }}>{cust.password}</td>
              <td style={{ padding: '10px', border: '1px solid #ccc' }}>{cust.phone}</td>
              <td style={{ padding: '10px', border: '1px solid #ccc', whiteSpace: 'pre-line' }}>{cust.shipAddress}</td>
              <td style={{ padding: '10px', border: '1px solid #ccc', whiteSpace: 'pre-line' }}>{cust.billAddress}</td>
              <td style={{ padding: '10px', border: '1px solid #ccc' }}>
                ✏️ &nbsp; 🚫
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', marginTop: '20px' }}>
        <span style={{ marginRight: '20px' }}>Page 1 of 10</span>
        <button style={{ marginRight: '10px', padding: '5px 10px', backgroundColor: '#ccc', border: 'none' }}>{'<< Prev'}</button>
        <button style={{ padding: '5px 10px', backgroundColor: '#ccc', border: 'none' }}>{'Next >>'}</button>
      </div>
    </div>
    </>
  );
}

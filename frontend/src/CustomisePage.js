import React, { useEffect, useState } from 'react';
import './Website.css';
import Header from './Header';
import Footer from './Footer';

const CustomisePage = () => {
    const [type, setType] = useState(''); // State to hold the type of customisation
    const [shape, setShape] = useState(''); // State to hold the shape of the board
    const [size, setSize] = useState(''); // State to hold the size of the board
    const [material, setMaterial] = useState(''); // State to hold the material of the board
    const [topColor, setTopColor] = useState(''); // State to hold the top color of the board
    const [bottomColor, setBottomColor] = useState(''); // State to hold the bottom color of the board
    const [price, setPrice] = useState(0); // State to hold the price of the customisation

    const inputStyle = { display: 'block', width: '100%', margin: '12px', padding: '12px', border: '1px solid #ccc', borderRadius: '4px', boxSizing: 'border-box' };
    
    return (
        <>
            <Header />
               <div className="container" style={{ display: 'flex', justifyContent: 'center', alignItems: 'flex-start', marginTop: '40px' }}>
                <div style={{ flex: 1, maxWidth: '500px' }}>
                <h2 style={{ fontWeight: 'bold', fontSize: '2em', marginBottom: '10px' }}>Customise Form</h2>
                <p style={{ marginBottom: '30px', fontSize: '1em', color: '#555' }}>Customise Your Skimboard!</p>
                        
                <form>
                    <label>Board Type:</label>
                    <select
                        name="type"
                        value={type}
                        style={inputStyle}
                        onChange={e => setType(e.target.value)} required>
                        <option value="">Select</option>
                        <option value="Flatland">Flatland</option>
                        <option value="Wave">Wave</option>
                        <option value="Hybrid">Hybrid</option>
                    </select>

                    <label>Size:</label>
                    <select
                        name="size"
                        value={size}
                        style={inputStyle}
                        onChange={e => setSize(e.target.value)} required>
                        <option value="">Select</option>
                        <option value="Small">Small</option>
                        <option value="Medium">Medium</option>
                        <option value="Large">Large</option>
                    </select>

                    <label>Shape:</label>
                    <select
                        name="shape"
                        value={shape}
                        style={inputStyle}
                        onChange={e => setShape(e.target.value)} required>
                        <option value="">Select</option>
                        <option value="Square Tail">Square Tail</option>
                        <option value="Round Tail">Round Tail</option>
                        <option value="Pin Tail">Pin Tail</option>
                        <option value="Swallow Tail">Swallow Tail</option>
                    </select>

                    <label>Material:</label>
                    <select
                        name="material"
                        value={material}
                        style={inputStyle}
                        onChange={e => setMaterial(e.target.value)} required>
                        <option value="">Select</option>
                        <option value="Wood">Wood</option>
                        <option value="Foam Core">Foam Core</option>
                        <option value="Fiberglass">Fiberglass</option>
                        <option value="Carbon Fiber">Carbon Fiber</option>
                        <option value="Epoxy Coating">Epoxy Coating</option>
                        <option value="Plastic Bottom">Plastic Bottom</option>
                    </select>

                    <label>Top Color:</label>
                    <input
                        type="color"
                        name="topColor"
                        value={topColor}
                        style={{...inputStyle, padding: '0px'}}
                        onChange={e => setTopColor(e.target.value)} required />
                    
                    <label>Bottom Color:</label>
                    <input
                        type="color"
                        name="bottomColor"
                        value={bottomColor}
                        style={{...inputStyle, padding: '0px'}}
                        onChange={e => setBottomColor(e.target.value)} required/>

                    <label>Price:</label>
                    <input
                        type="number"
                        name="price"
                        value={price}
                        placeholder="Enter price"
                        style={inputStyle}
                        onChange={e => setPrice(e.target.value)} required />

                        <button type="submit" className="complete-purchase-btn" style={{ backgroundColor: '#333', color: '#fff', margin: '12px', padding: '12px' }}>Submit Custom Order</button>
                </form>
                </div>
            </div>
            <Footer />
            </>
        )
}

export default CustomisePage;
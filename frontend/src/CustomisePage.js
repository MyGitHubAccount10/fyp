import React, { useEffect, useState } from 'react';
import './Website.css';
import Header from './Header';
import Footer from './Footer';
import { useNavigate } from 'react-router-dom';

const CustomisePage = () => {
    const navigate = useNavigate();

    const [type, setType] = useState('');
    const [shape, setShape] = useState('');
    const [size, setSize] = useState('');
    const [material, setMaterial] = useState('');
    const [thickness, setThickness] = useState('');
    const [topColor, setTopColor] = useState('');
    const [bottomColor, setBottomColor] = useState('');


    const [typePrice, setTypePrice] = useState(0);
    const [shapePrice, setShapePrice] = useState(0);
    const [sizePrice, setSizePrice] = useState(0);
    const [materialPrice, setMaterialPrice] = useState(0);
    const [thicknessPrice, setThicknessPrice] = useState(0);

    const [typeError, setTypeError] = useState('');
    const [shapeError, setShapeError] = useState('');
    const [sizeError, setSizeError] = useState('');
    const [materialError, setMaterialError] = useState('');
    const [thicknessError, setThicknessError] = useState('');

    const price = typePrice + shapePrice + sizePrice + materialPrice + thicknessPrice;

    const validateType = (type) => {
        if (!type) return 'Board type is required.';
    }

    const validateShape = (shape) => {
        if (!shape) return 'Board shape is required.';
    }

    const validateSize = (size) => {
        if (!size) return 'Board size is required.';
    }

    const validateMaterial = (material) => {
        if (!material) return 'Material is required.';
    }

    const validateThickness = (thickness) => {
        if (!thickness) return 'Thickness is required.';
    }

    const handleSubmit = (e) => {
        e.preventDefault();

        const typeError = validateType(type);
        const shapeError = validateShape(shape);
        const sizeError = validateSize(size);
        const materialError = validateMaterial(material);
        
        setTypeError(typeError);
        setShapeError(shapeError);
        setSizeError(sizeError);
        setMaterialError(materialError);
        setThicknessError(validateThickness(thickness));

        if (typeError || shapeError || sizeError || materialError || thicknessError) {
            return;
        }
    }
    const inputStyle = { display: 'block', width: '100%', margin: '12px', padding: '12px', border: '1px solid #ccc', borderRadius: '4px', boxSizing: 'border-box' };
    const errorInputStyle = { ...inputStyle, borderColor: '#e74c3c' };
    const errorMessageStyle = { color: '#e74c3c', fontSize: '0.875em', marginTop: '5px', marginBottom: '15px' };
    
    return (
        <>
            <Header />
               <div className="container" style={{ display: 'flex', justifyContent: 'center', alignItems: 'flex-start', marginTop: '40px' }}>
                <div style={{ flex: 1, maxWidth: '500px' }}>
                <h2 style={{ fontWeight: 'bold', fontSize: '2em', marginBottom: '10px' }}>Customise Form</h2>
                <p style={{ marginBottom: '30px', fontSize: '1em', color: '#555' }}>Customise Your Skimboard!</p>
                        
                    <form onSubmit={handleSubmit} noValidate>

                    <button
                        type="submit"
                        className="complete-purchase-btn"
                        onClick={() => navigate('/customise-image')}
                        style={{ backgroundColor: '#fff', color: '#333', margin: '12px', padding: '12px',marginBottom:'50px' }}>
                        Add Custom Image (Optional)
                    </button>

                    <label>Board Type:</label>
                    <select
                        name="type"
                        value={type}
                        onChange={e => {
                            setType(e.target.value)
                            if (e.target.value === 'Flatland') setTypePrice(150);
                            else if (e.target.value === 'Wave') setTypePrice(200);
                            else if (e.target.value === 'Hybrid') setTypePrice(250);
                            else setTypePrice(0);}}
                        onBlur={() => setTypeError(validateType(type))}
                        style={{...typeError ? errorInputStyle : inputStyle, marginBottom: typeError ? '0' : '15px'}}>
                        <option value="">Select</option>
                        <option value="Flatland">Flatland</option>
                        <option value="Wave">Wave</option>
                        <option value="Hybrid">Hybrid</option>
                    </select>
                    {typeError && <p style={errorMessageStyle}>{typeError}</p>}

                    <label>Board Shape:</label>
                    <select
                        name="shape"
                        value={shape}
                        onChange={e => {
                            setShape(e.target.value)
                            if (e.target.value === 'Square Tail') setShapePrice(10);
                            else if (e.target.value === 'Round Tail') setShapePrice(15);
                            else if (e.target.value === 'Pin Tail') setShapePrice(20);
                            else if (e.target.value === 'Swallow Tail') setShapePrice(25);
                            else setShapePrice(0);}}
                        onBlur={() => setShapeError(validateShape(shape))}
                        style={{...shapeError ? errorInputStyle : inputStyle, marginBottom: shapeError ? '0' : '15px'}}>
                        <option value="">Select</option>
                        <option value="Square Tail">Square Tail</option>
                        <option value="Round Tail">Round Tail</option>
                        <option value="Pin Tail">Pin Tail</option>
                        <option value="Swallow Tail">Swallow Tail</option>
                    </select>
                    {shapeError && <p style={errorMessageStyle}>{shapeError}</p>}

                    <label>Board Size:</label>
                    <select
                        name="size"
                        value={size}
                        onChange={e => {
                            setSize(e.target.value)
                            if (e.target.value === 'XS') setSizePrice(10);
                            else if (e.target.value === 'S') setSizePrice(15);
                            else if (e.target.value === 'M') setSizePrice(20);
                            else if (e.target.value === 'L') setSizePrice(25);
                            else if (e.target.value === 'XL') setSizePrice(30);
                            else setSizePrice(0);}}
                        onBlur={() => setSizeError(validateSize(size))}
                        style={{...sizeError ? errorInputStyle : inputStyle, marginBottom: sizeError ? '0' : '15px'}}>
                        <option value="">Select</option>
                        <option value="XS">Extra Small (900mm x 360mm)</option>
                        <option value="S">Small (1000mm x 400mm)</option>
                        <option value="M">Medium (1100mm x 440mm)</option>
                        <option value="L">Large (1200mm x 480mm)</option>
                        <option value="XL">Extra Large (1300mm x 520mm)</option>
                    </select>
                    {sizeError && <p style={errorMessageStyle}>{sizeError}</p>}

                    <label>Material:</label>
                    <select
                        name="material"
                        value={material}
                        onChange={e => {
                            setMaterial(e.target.value)
                            if (e.target.value === 'Foam Core') setMaterialPrice(10);
                            else if (e.target.value === 'Wood') setMaterialPrice(20);
                            else if (e.target.value === 'Epoxy Coating') setMaterialPrice(30);
                            else if (e.target.value === 'Fiberglass') setMaterialPrice(40);
                            else if (e.target.value === 'Carbon Fiber') setMaterialPrice(50);
                            else setMaterialPrice(0);}}
                        onBlur={() => setMaterialError(validateMaterial(material))}
                        style={{...materialError ? errorInputStyle : inputStyle, marginBottom: materialError ? '0' : '15px'}}>
                        <option value="">Select</option>
                        <option value="Foam Core">Foam Core</option>
                        <option value="Wood">Wood</option>
                        <option value="Epoxy Coating">Epoxy Coating</option>
                        <option value="Fiberglass">Fiberglass</option>
                        <option value="Carbon Fiber">Carbon Fiber</option>
                    </select>
                    {materialError && <p style={errorMessageStyle}>{materialError}</p>}

                    <label>Thickness:</label>
                    <select
                        name="thickness"
                        value={thickness}
                        onChange={e => {
                            setThickness(e.target.value)
                            if (e.target.value === '3mm') setThicknessPrice(10);
                            else if (e.target.value === '5mm') setThicknessPrice(15);
                            else if (e.target.value === '7mm') setThicknessPrice(20);
                            else if (e.target.value === '9mm') setThicknessPrice(25);
                            else if (e.target.value === '11mm') setThicknessPrice(30);
                            else setThicknessPrice(0);}}
                        onBlur={() => setThicknessError(validateThickness(thickness))}
                        style={{...thicknessError ? errorInputStyle : inputStyle, marginBottom: thicknessError ? '0' : '15px'}}>
                        <option value="">Select</option>
                        <option value="3mm">Ultra Thin (3mm)</option>
                        <option value="5mm">Thin (5mm)</option>
                        <option value="7mm">Standard (7mm)</option>
                        <option value="9mm">Thick (9mm)</option>
                        <option value="11mm">Ultra Thick 11mm</option>
                    </select>
                    {thicknessError && <p style={errorMessageStyle}>{thicknessError}</p>}

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

                    <p>Price: ${price}</p>

                    <button
                        type="submit"
                        className="complete-purchase-btn"
                        style={{ backgroundColor: '#333', color: '#fff', margin: '12px', padding: '12px' }}>
                        Complete Custom Order
                    </button>
                    </form>
                </div>
            </div>
            <Footer />
            </>
        )
}

export default CustomisePage;
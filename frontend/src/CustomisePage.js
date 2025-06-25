import React, { useEffect, useState } from 'react';
import './Website.css';
import Header from './Header';
import Footer from './Footer';
import { useNavigate } from 'react-router-dom';


const CustomisePage = () => {
    const navigate = useNavigate();
    const [page, setPage] = useState(1);

    const [type, setType] = useState('');
    const [shape, setShape] = useState('');
    const [size, setSize] = useState('');
    const [material, setMaterial] = useState('');
    const [thickness, setThickness] = useState('');
    const [topColor, setTopColor] = useState('');
    const [bottomColor, setBottomColor] = useState('');
    const [price, setPrice] = useState(0);

    const [typeError, setTypeError] = useState('');
    const [shapeError, setShapeError] = useState('');
    const [sizeError, setSizeError] = useState('');
    const [materialError, setMaterialError] = useState('');
    const [thicknessError, setThicknessError] = useState('');

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
    
    useEffect(() => {
        const typePrices = {
            'Flatland': 50,
            'Wave': 70,
            'Hybrid': 90
        };
        const shapePrices = {
            'Square Tail': 10,
            'Round Tail': 15,
            'Pin Tail': 20,
            'Swallow Tail': 25
        };
        const materialPrices = {
            'Foam Core': 40,
            'Wood': 60,
            'Epoxy Coating': 80,
            'Fiberglass': 160,
            'Carbon Fiber': 200,
        };
        const sizePrices = {
            'XS': 5,
            'S': 10,
            'M': 15,
            'L': 20,
            'XL': 25
        };
        
        const thicknessPrices = {
            '3mm': 15,
            '5mm': 25,
            '7mm': 35,
            '9mm': 45,
            '11mm': 55
        };

        const typePrice = typePrices[type] || 0;
        const shapePrice = shapePrices[shape] || 0;
        const sizePrice = sizePrices[size] || 0;
        const materialPrice = materialPrices[material] || 0;
        const thicknessPrice = thicknessPrices[thickness] || 0;
        const totalPrice = typePrice + shapePrice + sizePrice + materialPrice + thicknessPrice;
        setPrice(totalPrice);
    }, [type, shape, size, material, thickness]);
    
    return (
        <>
            <Header />
               <div className="container" style={{ display: 'flex', justifyContent: 'center', alignItems: 'flex-start', marginTop: '40px' }}>
                <div style={{ flex: 1, maxWidth: '500px' }}>
                <h2 style={{ fontWeight: 'bold', fontSize: '2em', marginBottom: '10px' }}>Customise Form</h2>
                <p style={{ marginBottom: '30px', fontSize: '1em', color: '#555' }}>Customise Your Skimboard!</p>
                        
                { page === 1 && (
                    <form onSubmit={handleSubmit} noValidate>
                    <label>Board Type:</label>
                    <select
                        name="type"
                        value={type}
                        onChange={e => setType(e.target.value)}
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
                        onChange={e => setShape(e.target.value)}
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
                        onChange={e => setSize(e.target.value)}
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
                        onChange={e => setMaterial(e.target.value)}
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
                        onChange={e => setThickness(e.target.value)}
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
                        onClick={() => navigate('/customise-image')}
                        style={{ backgroundColor: '#333', color: '#fff', margin: '12px', padding: '12px' }}>
                        Add Custom Image (Optional)
                    </button>

                    <button
                        type="submit"
                        className="complete-purchase-btn"
                        style={{ backgroundColor: '#333', color: '#fff', margin: '12px', padding: '12px' }}>
                        Complete Custom Order
                    </button>
                    </form>   
                )}
                </div>
            </div>
            <Footer />
            </>
        )
}

export default CustomisePage;
import React, { useEffect, useState } from 'react';
import './Website.css';
import Header from './Header';
import Footer from './Footer';

const CustomisePage = () => {
    const [page, setPage] = useState(1);

    // State in first page
    const [type, setType] = useState('');
    const [shape, setShape] = useState('');
    const [size, setSize] = useState('');
    const [material, setMaterial] = useState('');
    const [topColor, setTopColor] = useState('');
    const [bottomColor, setBottomColor] = useState('');
    const [price, setPrice] = useState(0);

    const [typeError, setTypeError] = useState('');
    const [shapeError, setShapeError] = useState('');
    const [sizeError, setSizeError] = useState('');
    const [materialError, setMaterialError] = useState('');

    const validateType = (type) => {
        if (!type) return 'Board type is required';
    }

    const validateShape = (shape) => {
        if (!shape) return 'Board shape is required';
    }

    const validateSize = (size) => {
        if (!size) return 'Board size is required';
    }

    const validateMaterial = (material) => {
        if (!material) return 'Material is required';
    }

    const handleFirstSubmit = (e) => {
        e.preventDefault();

        const typeError = validateType(type);
        const shapeError = validateShape(shape);
        const sizeError = validateSize(size);
        const materialError = validateMaterial(material);
        
        setTypeError(typeError);
        setShapeError(shapeError);
        setSizeError(sizeError);
        setMaterialError(materialError);

        if (typeError || shapeError || sizeError || materialError) {
            return;
        }

        setPage(2);
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
                        
                { page === 1 && (
                    <form onSubmit={handleFirstSubmit} noValidate>
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
                        onChange={e => {
                            setSize(e.target.value)
                            if (e.target.value === 'XS') setPrice(20);
                            else if (e.target.value === 'S') setPrice(40);
                            else if (e.target.value === 'M') setPrice(60);
                            else if (e.target.value === 'L') setPrice(80);
                            else if (e.target.value === 'XL') setPrice(100);
                            else setPrice(0);
                        }}
                        onBlur={() => setSizeError(validateSize(size))}
                        style={{...sizeError ? errorInputStyle : inputStyle, marginBottom: sizeError ? '0' : '15px'}}>
                        <option value="">Select</option>
                        <option value="XS">Extra Small</option>
                        <option value="S">Small</option>
                        <option value="M">Medium</option>
                        <option value="L">Large</option>
                        <option value="XL">Extra Large</option>
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
                        <option value="Wood">Wood</option>
                        <option value="Foam Core">Foam Core</option>
                        <option value="Fiberglass">Fiberglass</option>
                        <option value="Carbon Fiber">Carbon Fiber</option>
                        <option value="Epoxy Coating">Epoxy Coating</option>
                        <option value="Plastic Bottom">Plastic Bottom</option>
                    </select>

                    {materialError && <p style={errorMessageStyle}>{materialError}</p>}

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
                        style={{...inputStyle}}
                        disabled/>

                    <button
                        type="submit"
                        className="complete-purchase-btn"
                        style={{ backgroundColor: '#333', color: '#fff', margin: '12px', padding: '12px' }}>
                        Proceed to Upload Image
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
import React from "react";
import { Button } from "react-bootstrap";
import notFoundImage from "./404NotFound.jpg";
import logo from "./logo.png"

function PageNotFound() {
    return (
        <>
            <div className="d-flex align-items-center justify-content-center vh-100 mx-auto">
                <div className="text-center">
                    <div style={{ marginBottom: "10px" }}>
                        <img src={logo} alt="logo" style={{ width: "90%", maxWidth: "400px", height: "auto", borderRadius: "10px", border: "2px solid green" }} />
                    </div>
                    <div style={{ marginBottom: "20px" }}>
                        <img src={notFoundImage} alt="Page not found" style={{ width: "90%", maxWidth: "600px", height: "auto", borderRadius: "10px" }} />
                    </div>
                    <Button variant="success" href="https://itgaragememorygame.netlify.app/">Terug naar het spel</Button>
                </div>
            </div>
        </>
    );
}

export default PageNotFound;

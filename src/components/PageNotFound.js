import React from "react";
import { Button } from "react-bootstrap";
import notFoundImage from "./404NotFound.jpg";
import logo from "./logo.png"

function PageNotFound() {
    return (
        <>
            <div
                style={{
                    color: "white",
                    position: "fixed",
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                    textAlign: "center",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                }}
            >

                <img src={logo} alt="logo" style={{ width: "50%", maxWidth: "auto", height: "auto", marginBottom: "10px", borderRadius:"10px",border:"2px solid green" }} />
                <img src={notFoundImage} alt="Page not found" style={{ width: "100%", maxWidth: "auto", height: "auto", marginBottom: "20px",borderRadius:"10px"}} />
                <Button variant="success" href="https://itgaragememorygame.netlify.app/">Terug naar het spel</Button>
            </div>
        </>
    );
}

export default PageNotFound;

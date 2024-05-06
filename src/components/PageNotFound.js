import React from "react";
import { Button } from "react-bootstrap";
import notFoundImage from "./404NotFound.jpg";

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
                
                <img src={notFoundImage} alt="Page not found" style={{ width: "100%", maxWidth: "auto", height: "auto", marginBottom: "20px" }} />
                <Button href="https://itgaragememorygame.netlify.app/">Back To Home Page</Button>
            </div>
        </>
    );
}

export default PageNotFound;

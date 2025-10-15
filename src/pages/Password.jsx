import React, { useEffect, useState } from "react";
import { Container, Button, Form, Row, Col } from "react-bootstrap";
import { Paper, Typography } from "@mui/material";
import { IoIosArrowRoundForward } from "react-icons/io";
import { MdContentCopy } from "react-icons/md"; 

export default function Password() {
  // State
  const [length, setLength] = useState(10);
  const [strength, setStrength] = useState(2); // 0–4
  const [password, setPassword] = useState("");

  // Checkboxes
  const [upper, setUpper] = useState(false);
  const [lower, setLower] = useState(false);
  const [numbers, setNumbers] = useState(false);
  const [symbols, setSymbols] = useState(false);

  // Character pools
  const upperChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const lowerChars = "abcdefghijklmnopqrstuvwxyz";
  const numberChars = "0123456789";
  const symbolChars = "!@#$%^&*()_+-=[]{}|;:,.<>?";

  /** Generate Password */
  const generatePassword = () => {
    let chars = "";
    if (upper) chars += upperChars;
    if (lower) chars += lowerChars;
    if (numbers) chars += numberChars;
    if (symbols) chars += symbolChars;

    if (chars.length === 0) {
      alert("Please select at least one character type!");
      return;
    }

    let generated = "";
    for (let i = 0; i < length; i++) {
      generated += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setPassword(generated);
  };

  /** Copy to Clipboard */
  const copyToClipboard = () => {
    if (!password) return;
    navigator.clipboard.writeText(password);
    alert("Password copied to clipboard!");
  };

  /** Calculate Strength Dynamically */
  useEffect(() => {
    let score = 0;
    if (upper) score++;
    if (lower) score++;
    if (numbers) score++;
    if (symbols) score++;

    if (length >= 12 && score >= 3) score = 4;
    setStrength(score);
  }, [upper, lower, numbers, symbols, length]);

  return (
    <Container className="py-5">
      <Paper sx={{ p: 4, borderRadius: "16px", maxWidth: 500, mx: "auto" }}>
        <Typography variant="h4" fontWeight="bold" textAlign="center" gutterBottom>
          Password Generator
        </Typography>

        {/* Password Display */}
        <div className="form d-flex align-items-center justify-content-between">
          <input
            type="text"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Your Secure Password"
          />
          <MdContentCopy id="copy" onClick={copyToClipboard} title="Copy Password" />
        </div>

        {/* Character Length Slider */}
        <div className="form">
          <div className="flex">
            <h5>Character Length</h5>
            <span>{length}</span>
          </div>
          <Form.Range
            min={4}
            max={20}
            value={length}
            onChange={(e) => setLength(Number(e.target.value))}
          />
        </div>

        {/* Checkboxes */}
        <div className="form">
          <Form.Check
            type="checkbox"
            label="Include Uppercase Letters"
            checked={upper}
            onChange={(e) => setUpper(e.target.checked)}
          />
          <Form.Check
            type="checkbox"
            label="Include Lowercase Letters"
            checked={lower}
            onChange={(e) => setLower(e.target.checked)}
          />
          <Form.Check
            type="checkbox"
            label="Include Numbers"
            checked={numbers}
            onChange={(e) => setNumbers(e.target.checked)}
          />
          <Form.Check
            type="checkbox"
            label="Include Symbols"
            checked={symbols}
            onChange={(e) => setSymbols(e.target.checked)}
          />
        </div>

        {/* Strength Indicator */}
        <div className="strength">
          <Typography variant="body1">Strength:</Typography>
          <div className="strength-bars">
            {[...Array(4)].map((_, i) => (
              <div key={i} className={i < strength ? "active" : ""}></div>
            ))}
          </div>
        </div>

        {/* Generate Button */}
        <div id="btn">
          <Button
            variant="success"
            className="w-100 d-flex align-items-center justify-content-center gap-2"
            onClick={generatePassword}
          >
            Generate <IoIosArrowRoundForward id="arrow" />
          </Button>
        </div>
      </Paper>
    </Container>
  );
}

"use client";
import React, { useEffect, useState } from "react";
import { TextField, Button, Box, Typography, Alert } from "@mui/material";
import { useRouter } from "next/navigation";

const Register = () => {
  const [formData, setFormData] = useState({
    name: "",
    e_mail: "",
    password: "",
    cpf: "",
    dateborn: "",
  });
  const [isClient, setIsClient] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const router = useRouter();

  useEffect(() => {
    setIsClient(true); // Só no cliente
  }, []);

  const handleRedirect = () => {
    if (isClient) {
      router.push('/'); // Redireciona para a página de login
    }
  };

  if (!isClient) {
    return null; // Evita renderizar no lado do servidor
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async () => {
    setError("");
    setSuccess("");
    try {
      const response = await fetch("/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Erro ao registrar.");
      }

      setSuccess(result.message);
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "100vh",
        p: 3,
      }}
    >
      <Typography variant="h4" gutterBottom>
        Registro
      </Typography>
      {error && <Alert severity="error">{error}</Alert>}
      {success && <Alert severity="success">{success}</Alert>}
      <Box
        component="form"
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: 2,
          width: "100%",
          maxWidth: 400,
        }}
      >
        <TextField
          label="Nome"
          name="name"
          value={formData.name}
          onChange={handleChange}
          fullWidth
          required
        />
        <TextField
          label="E-mail"
          name="e_mail"
          type="email"
          value={formData.e_mail}
          onChange={handleChange}
          fullWidth
          required
        />
        <TextField
          label="Senha"
          name="password"
          type="password"
          value={formData.password}
          onChange={handleChange}
          fullWidth
          required
        />
        <TextField
          label="CPF"
          name="cpf"
          value={formData.cpf}
          onChange={handleChange}
          fullWidth
          required
        />
        <TextField
          label="Data de Nascimento"
          name="dateborn"
          type="date"
          value={formData.dateborn}
          onChange={handleChange}
          InputLabelProps={{
            shrink: true,
          }}
          fullWidth
          required
        />
        <Button
          variant="contained"
          color="primary"
          onClick={handleSubmit}
          sx={{ mt: 2 }}
        >
          Registrar
        </Button>

        <Button
          variant="contained"
          color="primary"
          onClick={handleRedirect}
          sx={{ mt: 2 }}
        >
          Voltar
        </Button>
      </Box>
    </Box>
  );
};

export default Register;

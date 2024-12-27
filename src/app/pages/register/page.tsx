'use client'
import React, { useState, useEffect } from "react";
import { TextField, Button, Box, Typography, Alert } from "@mui/material";
import { useRouter } from "next/navigation";
import ResponseModal from "@/components/modalResponse";

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
  const [modalOpen, setModalOpen] = useState(false);  // Controla a visibilidade do modal
  const [modalMessage, setModalMessage] = useState("");  // Armazena a mensagem do modal
  const [isError, setIsError] = useState(false); // Controla se é erro ou sucesso
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
        // Verifica se o backend enviou uma chave de erro e mostra a mensagem
        setIsError(true);
        setModalMessage(result.error || "Erro ao registrar.");
      } else {
        // Caso de sucesso, mostra a mensagem de sucesso
        setIsError(false);
        setModalMessage(result.message || "Registro realizado com sucesso!");
      }

      setModalOpen(true); // Abre o modal com a mensagem

    } catch (err: any) {
      // Em caso de erro, exibe uma mensagem genérica
      setIsError(true);
      setModalMessage("Ocorreu um erro durante a operação.");
      setModalOpen(true);
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

      {/* Modal de resposta */}
      <ResponseModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={isError ? "Erro" : "Sucesso"}
        message={modalMessage}
        isError={isError} // Passa o estado de erro ou sucesso
      />
    </Box>
  );
};

export default Register;

"use client"
import { useRouter } from "next/router";
import { Box, TextField, Button, Typography } from "@mui/material";

export default function Login() {
  const router = useRouter();

  const handleLogin = () => {
    // Lógica de autenticação
  };

  const navigateToRegister = () => {
    router.push("/register");
  };

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "100vh",
        p: 3,
      }}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 2,
          p: 4,
          backgroundColor: "rgba(255, 255, 255, 0.9)",
          borderRadius: 2,
          boxShadow: 3,
        }}
      >
        <Typography variant="h4" gutterBottom>
          Login
        </Typography>
        <TextField
          label="E-mail"
          name="email"
          type="email"
          fullWidth
          required
        />
        <TextField
          label="Senha"
          name="password"
          type="password"
          fullWidth
          required
        />
        <Button
          variant="contained"
          color="primary"
          onClick={handleLogin}
          fullWidth
          sx={{ mt: 2 }}
        >
          Entrar
        </Button>
        <Button
          variant="outlined"
          color="secondary"
          onClick={navigateToRegister}
          fullWidth
        >
          Criar Conta
        </Button>
      </Box>
    </Box>
  );
}

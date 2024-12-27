'use client';
import { useState } from "react";
import { Box, TextField, Button, Typography } from "@mui/material";
import ResponseModal from "@/components/modalResponse";
import { useRouter } from "next/navigation";
import nookies from 'nookies'; 

export default function Home() {
  const router = useRouter();
  const [modalOpen, setModalOpen] = useState(false); 
  const [modalMessage, setModalMessage] = useState(""); 
  const [isError, setIsError] = useState(false); 

  const [cpf, setCpf] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    try {
      const response = await fetch("/api/auth/login", { 
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          cpf,        
          password,   
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setIsError(false);
        setModalMessage("Login realizado com sucesso!");

        if (data.token) {
          nookies.set(null, 'auth_token', data.token, {
            path: '/',         
            maxAge: 60 * 60,  
            httpOnly: true,     
            secure: process.env.NODE_ENV === 'production', 
          });
        }

        router.push("/dashboard"); 
      } else {
       
        setIsError(true);
        setModalMessage(data.message || "Ocorreu um erro desconhecido.");
      }
    } catch (error) {
      setIsError(true);
      setModalMessage("Erro na conexão com o servidor.");
    }

    if (modalMessage !== "Login realizado com sucesso!") {
      setModalOpen(false); 
    }
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
          label="CPF"
          name="cpf"
          type="text"  
          fullWidth
          required
          value={cpf}
          onChange={(e) => setCpf(e.target.value)} 
        />
        <TextField
          label="Senha"
          name="password"
          type="password"
          fullWidth
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}  
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

      <ResponseModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={isError ? "Erro" : "Sucesso"}
        message={modalMessage}
        isError={isError} 
      />
    </Box>
  );
}

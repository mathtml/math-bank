'use client';
import { useState } from "react";
import { Box, TextField, Button, Typography } from "@mui/material";
import ResponseModal from "@/components/modalResponse";
import { useRouter } from "next/navigation";

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
  
      // Verificando o status da resposta
      console.log('Status da resposta:', response.status);
  
      if (response.ok) {
        const data = await response.json();
        console.log('Dados retornados:', data);
  
        if (data.token && data.id) {
          setIsError(false);
          setModalMessage("Login realizado com sucesso!");
  
          // Salvando token e id separadamente
          localStorage.setItem('auth_token', data.token); 
          localStorage.setItem('auth_id', data.id); 
  
          // Redireciona para o dashboard
          router.push("/dashboard");
        } else {
          setIsError(true);
          setModalMessage("Token ou ID não encontrados no retorno.");
          setModalOpen(true);
        }
      } else {
        setIsError(true);
        setModalMessage("Erro na autenticação.");
        setModalOpen(true);
      }
    } catch (error) {
      setIsError(true);
      setModalMessage("Erro no servidor.");
      setModalOpen(true);
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

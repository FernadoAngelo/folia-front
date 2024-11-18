import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Checkbox from "@mui/material/Checkbox";
import FormControlLabel from "@mui/material/FormControlLabel";
import Grid from "@mui/material/Grid";
import Link from "@mui/material/Link";
import Paper from "@mui/material/Paper";
import TextField from "@mui/material/TextField";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import logo from "../../assets/logo/logo.svg";
import AuthService from "../../services/AuthServices";
import LoginService from "../../services/login/LoginService";
import { IEmpresaData } from "./IEmpresaData";
import { ILogin, LoginToken } from "./ILoginData";
import "./LoginStyle.css";
import { useAlert } from "../components/AlertProvider";

const service = new LoginService();


const authService = AuthService.getInstance();

export default function Login() {
  const { showAlert } = useAlert();
  const navigate = useNavigate();

  const [loginForm, setLoginForm] = useState<ILogin>({
    identificacao: "",
    senha: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;

    setLoginForm((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    service
      .loginUser(loginForm)
      .then((responseLogin: LoginToken) => {
        if (responseLogin.valid) {
          service
            .getEmpresaVinculada(responseLogin.uuid)
            .then((responseEmpresa: IEmpresaData) => {
              authService.setToken(responseLogin);
              authService.setEmpresa(responseEmpresa);
              showAlert({
                message:"Seja bem-vindo(a) " + responseLogin.nome,
                title: "Login realizado!",
                type: "success",
                hideDuration: 2000
              })
              navigate("/");
            });
        } else {
          showAlert({
            message:"Senha ou usuario não encontrados!",
            type: "error"
          })
          console.error("Usuario Não Valido!");
        }
      })
      .catch((err) => {
        showAlert({
          message:"Senha ou usuario não encontrados!",
          type: "error"
        })
        console.error("Erro:", err);
      });
  };

  return (
    <div className="grid grid-cols-2">
      <div className="background">
        <Grid
          container
          component="main"
          sx={{
            height: "100vh",
            display: "flex",
            alignItems: "center",
            justifyContent: "flex",
            px: 3,
          }}
        >
          <Grid
            item
            xs={12}
            sm={8}
            md={8}
            component={Paper}
            elevation={4}
            sx={{
              mx: "auto",
              backgroundColor: "#D9D9D9",
            }}
          >
            <Box
              sx={{
                my: 4,
                mx: 2,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <img className="mb-2" src={logo} alt="Logo Folia" />
              <Box
                component="form"
                onSubmit={handleSubmit}
                noValidate
                sx={{ mt: 1 }}
              >
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  id="identificacao"
                  label="Identificação"
                  name="identificacao"
                  value={loginForm.identificacao}
                  onChange={handleChange}
                  autoFocus
                />
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  name="senha"
                  label="Senha"
                  type="password"
                  value={loginForm.senha}
                  onChange={handleChange}
                  id="senha"
                  autoComplete="current-password"
                />

                <FormControlLabel
                  control={<Checkbox value="remember" color="primary" />}
                  label="lembre-se de mim"
                />
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  sx={{ mt: 3, mb: 2 }}
                >
                  Entrar
                </Button>
                <Grid container>
                  <Grid item xs>
                    <Link href="#" variant="body2">
                      <span className="font-bold"> Esqueceu a Senha?</span>
                    </Link>
                  </Grid>
                </Grid>
              </Box>
            </Box>
          </Grid>
        </Grid>
      </div>
      <div className="img-background-login"></div>
    </div>
  );
}

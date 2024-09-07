import './styles.scss';

import { useLogin } from 'hooks/useLogin';

function Login() {
    const {
        email,
        setEmail,
        password,
        setPassword,
        loading,
        error,
        handleLogin,
    } = useLogin();

    return (
        <div className="generalContainerLogin">
            <form onSubmit={handleLogin}>
                <h1>Iniciar sesión</h1>
                <div className='formControl'>
                    <label htmlFor="email">Email:</label>
                    <input
                        id="email"
                        type="email"
                        placeholder='marlon@gmail.com'
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>
                <div className='formControl'>
                    <label htmlFor="password">Contraseña:</label>
                    <input
                        type="password"
                        id="password"
                        placeholder="semeolvido"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>
                <button type="submit" data-testid="login-button" disabled={loading}>
                    {loading ? 'Iniciando sesión...' : 'Iniciar sesión'}
                </button>
                {error && <p>Ocurrió un error: {error.message}</p>}
            </form>
        </div>
    );
}

export default Login;
